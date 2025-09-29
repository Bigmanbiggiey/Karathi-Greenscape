from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractUser):
    # Override default username field (AbstractUser already has username)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(_("email address"), unique=True)

    # User ID as primary key
    user_id = models.AutoField(primary_key=True)

    # User roles
    USER_TYPES = [
        ("customer", "Customer"),
        ("staff", "Staff"),
        ("admin", "Admin"),
    ]
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default="customer")

    # Only relevant for customers
    billing_address = models.TextField(blank=True, null=True)

    # First & Last name (already exist in AbstractUser, but redefined here for clarity/constraints)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    # Define which field Django uses for login
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    def __str__(self):
        return f"{self.username} ({self.user_type})"
