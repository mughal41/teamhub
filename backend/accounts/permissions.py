from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.access_role == "admin"
        )


class IsManagerRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.access_role == "manager"
        )


class IsAdminOrManager(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.access_role in {"admin", "manager"}
        )


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.access_role == "admin"


def team_employee_ids(user):
    """Employee codes that report to this manager (or empty)."""
    from hr.models import Employee

    profile = getattr(user, "employee_profile", None)
    if not profile:
        return []
    return list(
        Employee.objects.filter(manager=profile).values_list("employee_code", flat=True)
    )


def scope_employees_queryset(user, qs):
    if user.access_role == "admin":
        return qs
    if user.access_role == "manager":
        profile = getattr(user, "employee_profile", None)
        if not profile:
            return qs.none()
        return qs.filter(manager=profile)
    profile = getattr(user, "employee_profile", None)
    if not profile:
        return qs.none()
    # Employee can see self + direct manager (for dashboard / inbox replies)
    if profile.manager_id:
        return qs.filter(pk__in=[profile.pk, profile.manager_id])
    return qs.filter(pk=profile.pk)


def scope_by_employee_code(user, qs, field="employee__employee_code"):
    """Filter queryset linked to Employee via FK field path."""
    if user.access_role == "admin":
        return qs
    profile = getattr(user, "employee_profile", None)
    if not profile:
        return qs.none()
    if user.access_role == "manager":
        codes = team_employee_ids(user)
        return qs.filter(**{f"{field}__in": codes})
    return qs.filter(**{field: profile.employee_code})
