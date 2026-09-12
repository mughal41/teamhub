from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class AccessRole(models.TextChoices):
        ADMIN = "admin", "Admin"
        MANAGER = "manager", "Manager"
        EMPLOYEE = "employee", "Employee"

    email = models.EmailField(unique=True)
    access_role = models.CharField(
        max_length=20,
        choices=AccessRole.choices,
        default=AccessRole.EMPLOYEE,
    )
    avatar = models.URLField(blank=True, default="")
    role_title = models.CharField(max_length=120, blank=True, default="")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.email} ({self.access_role})"
