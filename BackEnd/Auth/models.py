from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    username = models.CharField(max_length=30)

    email = models.EmailField(unique=True)
    user_type = models.CharField(
        max_length=20,
        choices=[("customer", "Customer"), ("staff", "Staff"), ("admin", "Admin")],
        default="customer",
    )
    user_id = models.AutoField(primary_key=True)
    billing_address = models.TextField(blank=True, null=False)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.username} ({self.user_type})"
