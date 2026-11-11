
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminUser
from .models import MembershipPlan, Subscription
from .serializers import MembershipPlanSerializer, SubscriptionSerializer
from django.utils import timezone

class MembershipPlanListCreateView(generics.ListCreateAPIView):
    queryset = MembershipPlan.objects.all().order_by("-created_at")
    serializer_class = MembershipPlanSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAdminUser()]


class MembershipPlanDetailView(generics.RetrieveUpdateAPIView):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    permission_classes = [IsAdminUser]


class SubscriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        Subscription.objects.filter(
            end_date__lte=timezone.localdate()
        ).exclude(
            status="CANCELLED"
        ).update(status="EXPIRED")

        return Subscription.objects.select_related(
            "member", "plan"
        ).all().order_by("-created_at")


class SubscriptionDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        Subscription.objects.filter(
            end_date__lte=timezone.localdate()
        ).exclude(
            status="CANCELLED"
        ).update(status="EXPIRED")

        return Subscription.objects.select_related(
            "member", "plan"
        ).all()
