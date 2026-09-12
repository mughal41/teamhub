from rest_framework import serializers

from .models import CalendarEvent


class CalendarEventSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="event_type")
    withWhom = serializers.CharField(source="with_whom", required=False, allow_blank=True)

    class Meta:
        model = CalendarEvent
        fields = (
            "id",
            "title",
            "type",
            "day",
            "month",
            "year",
            "time",
            "location",
            "withWhom",
            "visibility",
        )
        read_only_fields = ("id",)

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
