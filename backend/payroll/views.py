from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminRole

from .models import Payslip
from .serializers import PayslipSerializer


class PayslipViewSet(viewsets.ModelViewSet):
    serializer_class = PayslipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Payslip.objects.select_related("employee")
        if user.access_role == "admin":
            return qs
        if user.access_role == "employee":
            profile = getattr(user, "employee_profile", None)
            if not profile:
                return qs.none()
            return qs.filter(employee=profile)
        # Managers have no payroll access (matches frontend)
        return qs.none()

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [IsAdminRole()]
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        if request.user.access_role == "manager":
            raise PermissionDenied("Managers cannot access payroll.")
        return super().list(request, *args, **kwargs)
