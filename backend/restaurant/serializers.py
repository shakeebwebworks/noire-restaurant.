from rest_framework import serializers

from .models import Chef, GalleryImage, Testimonial


class ChefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chef
        fields = ["id", "name", "role", "specialty", "biography", "image", "recommendation"]


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ["id", "image", "alt_text", "caption", "category"]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ["id", "customer_name", "review", "rating", "is_sample"]