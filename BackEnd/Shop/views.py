from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

from .models import Product, ProductVariant, Order, OrderItem, AuditLog
from .serializers import (
    ProductSerializer,
    ProductVariantSerializer,
    OrderSerializer,
    AuditLogSerializer,
)
from .permissions import IsAdminorVendor, IsOwnerorAdmin


# --- Products & Variants --- #
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminorVendor]

    @action(detail=True, methods=["post"], permission_classes=[IsAdminorVendor])
    def restock(self, request, pk=None):
        """Restock a product variant instead of the base product"""
        product = self.get_object()
        variant_id = request.data.get("variant_id")
        amount = int(request.data.get("amount", 0))

        try:
            variant = product.variants.get(id=variant_id)
        except ProductVariant.DoesNotExist:
            return Response({"error": "Variant not found"}, status=status.HTTP_404_NOT_FOUND)

        if amount > 0:
            variant.stock += amount
            variant.save()
            return Response(
                {"message": f"{product.name} ({variant.price}) restocked by {amount}. New stock: {variant.stock}"}
            )
        return Response({"error": "Invalid restock amount"}, status=status.HTTP_400_BAD_REQUEST)


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAdminorVendor]


# --- Orders --- #
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerorAdmin]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ["admin", "vendor"]:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    # --- Admin/Vendor status updates ---
    @action(detail=True, methods=["post"], permission_classes=[IsAdminorVendor])
    def set_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        user = request.user

        valid_transitions = {
            "pending": ["processing", "cancelled"],
            "processing": ["shipped", "cancelled"],
            "shipped": ["completed"],
            "completed": [],
            "cancelled": [],
        }

        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        if new_status not in valid_transitions[order.status]:
            return Response(
                {"error": f"Cannot move from {order.status} to {new_status}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Deduct stock when moving pending → processing
        if order.status == "pending" and new_status == "processing":
            try:
                with transaction.atomic():
                    for item in OrderItem.objects.filter(order=order):
                        variant = item.variant
                        if variant.stock < item.quantity:
                            return Response(
                                {"error": f"Not enough stock for {variant.product.name} ({variant.price})"},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                        variant.stock -= item.quantity
                        variant.save()
                        AuditLog.objects.create(
                            user=user,
                            action_type="stock_deduction",
                            description=f"Deducted {item.quantity} from {variant.product.name} ({variant.price}) (Order #{order.id})",
                        )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Restock if cancelling after processing
        if order.status == "processing" and new_status == "cancelled":
            for item in OrderItem.objects.filter(order=order):
                variant = item.variant
                variant.stock += item.quantity
                variant.save()
                AuditLog.objects.create(
                    user=user,
                    action_type="stock_restock",
                    description=f"Restocked {item.quantity} of {variant.product.name} ({variant.price}) (Order #{order.id})",
                )

        # Always log status change
        AuditLog.objects.create(
            user=user,
            action_type="order_status_change",
            description=f"Order #{order.id} status changed from {order.status} → {new_status}",
        )

        order.status = new_status
        order.save()
        return Response({"message": f"Order status updated to {new_status}"})

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.user != request.user:
            return Response(
                {"error": "You can only cancel your own orders"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if order.status != "pending":
            return Response(
                {"error": "Only pending orders can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = "cancelled"
        order.save()
        return Response({"message": "Order cancelled successfully"})


# --- Audit Logs --- #
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminorVendor]
