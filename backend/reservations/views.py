from django.db import IntegrityError
from rest_framework import generics, serializers
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import BookingRule, OpeningHour
from .rules import slots_for
from .serializers import ReservationSerializer


class BookingInfoView(APIView):
    """Public, read-only: the rules and hours the booking form needs."""

    authentication_classes = []

    def get(self, request):
        rule = BookingRule.get()
        hours = {h.weekday: h for h in OpeningHour.objects.all()}
        days = []
        for weekday in range(7):
            hour = hours.get(weekday)
            slots = slots_for(hour, rule)
            days.append(
                {
                    "weekday": weekday,
                    "is_closed": not slots,
                    "opens": hour.opens.strftime("%H:%M") if slots else None,
                    "closes": hour.closes.strftime("%H:%M") if slots else None,
                    "slots": [s.strftime("%H:%M") for s in slots],
                }
            )
        return Response(
            {
                "max_guests": rule.max_guests,
                "max_days_ahead": rule.max_days_ahead,
                "min_notice_minutes": rule.min_notice_minutes,
                "hours": days,
            }
        )


class ReservationCreateView(generics.CreateAPIView):
    """Public, create-only. Reservations can never be listed or read here."""

    serializer_class = ReservationSerializer
    # The public JSON API uses no cookie login, so CSRF does not apply to it.
    # The Django admin keeps full CSRF and login protection.
    authentication_classes = []
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "reservations"

    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError:
            raise serializers.ValidationError(
                {"time": "You already have a reservation request for this date and time."}
            )