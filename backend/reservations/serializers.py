import re
from datetime import datetime, timedelta

from django.utils import timezone
from rest_framework import serializers

from .models import BookingRule, OpeningHour, Reservation
from .rules import slots_for

PHONE_CHARS = re.compile(r"^[0-9+\-\s()]+$")


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = [
            "reference", "name", "email", "phone", "date", "time",
            "guests", "special_requests", "status", "created_at",
        ]
        read_only_fields = ["reference", "status", "created_at"]

    def validate_name(self, value):
        value = " ".join(value.split())
        if len(value) < 2:
            raise serializers.ValidationError("Please enter your full name.")
        return value

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        value = value.strip()
        digits = re.sub(r"\D", "", value)
        if not PHONE_CHARS.match(value) or not 7 <= len(digits) <= 15:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value

    def validate_special_requests(self, value):
        return value.strip()

    def validate(self, attrs):
        rule = BookingRule.get()
        now = timezone.localtime()
        day = attrs["date"]
        when = attrs["time"].replace(second=0, microsecond=0)
        guests = attrs["guests"]
        attrs["time"] = when
        errors = {}

        if day < now.date():
            errors["date"] = "Please choose today or a future date."
        elif day > now.date() + timedelta(days=rule.max_days_ahead):
            errors["date"] = f"Bookings open up to {rule.max_days_ahead} days ahead."
        else:
            hour = OpeningHour.objects.filter(weekday=day.weekday()).first()
            slots = slots_for(hour, rule)
            if not slots:
                errors["date"] = "We are closed on that day. Please choose another date."
            elif when not in slots:
                errors["time"] = (
                    f"Please choose a time between {slots[0]:%H:%M} and {slots[-1]:%H:%M}."
                )
            elif timezone.make_aware(datetime.combine(day, when)) < now + timedelta(
                minutes=rule.min_notice_minutes
            ):
                errors["time"] = (
                    f"Online requests need at least {rule.min_notice_minutes} minutes "
                    "notice. Please call the restaurant for a later booking."
                )

        if guests > rule.max_guests:
            errors["guests"] = (
                f"For parties larger than {rule.max_guests}, please contact the "
                "restaurant directly."
            )

        if not errors and Reservation.objects.filter(
            email=attrs["email"],
            date=day,
            time=when,
            status__in=[Reservation.Status.PENDING, Reservation.Status.CONFIRMED],
        ).exists():
            errors["time"] = (
                "You already have a reservation request for this date and time."
            )

        if errors:
            raise serializers.ValidationError(errors)
        return attrs