from django.shortcuts import render
from rest_framework import generics, permissions
from .models import Attendance
from .serializers import AttendanceSerializer


class CheckInView(generics.CreateAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(members=self.request.user)


class AttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'ADMIN':
            return Attendance.objects.all()

        return Attendance.objects.filter(members=user)
