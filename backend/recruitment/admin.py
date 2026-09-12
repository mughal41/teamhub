from django.contrib import admin

from .models import Candidate, JobPosting

admin.site.register(JobPosting)
admin.site.register(Candidate)
