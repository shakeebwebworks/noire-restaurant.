from django.urls import path

from . import views

urlpatterns = [
    path("chefs/", views.ChefListView.as_view(), name="chef-list"),
    path("gallery/", views.GalleryListView.as_view(), name="gallery-list"),
    path("testimonials/", views.TestimonialListView.as_view(), name="testimonial-list"),
]