from django.db import models


class JobPosting(models.Model):
    class Status(models.TextChoices):
        OPEN = "Open", "Open"
        CLOSED = "Closed", "Closed"
        DRAFT = "Draft", "Draft"

    title = models.CharField(max_length=200)
    department = models.CharField(max_length=120, blank=True, default="")
    location = models.CharField(max_length=120, blank=True, default="")
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.OPEN)
    openings = models.PositiveIntegerField(default=1)
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class Candidate(models.Model):
    class Stage(models.TextChoices):
        APPLIED = "Applied", "Applied"
        SCREENING = "Screening", "Screening"
        INTERVIEW = "Interview", "Interview"
        OFFER = "Offer", "Offer"
        HIRED = "Hired", "Hired"
        REJECTED = "Rejected", "Rejected"

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name="candidates")
    name = models.CharField(max_length=120)
    email = models.EmailField()
    stage = models.CharField(max_length=32, choices=Stage.choices, default=Stage.APPLIED)
    avatar = models.URLField(blank=True, default="")
    notes = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
