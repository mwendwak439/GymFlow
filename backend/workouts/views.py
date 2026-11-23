
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminUser,IsAdminOrMember
from .models import Workout, Exercise, WorkoutAssignment
from .serializers import (
    WorkoutSerializer,
    ExerciseSerializer,
    WorkoutAssignmentSerializer
)


class WorkoutListCreateView(generics.ListCreateAPIView):
    queryset = Workout.objects.all().order_by("-created_at")
    serializer_class = WorkoutSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAdminUser()]


class WorkoutDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [IsAdminUser]

class ExerciseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExerciseSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        queryset = Exercise.objects.select_related("workout").all()

        workout_id = self.request.query_params.get("workout")

        if workout_id:
            queryset = queryset.filter(workout_id=workout_id)

        return queryset


class ExerciseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Exercise.objects.select_related("workout").all()
    serializer_class = ExerciseSerializer
    permission_classes = [IsAdminUser]


class WorkoutAssignmentListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkoutAssignmentSerializer
    permission_classes = [IsAdminOrMember]

    def get_queryset(self):
        queryset = WorkoutAssignment.objects.select_related(
            "workout", "member", "assigned_by"
        ).all().order_by("-assigned_at")

        # Members can only see their own assignments
        if self.request.user.role == "MEMBER":
            return queryset.filter(member=self.request.user)

        # Admins can filter assignments by member
        member_id = self.request.query_params.get("member")

        if member_id:
            queryset = queryset.filter(member_id=member_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(assigned_by=self.request.user)


class WorkoutAssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkoutAssignmentSerializer
    permission_classes = [IsAdminOrMember]

    def get_queryset(self):
        queryset = WorkoutAssignment.objects.select_related(
            "workout", "member", "assigned_by"
        ).all()

        if self.request.user.role == "MEMBER":
            return queryset.filter(member=self.request.user)

        return queryset