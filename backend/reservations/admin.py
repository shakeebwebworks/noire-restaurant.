from django.contrib import admin

from .models import BookingRule, OpeningHour, Reservation


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        "reference", "name", "date", "time", "guests", "status", "phone", "created_at",
    )
    list_editable = ("status",)
    list_filter = ("status", "date")
    search_fields = ("reference", "name", "email", "phone")
    date_hierarchy = "date"
    readonly_fields = ("reference", "created_at", "updated_at")
    actions = ["mark_confirmed", "mark_cancelled"]

    @admin.action(description="Mark selected as confirmed")
    def mark_confirmed(self, request, queryset):
        n = queryset.update(status=Reservation.Status.CONFIRMED)
        self.message_user(request, f"{n} reservation(s) confirmed.")

    @admin.action(description="Mark selected as cancelled")
    def mark_cancelled(self, request, queryset):
        n = queryset.update(status=Reservation.Status.CANCELLED)
        self.message_user(request, f"{n} reservation(s) cancelled.")


@admin.register(OpeningHour)
class OpeningHourAdmin(admin.ModelAdmin):
    list_display = ("weekday", "is_closed", "opens", "closes")
    ordering = ("weekday",)


@admin.register(BookingRule)
class BookingRuleAdmin(admin.ModelAdmin):
    list_display = (
        "max_guests", "slot_minutes", "last_seating_minutes_before_close",
        "max_days_ahead", "min_notice_minutes",
    )

    def has_add_permission(self, request):
        return not BookingRule.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False