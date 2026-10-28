from django.contrib import admin
from django.utils.html import format_html

from .models import Chef, GalleryImage, Testimonial


def _thumb(image):
    if image:
        return format_html(
            '<img src="{}" style="height:48px;width:48px;object-fit:cover;">',
            image.url,
        )
    return "-"


@admin.register(Chef)
class ChefAdmin(admin.ModelAdmin):
    list_display = ("photo", "name", "role", "specialty", "display_order", "is_active")
    list_editable = ("display_order", "is_active")
    search_fields = ("name", "role", "specialty")

    @admin.display(description="Photo")
    def photo(self, obj):
        return _thumb(obj.image)


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("photo", "caption", "category", "display_order", "is_active")
    list_editable = ("display_order", "is_active")
    list_filter = ("category", "is_active")
    search_fields = ("caption", "alt_text")

    @admin.display(description="Photo")
    def photo(self, obj):
        return _thumb(obj.image)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("customer_name", "rating", "is_sample", "is_active", "created_at")
    list_editable = ("is_active",)
    list_filter = ("is_active", "is_sample", "rating")
    search_fields = ("customer_name", "review")