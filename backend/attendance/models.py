from django.db import models

from hr.models import Employee


class AttendanceRecord(models.Model):
    class Status(models.TextChoices):
        ON_TIME = "On-Time", "On-Time"
        LATE = "Late", "Late"
        ABSENT = "Absent", "Absent"
        ON_LEAVE = "On Leave", "On Leave"

    class ApprovalStatus(models.TextChoices):
        NONE = "None", "None"
        PENDING = "Pending", "Pending"
        APPROVED = "Approved", "Approved"
        REJECTED = "Rejected", "Rejected"

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="attendance")
    date = models.DateField()
    clock_in = models.CharField(max_length=32, blank=True, default="—")
    clock_out = models.CharField(max_length=32, blank=True, default="—")
    duration = models.CharField(max_length=32, blank=True, default="—")
    overtime = models.CharField(max_length=32, blank=True, default="0h")
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.ON_TIME)
    comment = models.TextField(blank=True, default="")
    work_model = models.CharField(max_length=32, blank=True, default="Hybrid")
    is_correction = models.BooleanField(default=False)
    forwarded_to = models.CharField(max_length=120, blank=True, default="None")
    forwarded_status = models.CharField(
        max_length=32, choices=ApprovalStatus.choices, default=ApprovalStatus.NONE
    )
    hr_approval_status = models.CharField(
        max_length=32, choices=ApprovalStatus.choices, default=ApprovalStatus.NONE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.employee.employee_code} {self.date} {self.status}"
