from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Message, Notification
from .serializers import MessageSerializer, NotificationSerializer


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "patch", "head", "options"]

    def get_queryset(self):
        user = self.request.user
        folder = self.request.query_params.get("folder", "Inbox")
        qs = Message.objects.select_related("sender", "recipient")
        if folder == "Sent":
            return qs.filter(sender=user)
        if folder == "Starred":
            return qs.filter(Q(sender=user) | Q(recipient=user), starred=True)
        return qs.filter(recipient=user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.recipient_id == request.user.id and instance.unread:
            instance.unread = False
            instance.save(update_fields=["unread"])
        return Response(self.get_serializer(instance).data)

    @action(detail=True, methods=["patch"])
    def star(self, request, pk=None):
        msg = self.get_object()
        msg.starred = not msg.starred
        msg.save(update_fields=["starred"])
        return Response(self.get_serializer(msg).data)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        n = self.get_object()
        n.read = True
        n.save(update_fields=["read"])
        return Response(self.get_serializer(n).data)
