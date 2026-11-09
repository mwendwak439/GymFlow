from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminUser
from .models import MembershipPlan
from .serializers import MembershipPlanSerializer


class MembershipPlanListCreateView(generics.ListCreateAPIView):
    queryset = MembershipPlan.objects.all().order_by("-created_at")
    serializer_class = MembershipPlanSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAdminUser()]


class MembershipPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [IsAdminUser]