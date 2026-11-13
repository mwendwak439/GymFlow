
from rest_framework import serializers
from .models import Workout


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = "__all__"
        read_only_fields = ["id", "created_at"]
