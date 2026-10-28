from rest_framework import generics

from .filters import MenuItemFilter
from .models import Category, MenuItem
from .serializers import CategorySerializer, MenuItemSerializer


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    pagination_class = None  # only a handful of categories
    queryset = Category.objects.filter(is_active=True)


class MenuItemListView(generics.ListAPIView):
    serializer_class = MenuItemSerializer
    filterset_class = MenuItemFilter
    queryset = MenuItem.objects.filter(category__is_active=True).select_related(
        "category"
    )


class MenuItemDetailView(generics.RetrieveAPIView):
    serializer_class = MenuItemSerializer
    lookup_field = "slug"
    queryset = MenuItem.objects.filter(category__is_active=True).select_related(
        "category"
    )