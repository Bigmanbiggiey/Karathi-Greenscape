from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

from .models import Product, ProductVariant, Order, AuditLog
from .serializers import (
    ProductSerializer,
    ProductVariantSerializer,
    OrderSerializer,
    RestockSerializer,
    AuditLogSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().select_related("user").prefetch_related("items__variant")
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def set_status(self, request, pk=None):
        """Change order status and handle stock deduction on completion."""
        order = self.get_object()
        new_status = request.data.get("status")

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"detail": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            if new_status == "completed" and order.status != "completed":
                # Deduct stock for all items
                for item in order.items.all():
                    if item.variant.stock < item.quantity:
                        return Response(
                            {"detail": f"Not enough stock for {item.variant}"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    item.variant.stock -= item.quantity
                    item.variant.save()

                # Audit log for completion
                AuditLog.objects.create(
                    user=request.user,
                    action_type="order_status_change",
                    description=f"Order #{order.id} marked as completed by {request.user.email}",
                )

            order.status = new_status
            order.save(update_fields=["status"])

        return Response(OrderSerializer(order, context={"request": request}).data)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().select_related("user")
    serializer_class = AuditLogSerializer
