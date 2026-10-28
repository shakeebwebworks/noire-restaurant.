from rest_framework import generics

from .models import Chef, GalleryImage, Testimonial
from .serializers import ChefSerializer, GalleryImageSerializer, TestimonialSerializer


class ChefListView(generics.ListAPIView):
    serializer_class = ChefSerializer
    pagination_class = None
    queryset = Chef.objects.filter(is_active=True)


class GalleryListView(generics.ListAPIView):
    serializer_class = GalleryImageSerializer
    pagination_class = None
    filterset_fields = ["category"]
    queryset = GalleryImage.objects.filter(is_active=True)


class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    pagination_class = None
    queryset = Testimonial.objects.filter(is_active=True)