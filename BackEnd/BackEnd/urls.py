from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/admin/", include("Admin.urls")),
    path("api/auth/", include("Auth.urls")),
    path("api/payment/", include("Payment.urls")),
    path("api/shop/", include("Shop.urls")),
]
