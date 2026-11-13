from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from accounts.permissions import IsAdminUser
from .models import Workout
from .serializers import WorkoutSerializer


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
