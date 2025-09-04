from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    user_type = models.CharField(
        max_length=20,
        choices=[("customer", "Customer"), ("admin", "Admin"), ("vendor", "Vendor")],
        default="customer",
    )
    user_id = models.AutoField(primary_key=True)

    REQUIRED_FIELDS = ["email"]
    USERNAME_FIELD = "username"

    def __str__(self):
        return f"{self.username} ({self.user_type})"
