from django.db import models


class Department(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"

    name = models.CharField(max_length=120, unique=True)
    code = models.CharField(max_length=32, blank=True, default="")
    head_name = models.CharField(max_length=120, blank=True, default="")
    description = models.TextField(blank=True, default="")
    member_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
