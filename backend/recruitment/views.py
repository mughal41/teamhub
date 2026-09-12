from rest_framework import viewsets

from accounts.permissions import IsAdminRole

from .models import Candidate, JobPosting
from .serializers import CandidateSerializer, JobPostingSerializer


class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    permission_classes = [IsAdminRole]


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.select_related("job")
    serializer_class = CandidateSerializer
    permission_classes = [IsAdminRole]
