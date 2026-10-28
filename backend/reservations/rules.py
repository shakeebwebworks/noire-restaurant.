from datetime import date, datetime, timedelta


def slots_for(hour, rule):
    """Bookable times for one weekday's OpeningHour. Empty list = closed."""
    if hour is None or hour.is_closed or not hour.opens or not hour.closes:
        return []

    base = date(2000, 1, 1)
    current = datetime.combine(base, hour.opens)
    last = datetime.combine(base, hour.closes) - timedelta(
        minutes=rule.last_seating_minutes_before_close
    )
    step = timedelta(minutes=max(rule.slot_minutes, 5))

    slots = []
    while current <= last:
        slots.append(current.time())
        current += step
    return slots