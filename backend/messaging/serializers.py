from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Message, Notification

User = get_user_model()


class MessageSerializer(serializers.ModelSerializer):
    fromId = serializers.SerializerMethodField()
    fromName = serializers.SerializerMethodField()
    fromAvatar = serializers.CharField(source="sender.avatar", read_only=True)
    toEmail = serializers.EmailField(write_only=True, required=False)
    time = serializers.DateTimeField(source="created_at", read_only=True, format="%I:%M %p")

    class Meta:
        model = Message
        fields = (
            "id",
            "fromId",
            "fromName",
            "fromAvatar",
            "subject",
            "preview",
            "body",
            "time",
            "unread",
            "starred",
            "toEmail",
        )
        read_only_fields = ("id", "preview", "unread")

    def get_fromId(self, obj):
        profile = getattr(obj.sender, "employee_profile", None)
        return profile.employee_code if profile else str(obj.sender_id)

    def get_fromName(self, obj):
        return obj.sender.get_full_name() or obj.sender.email

    def create(self, validated_data):
        to_email = validated_data.pop("toEmail", None)
        request = self.context["request"]
        recipient = User.objects.filter(email__iexact=to_email).first() if to_email else None
        if not recipient:
            raise serializers.ValidationError({"toEmail": "Recipient not found."})
        return Message.objects.create(
            sender=request.user,
            recipient=recipient,
            **validated_data,
        )


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "title", "body", "category", "read", "created_at")
