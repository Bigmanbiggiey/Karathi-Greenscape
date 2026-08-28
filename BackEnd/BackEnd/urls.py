from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.db import connection
from django.http import JsonResponse


def healthz(_request):
    """Liveness + DB readiness probe. No auth, minimal work."""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        db_ok = True
    except Exception:
        db_ok = False
    return JsonResponse({"status": "ok" if db_ok else "degraded", "db": db_ok},
                        status=200 if db_ok else 503)


urlpatterns = [
    path("healthz/", healthz),
    path('admin/', admin.site.urls),
    path("api/admin/", include("Admin.urls")),
    path("api/auth/", include("Auth.urls")),
    path("api/payment/", include("Payment.urls")),
    path("api/shop/", include("Shop.urls")),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
