from django.conf import settings
from django.db import models

from hr.models import Employee


class PerformanceReview(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="reviews_given",
    )
    reliability = models.PositiveSmallIntegerField(default=4)
    punctuality = models.PositiveSmallIntegerField(default=4)
    task_completion = models.PositiveSmallIntegerField(default=4)
    behavior = models.PositiveSmallIntegerField(default=4)
    feedback = models.TextField(blank=True, default="")
    period = models.CharField(max_length=64, blank=True, default="Q3 2035")
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-updated_at"]
        unique_together = ("employee", "period")

    @property
    def average(self):
        return round(
            (self.reliability + self.punctuality + self.task_completion + self.behavior) / 4,
            1,
        )
