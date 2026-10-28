from django.urls import path

from . import views

urlpatterns = [
    path("categories/", views.CategoryListView.as_view(), name="category-list"),
    path("menu/", views.MenuItemListView.as_view(), name="menu-list"),
    path("menu/<slug:slug>/", views.MenuItemDetailView.as_view(), name="menu-detail"),
]