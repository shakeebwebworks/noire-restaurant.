from django.contrib import admin
from django.utils.html import format_html

from .models import Category, MenuItem


def _thumb(image):
    if image:
        return format_html(
            '<img src="{}" style="height:48px;width:48px;object-fit:cover;">',
            image.url,
        )
    return "-"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("photo", "name", "display_order", "is_active")
    list_editable = ("display_order", "is_active")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}

    @admin.display(description="Photo")
    def photo(self, obj):
        return _thumb(obj.image)


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = (
        "photo",
        "name",
        "category",
        "price",
        "is_featured",
        "is_available",
        "display_order",
    )
    list_editable = ("price", "is_featured", "is_available", "display_order")
    list_filter = (
        "category",
        "is_featured",
        "is_available",
        "is_vegetarian",
        "is_vegan",
        "is_gluten_free",
    )
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}

    @admin.display(description="Photo")
    def photo(self, obj):
        return _thumb(obj.image)