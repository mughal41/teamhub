from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminOrManager, scope_by_employee_code

from .models import PerformanceReview
from .serializers import PerformanceReviewSerializer


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = PerformanceReview.objects.select_related("employee", "reviewer")
        return scope_by_employee_code(self.request.user, qs, field="employee__employee_code")

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [IsAdminOrManager()]
        return super().get_permissions()
