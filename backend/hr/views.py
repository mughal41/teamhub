from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminRole, scope_employees_queryset

from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "employee_code"
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        qs = Employee.objects.select_related("department", "manager", "user")
        return scope_employees_queryset(self.request.user, qs)

    def get_permissions(self):
        if self.action in {"create", "update", "partial_update", "destroy"}:
            return [IsAdminRole()]
        return super().get_permissions()
