import secrets

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no 0/O/1/I confusion


def generate_reference():
    while True:
        ref = "NOI-" + "".join(secrets.choice(REF_ALPHABET) for _ in range(8))
        if not Reservation.objects.filter(reference=ref).exists():
            return ref


class OpeningHour(models.Model):
    """One row per weekday. Edit these in the admin to change opening hours."""

    WEEKDAYS = [
        (0, "Monday"), (1, "Tuesday"), (2, "Wednesday"), (3, "Thursday"),
        (4, "Friday"), (5, "Saturday"), (6, "Sunday"),
    ]

    weekday = models.PositiveSmallIntegerField(choices=WEEKDAYS, unique=True)
    is_closed = models.BooleanField(default=False)
    opens = models.TimeField(null=True, blank=True)
    closes = models.TimeField(
        null=True, blank=True, help_text="Same-day closing time (before midnight)."
    )

    class Meta:
        ordering = ["weekday"]

    def clean(self):
        if not self.is_closed:
            if not self.opens or not self.closes:
                raise ValidationError("Set opening and closing times, or tick 'closed'.")
            if self.opens >= self.closes:
                raise ValidationError("Opening time must be before closing time.")

    def __str__(self):
        return self.get_weekday_display()


class BookingRule(models.Model):
    """A single settings row that controls how booking works."""

    max_guests = models.PositiveSmallIntegerField(
        default=10, validators=[MinValueValidator(1), MaxValueValidator(50)],
        help_text="Largest party accepted online.",
    )
    slot_minutes = models.PositiveSmallIntegerField(
        default=30, validators=[MinValueValidator(5)],
        help_text="Gap between bookable times, in minutes.",
    )
    last_seating_minutes_before_close = models.PositiveSmallIntegerField(
        default=90, help_text="Last booking time = closing time minus this."
    )
    max_days_ahead = models.PositiveSmallIntegerField(default=90)
    min_notice_minutes = models.PositiveSmallIntegerField(
        default=120, help_text="Online requests need at least this much notice."
    )

    def save(self, *args, **kwargs):
        self.pk = 1  # only ever one row
        super().save(*args, **kwargs)

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Booking rules"


class Reservation(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        CANCELLED = "cancelled", "Cancelled"
        COMPLETED = "completed", "Completed"
        NO_SHOW = "no_show", "No-show"

    reference = models.CharField(max_length=16, unique=True, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    date = models.DateField()
    time = models.TimeField()
    guests = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(50)]
    )
    special_requests = models.TextField(max_length=500, blank=True)
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "time"]
        indexes = [
            models.Index(fields=["date", "time"]),
            models.Index(fields=["status"]),
        ]
        constraints = [
            # The same person cannot hold two active requests for one slot
            models.UniqueConstraint(
                fields=["email", "date", "time"],
                condition=models.Q(status__in=["pending", "confirmed"]),
                name="unique_active_reservation_per_slot",
            ),
            models.CheckConstraint(
                condition=models.Q(guests__gte=1),
                name="reservation_guests_at_least_one",
            ),
        ]

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = generate_reference()
        self.email = self.email.lower()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.reference} - {self.name} ({self.date} {self.time:%H:%M})"