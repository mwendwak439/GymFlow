

from rest_framework import serializers
from .models import Workout, Exercise, WorkoutAssignment


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = "__all__"
        read_only_fields = ["id"]


class WorkoutSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = Workout
        fields = "__all__"
        read_only_fields = ["id", "created_at"]


class WorkoutAssignmentSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(
        source="member.username",
        read_only=True
    )

    workout_name = serializers.CharField(
        source="workout.name",
        read_only=True
    )

    assigned_by_name = serializers.CharField(
        source="assigned_by.username",
        read_only=True
    )

    class Meta:
        model = WorkoutAssignment
        fields = "__all__"
        read_only_fields = ["id", "assigned_at", "assigned_by"]
