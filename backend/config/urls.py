from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

admin.site.site_header = "NOIRÉ Administration"
admin.site.site_title = "NOIRÉ Admin"
admin.site.index_title = "Restaurant management"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("menu.urls")),
    path("api/", include("reservations.urls")),
    path("api/", include("restaurant.urls")),
    path("api/", include("contact.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
elif settings.SERVE_MEDIA:
    # For small sites with a persistent disk. Larger sites should use object storage.
    urlpatterns += [
        re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
    ]