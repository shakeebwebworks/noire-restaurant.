from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from menu.models import Category, MenuItem

CATEGORIES = [
    ("Starters", "Light, precise openings to the evening."),
    ("Main Course", "Considered plates built around the finest ingredients."),
    ("Signature Dishes", "The dishes NOIRÉ is known for."),
    ("Desserts", "A graceful finish."),
    ("Coffee & Beverages", "Coffee, tea and carefully chosen drinks."),
]

# (category, name, price, featured, vegetarian)
ITEMS = [
    ("Starters", "Burrata with Heirloom Tomato", "14.00", False, True),
    ("Starters", "Seared Scallops", "18.00", True, False),
    ("Main Course", "Herb-Roasted Chicken", "26.00", False, False),
    ("Main Course", "Wild Mushroom Risotto", "22.00", False, True),
    ("Signature Dishes", "Aged Ribeye, Bone Marrow Jus", "48.00", True, False),
    ("Signature Dishes", "Black Cod, Miso Glaze", "42.00", True, False),
    ("Desserts", "Dark Chocolate Fondant", "12.00", True, True),
    ("Desserts", "Vanilla Panna Cotta", "10.00", False, True),
    ("Coffee & Beverages", "Single-Origin Espresso", "4.00", False, True),
    ("Coffee & Beverages", "House Signature Cocktail", "15.00", False, True),
]


class Command(BaseCommand):
    help = "Create clearly marked SAMPLE categories and menu items."

    def handle(self, *args, **options):
        cats = {}
        for order, (name, desc) in enumerate(CATEGORIES, start=1):
            cat, _ = Category.objects.update_or_create(
                slug=slugify(name),
                defaults={"name": name, "description": desc, "display_order": order},
            )
            cats[name] = cat

        for order, (cat_name, name, price, featured, veg) in enumerate(ITEMS, start=1):
            MenuItem.objects.update_or_create(
                slug=slugify(name),
                defaults={
                    "category": cats[cat_name],
                    "name": name,
                    "description": "Sample description. Replace with the real dish details.",
                    "price": Decimal(price),
                    "is_featured": featured,
                    "is_vegetarian": veg,
                    "display_order": order,
                },
            )

        self.stdout.write(self.style.SUCCESS("Sample menu created."))