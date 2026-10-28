from rest_framework import serializers

from .models import Category, MenuItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'image', 'display_order')


class MenuItemSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(read_only=True, slug_field='slug')
    category_name = serializers.CharField(source='category.name', read_only=True)
    price = serializers.DecimalField(max_digits=8, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = MenuItem
        fields = (
            'id',
            'name',
            'slug',
            'description',
            'price',
            'image',
            'category',
            'category_name',
            'is_featured',
            'is_available',
            'is_vegetarian',
            'is_vegan',
            'is_gluten_free',
        )