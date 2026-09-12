from django.conf import settings
from django.db import models

from hr.models import Employee


class CalendarEvent(models.Model):
    class EventType(models.TextChoices):
        TEAM = "Team", "Team"
        ONE_ON_ONE = "1:1", "1:1"
        REVIEW = "Review", "Review"
        HOLIDAY = "Holiday", "Holiday"
        WORK = "Work", "Work"
        LEAVE = "Leave", "Leave"

    class Visibility(models.TextChoices):
        COMPANY = "company", "Company"
        TEAM = "team", "Team"
        PERSONAL = "personal", "Personal"

    title = models.CharField(max_length=200)
    event_type = models.CharField(max_length=32, choices=EventType.choices, default=EventType.TEAM)
    day = models.PositiveSmallIntegerField()
    month = models.PositiveSmallIntegerField(default=6)
    year = models.PositiveIntegerField(default=2035)
    time = models.CharField(max_length=64, blank=True, default="")
    location = models.CharField(max_length=200, blank=True, default="")
    with_whom = models.CharField(max_length=200, blank=True, default="")
    visibility = models.CharField(
        max_length=32, choices=Visibility.choices, default=Visibility.TEAM
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="calendar_events",
    )
    related_employee = models.ForeignKey(
        Employee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="calendar_events",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["year", "month", "day", "time"]
