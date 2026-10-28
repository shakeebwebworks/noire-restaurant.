from django.core.management.base import BaseCommand

from restaurant.models import Chef, Testimonial

CHEFS = [
    ("Head Chef (sample)", "Executive Chef", "Modern European cuisine",
     "Sample biography. Replace with the chef's real story."),
    ("Pastry Chef (sample)", "Head Pastry Chef", "Plated desserts",
     "Sample biography. Replace with the chef's real story."),
]

TESTIMONIALS = [
    ("Sample Guest A", "Sample review text. Replace with a real, verified review.", 5),
    ("Sample Guest B", "Sample review text. Replace with a real, verified review.", 5),
    ("Sample Guest C", "Sample review text. Replace with a real, verified review.", 4),
]


class Command(BaseCommand):
    help = "Create clearly marked SAMPLE chefs and testimonials."

    def handle(self, *args, **options):
        for order, (name, role, specialty, bio) in enumerate(CHEFS, start=1):
            Chef.objects.get_or_create(
                name=name,
                defaults={"role": role, "specialty": specialty,
                          "biography": bio, "display_order": order},
            )
        for order, (name, review, rating) in enumerate(TESTIMONIALS, start=1):
            Testimonial.objects.get_or_create(
                customer_name=name,
                defaults={"review": review, "rating": rating,
                          "is_sample": True, "display_order": order},
            )
        self.stdout.write(self.style.SUCCESS("Sample chefs and testimonials created."))