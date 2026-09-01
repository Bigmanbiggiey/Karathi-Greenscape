from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    # Django admin — developers only. Deliberately NOT at /admin/ so the React
    # admin UI can own that path; lock this route down at the edge as well.
    path('developer-admin/', admin.site.urls),
    path("api/admin/", include("Admin.urls")),
    path("api/auth/", include("Auth.urls")),
    path("api/payment/", include("Payment.urls")),
    path("api/shop/", include("Shop.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
