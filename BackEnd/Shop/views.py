from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied

from .models import Product, ProductVariant, Order, AuditLog
from .serializers import (
    ProductSerializer,
    ProductVariantSerializer,
    OrderSerializer,
    RestockSerializer,
    AuditLogSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().prefetch_related('variants')  # ADD THIS
    serializer_class = ProductSerializer  # ADD THIS
    permission_classes = [IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def restock(self, request, pk=None):
        """Restock a product variant"""
        product = self.get_object()
        serializer = RestockSerializer(data=request.data)
        
        if serializer.is_valid():
            variant_id = serializer.validated_data['variant_id']
            amount = serializer.validated_data['amount']
            
            try:
                variant = product.variants.get(id=variant_id)
                variant.stock += amount
                variant.save()
                
                # Create audit log
                AuditLog.objects.create(
                    user=request.user,
                    action_type="update",
                    description=f"Restocked {product.name} variant {variant.size or 'default'} by {amount}"
                )
                
                return Response({
                    "detail": "Restocked successfully",
                    "new_stock": variant.stock
                })
            except ProductVariant.DoesNotExist:
                return Response(
                    {"detail": "Variant not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all().select_related('product')
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().select_related("user").prefetch_related("items__variant")
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter orders based on user role"""
        user = self.request.user
        if user.user_type in ['admin', 'staff']:
            return Order.objects.all()
        return Order.objects.filter(user=user)

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
                    action_type="update",
                    description=f"Order #{order.id} marked as completed by {request.user.username}",
                )

            order.status = new_status
            order.save(update_fields=["status"])

        return Response(OrderSerializer(order, context={"request": request}).data)


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().select_related("user")
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Only admins can see audit logs"""
        if self.request.user.user_type == 'admin':
            return AuditLog.objects.all()
        return AuditLog.objects.none()