import django_filters

from .models import MenuItem


class MenuItemFilter(django_filters.FilterSet):
    # /api/menu/?category=desserts  and  /api/menu/?featured=true
    category = django_filters.CharFilter(field_name="category__slug")
    featured = django_filters.BooleanFilter(field_name="is_featured")

    class Meta:
        model = MenuItem
        fields = ["category", "featured"]