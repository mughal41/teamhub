from django.conf import settings
from django.db import models

from org.models import Department


class Employee(models.Model):
    class EmploymentType(models.TextChoices):
        FULL_TIME = "Full-Time", "Full-Time"
        PART_TIME = "Part-Time", "Part-Time"
        FREELANCE = "Freelance", "Freelance"
        CONTRACT = "Contract", "Contract"
        INTERNSHIP = "Internship", "Internship"

    class WorkModel(models.TextChoices):
        HYBRID = "Hybrid", "Hybrid"
        REMOTE = "Remote", "Remote"
        ON_SITE = "On-Site", "On-Site"

    class Status(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"
        ON_LEAVE = "On Leave", "On Leave"

    employee_code = models.CharField(max_length=32, unique=True)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employee_profile",
    )
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120, blank=True, default="")
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="employees",
    )
    employment_type = models.CharField(
        max_length=32, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME
    )
    work_model = models.CharField(
        max_length=32, choices=WorkModel.choices, default=WorkModel.HYBRID
    )
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.ACTIVE)
    avatar = models.URLField(blank=True, default="")
    join_date = models.DateField(null=True, blank=True)
    manager = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="direct_reports",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.employee_code} — {self.name}"
