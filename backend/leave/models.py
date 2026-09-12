from django.db import models

from hr.models import Employee


class LeaveRequest(models.Model):
    class LeaveType(models.TextChoices):
        ANNUAL = "Annual", "Annual"
        SICK = "Sick", "Sick"
        CASUAL = "Casual", "Casual"
        OTHER = "Other", "Other"

    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        APPROVED = "Approved", "Approved"
        REJECTED = "Rejected", "Rejected"

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leaves")
    leave_type = models.CharField(max_length=32, choices=LeaveType.choices)
    start_date = models.DateField()
    end_date = models.DateField()
    duration = models.CharField(max_length=64, blank=True, default="")
    reason = models.TextField(blank=True, default="")
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.PENDING)
    forwarded_to = models.CharField(max_length=120, blank=True, default="")
    comment = models.TextField(blank=True, default="")
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Snapshot quotas (demo-friendly)
    remaining_quota = models.PositiveIntegerField(default=12)
    total_quota = models.PositiveIntegerField(default=20)
    sick_remaining = models.PositiveIntegerField(default=5)
    casual_remaining = models.PositiveIntegerField(default=5)
    annual_remaining = models.PositiveIntegerField(default=10)
    other_remaining = models.PositiveIntegerField(default=2)

    class Meta:
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.employee.employee_code} {self.leave_type} {self.status}"
