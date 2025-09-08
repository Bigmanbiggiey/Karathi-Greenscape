from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    # Columns shown in the list view
    list_display = (
        "id",
        "order",
        "phone_number",
        "amount",
        "status",
        "mpesa_receipt_number",
        "transaction_date",
        "created_at",
    )
    # Add filters for easy navigation
    list_filter = ("status", "created_at", "transaction_date")
    # Make some fields searchable
    search_fields = ("order__id", "phone_number", "mpesa_receipt_number")
    # Default ordering
    ordering = ("-created_at",)
