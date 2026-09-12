from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsAdminOrManager, scope_by_employee_code

from .models import LeaveRequest
from .serializers import LeaveSerializer


class LeaveViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = LeaveRequest.objects.select_related("employee", "employee__department")
        return scope_by_employee_code(self.request.user, qs, field="employee__employee_code")

    def perform_create(self, serializer):
        user = self.request.user
        employee_code = self.request.data.get("employeeCode") or self.request.data.get("id")

        if user.access_role == "admin" and employee_code:
            from hr.models import Employee

            emp = Employee.objects.filter(employee_code=employee_code).first()
            if not emp:
                raise PermissionError("Employee not found")
            mgr = emp.manager.name if emp.manager else "HR"
            serializer.save(employee=emp, forwarded_to=mgr, status=LeaveRequest.Status.PENDING)
            return

        profile = getattr(user, "employee_profile", None)
        if not profile:
            raise PermissionError("No employee profile")
        mgr = profile.manager.name if profile.manager else "HR"
        serializer.save(
            employee=profile,
            forwarded_to=mgr,
            status=LeaveRequest.Status.PENDING,
        )

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except PermissionError as exc:
            return Response({"detail": str(exc)}, status=400)

    @action(detail=True, methods=["patch"], permission_classes=[IsAdminOrManager])
    def decide(self, request, pk=None):
        decision = request.data.get("status")
        if decision not in {"Approved", "Rejected"}:
            return Response({"detail": "status must be Approved or Rejected."}, status=400)
        leave = self.get_object()
        leave.status = decision
        leave.comment = request.data.get(
            "comment",
            f"{decision} by {request.user.get_full_name() or request.user.email}",
        )
        leave.save()
        return Response(LeaveSerializer(leave).data)
