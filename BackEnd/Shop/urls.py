from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductListCreateView, ProductDetailView, OrderListCreateView,
    OrderDetailView, ProductViewSet, AuditLogViewSet, OrderViewSet
)

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("orders", OrderViewSet, basename="order")
router.register("audit-logs", AuditLogViewSet, basename="auditlog")

urlpatterns = [
    path("", include(router.urls)),
    # Products
    path("products/", ProductListCreateView.as_view(), name="product-list"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),

    # Orders
    path("orders/", OrderListCreateView.as_view(), name="order-list"),
    path("orders/<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]
