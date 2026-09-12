from django.db import models

from hr.models import Employee


class Payslip(models.Model):
    class Status(models.TextChoices):
        PAID = "Paid", "Paid"
        PENDING = "Pending", "Pending"
        DRAFT = "Draft", "Draft"

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="payslips")
    period_date = models.CharField(max_length=64)
    salary = models.CharField(max_length=32, default="$0")
    allowance = models.CharField(max_length=32, default="$0")
    overtime = models.CharField(max_length=32, default="$0")
    incentive = models.CharField(max_length=32, default="$0")
    deduction = models.CharField(max_length=32, default="$0")
    total = models.CharField(max_length=32, default="$0")
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
