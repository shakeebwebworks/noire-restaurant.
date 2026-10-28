from django.urls import path

from . import views

urlpatterns = [
    path("booking-info/", views.BookingInfoView.as_view(), name="booking-info"),
    path("reservations/", views.ReservationCreateView.as_view(), name="reservation-create"),
]