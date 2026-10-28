from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Chef(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    specialty = models.CharField(max_length=140, blank=True)
    biography = models.TextField(blank=True)
    image = models.ImageField(upload_to="chefs/", blank=True)
    recommendation = models.CharField(
        max_length=200, blank=True, help_text="Optional dish this chef recommends."
    )
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name


class GalleryImage(models.Model):
    class Category(models.TextChoices):
        FOOD = "food", "Food"
        INTERIOR = "interior", "Interior"
        DINING = "dining", "Dining"
        CHEFS = "chefs", "Chefs"

    image = models.ImageField(upload_to="gallery/")
    alt_text = models.CharField(
        max_length=200, help_text="Describe the photo for screen readers."
    )
    caption = models.CharField(max_length=160, blank=True)
    category = models.CharField(
        max_length=12, choices=Category.choices, default=Category.FOOD
    )
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return self.caption or self.alt_text


class Testimonial(models.Model):
    customer_name = models.CharField(max_length=100)
    review = models.TextField(max_length=600)
    rating = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
    )
    is_sample = models.BooleanField(
        default=True,
        help_text="Untick only for real, verified customer reviews.",
    )
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def __str__(self):
        return f"{self.customer_name}"