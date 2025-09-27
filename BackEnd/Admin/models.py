from django.db import models

class admin_keys(models.Model):
    name = models.CharField(max_length=20)
    key = models.CharField(
        max_length=10 unique=true
    )
