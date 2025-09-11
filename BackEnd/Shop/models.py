from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

User = settings.AUTH_USER_MODEL

class Product(models.Model):
    CATEGORY_CHOICES = [
        ("flower", "Flower"),
        ("palm", "Palm Tree"),
        ("fruit", "Fruit"),
        ("ornamental", "Ornamental Tree"),
        ("exotic", "Exotic Tree"),
        ("pot", "Pot"),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=100, blank=True, help_text="E.g. Small, Medium, 2ft, 3ft")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.product.name} - {self.size or 'Default'} @ {self.price}"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey("Auth.CustomUser", on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user} - {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} * {self.variant.product.name} ({self.variant.size})"


@receiver(post_save, sender=Order)
def handle_order_status_change(sender, instance, **kwargs):
    if instance.status == "completed":
        for item in instance.items.all():
            if item.variant.stock >= item.quantity:
                item.variant.stock -= item.quantity
                item.variant.save()


class AuditLog(models.Model):
    ACTION_TYPES = [
        ("stock_deduction", "Stock Deduction"),
        ("stock_restock", "Stock Restock"),
        ("order_status_change", "Order Status Change")
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs"
    )
    action_type = models.CharField(max_length=50, choices=ACTION_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_action_type_display()} by {self.user} at {self.created_at}"
