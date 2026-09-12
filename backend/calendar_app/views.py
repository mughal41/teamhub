from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import team_employee_ids

from .models import CalendarEvent
from .serializers import CalendarEventSerializer


class CalendarEventViewSet(viewsets.ModelViewSet):
    serializer_class = CalendarEventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = CalendarEvent.objects.all()
        if user.access_role == "admin":
            return qs
        if user.access_role == "manager":
            codes = team_employee_ids(user)
            return qs.filter(
                Q(visibility=CalendarEvent.Visibility.COMPANY)
                | Q(owner=user)
                | Q(related_employee__employee_code__in=codes)
                | Q(visibility=CalendarEvent.Visibility.TEAM)
            ).distinct()
        profile = getattr(user, "employee_profile", None)
        filters = (
            Q(visibility=CalendarEvent.Visibility.COMPANY)
            | Q(owner=user)
            | Q(related_employee=profile)
        )
        manager_user = None
        if profile and profile.manager_id:
            manager_user = getattr(profile.manager, "user", None)
        if manager_user is not None:
            filters = filters | (
                Q(visibility=CalendarEvent.Visibility.TEAM) & Q(owner=manager_user)
            )
        return qs.filter(filters).distinct()
