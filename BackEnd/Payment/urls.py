from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet
from . import admin_views

router = DefaultRouter()
router.register("payments", PaymentViewSet, basename="payment")

urlpatterns = [
    # API endpoints from PaymentViewSet
    path("", include(router.urls)),

    # Admin/staff-only endpoints
    path("admin/list/", admin_views.list_payments, name="list_payments"),
    path("admin/<int:payment_id>/", admin_views.payment_detail, name="payment_detail"),
    path("admin/<int:payment_id>/reconcile/", admin_views.reconcile_payment, name="reconcile_payment"),
]
