from rest_framework import serializers

from .models import Candidate, JobPosting


STAGE_TO_INDEX = {
    "Applied": 1,
    "Screening": 2,
    "Interview": 3,
    "Offer": 4,
    "Hired": 5,
    "Rejected": 5,
}


class JobPostingSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    model = serializers.SerializerMethodField()
    applicants = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()

    class Meta:
        model = JobPosting
        fields = (
            "id",
            "title",
            "department",
            "location",
            "status",
            "openings",
            "description",
            "created_at",
            "type",
            "model",
            "applicants",
            "color",
        )

    def get_type(self, obj):
        return obj.department or "Full-Time"

    def get_model(self, obj):
        return obj.location or "Hybrid"

    def get_applicants(self, obj):
        count = obj.candidates.count()
        return f"{count} Applicant{'s' if count != 1 else ''}"

    def get_color(self, obj):
        palette = ["text-teal-700", "text-indigo-700", "text-amber-700", "text-rose-700"]
        return palette[obj.pk % len(palette)]


class CandidateSerializer(serializers.ModelSerializer):
    jobTitle = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = Candidate
        fields = (
            "id",
            "job",
            "jobTitle",
            "name",
            "email",
            "stage",
            "avatar",
            "notes",
            "created_at",
        )
        read_only_fields = ("id", "created_at")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        stage_name = data.get("stage") or "Applied"
        data["job"] = data.get("jobTitle") or ""
        data["stage"] = STAGE_TO_INDEX.get(stage_name, 1)
        data["stageLabel"] = stage_name
        return data
