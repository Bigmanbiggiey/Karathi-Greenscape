from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.timezone import now
from django.conf import settings

from .models import Payment
from .serializers import PaymentSerializer
from .mpesa import MpesaClient
from Shop.models import Order

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    @action(detail=False, methods=["post"])
    def initiate(self, request):
        order_id = request.data.get("order_id")
        phone_number = request.data.get("phone_number")

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        if hasattr(order, "payment"):
            return Response({"error": "Payment already initiated for this order"}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(
            order=order,
            phone_number=phone_number,
            amount=order.total_amount,
            status="pending",
        )

        mpesa = MpesaClient()
        callback_url = settings.MPESA_CALLBACK_URL
        response = mpesa.stk_push(
            phone_number=phone_number,
            amount=int(order.total_amount),
            account_reference=f"Order{order.id}",
            transaction_desc="Order Payment",
            callback_url=callback_url
        )

        return Response({
            "message": "STK Push initiated",
            "payment_id": payment.id,
            "mpesa_response": response
        })

    @action(detail=False, methods=["post"])
    def callback(self, request):
        """ Safaricom will POST here after payment attempt """
        data = request.data
        try:
            body = data["Body"]["stkCallback"]
            result_code = body["ResultCode"]
            order_id = body["MerchantRequestID"]  # or track using AccountReference
            mpesa_receipt = body.get("CallbackMetadata", {}).get("Item", [])[1]["Value"]

            # Find related payment
            payment = Payment.objects.filter(order__id=order_id).first()
            if not payment:
                return Response({"error": "Payment record not found"}, status=status.HTTP_404_NOT_FOUND)

            if result_code == 0:  # Success
                payment.status = "completed"
                payment.mpesa_receipt_number = mpesa_receipt
                payment.transaction_date = now()
                payment.save()
            else:
                payment.status = "failed"
                payment.save()

            return Response({"message": "Callback processed"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
