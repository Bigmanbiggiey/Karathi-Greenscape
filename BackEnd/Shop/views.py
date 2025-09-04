from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Product, Order, AuditLog
from .serializers import ProductSerializer, OrderSerializer, AuditLogSerializer
from .permissions import IsAdminorVendor, IsOwnerorAdmin
from django.db import transaction



# ViewSet for products to handle inventory actions
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminorVendor]

    @action(detail=True, methods=["post"], permission_classes=[IsAdminorVendor])
    def restock(self, request, pk=None):
        product = self.get_object()
        amount = int(request.data.get("amount", 0))
        if amount > 0:
            product.stock += amount
            product.save()
            return Response(
                {"message:" f"{product.name} restocked by {amount}. New stock: {product.stock}"}
            )
        return Response({"error": "Invalid restock amount"}, status=status.HTTP_400_BAD_REQUEST)

# --- Products ---#
class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

# --- Orders ---
class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ["admin", "vendor"]:
            return Order.objects.all()
        return Order.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class OrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsOwnerorAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ["admin", "vendor"]:
            return Order.objects.all()
        return Order.objects.filter(user=user)
    
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
            return Response({"error": f"Cannot move from {order.status} to {new_status}"}, status=status.HTTP_400_BAD_REQUEST)

         # Handle stock deduction when moving from pending → processing
        if order.status == "pending" and new_status == "processing":
            try:
                with transaction.atomic():
                    for item in OrderItem.objects.filter(order=order):
                        product = item.product
                        if product.stock < item.quantity:
                            return Response(
                                {"error": f"Not enough stock for {product.name}"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                        product.stock -= item.quantity
                        product.save()
                        AuditLog.objects.create(
                            user=user,
                            action_type="stock_deduction",
                            description=f"Deducted {item.quantity} from {product.name} (Order #{order.id})"
                        )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
         # If cancelling after processing → restock
        if order.status == "processing" and new_status == "cancelled":
            for item in OrderItem.objects.filter(order=order):
                product = item.product
                product.stock += item.quantity
                product.save()
                AuditLog.objects.create(
                    user=user,
                    action_type="stock_restock",
                    description=f"Restocked {item.quantity} of {product.name} (Order #{order.id})"
                )
        
         # Always log status change
        AuditLog.objects.create(
            user=user,
            action_type="order_status_change",
            description=f"Order #{order.id} status changed from {order.status} → {new_status}"
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
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status != "pending":
            return Response(
                {"error": "Only pending orders can be cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = "cancelled"
        order.save()
        return Response({"message": "Order cancelled successfully"})

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminorVendor]