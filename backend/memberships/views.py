
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminUser
from .models import MembershipPlan, Subscription
from .serializers import MembershipPlanSerializer, SubscriptionSerializer, MemberSubscriptionSerializer
from django.utils import timezone
from rest_framework.exceptions import ValidationError

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


class MemberSubscriptionCreateView(generics.ListCreateAPIView):
    serializer_class = MemberSubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        Subscription.objects.filter(
            member=self.request.user,
            status="ACTIVE",
            end_date__lte=timezone.localdate()
        ).update(status="EXPIRED")

        return Subscription.objects.filter(
            member=self.request.user
        ).select_related(
            "plan", "member"
        ).order_by("-created_at")

    def perform_create(self, serializer):
        plan = serializer.validated_data["plan"]

        if not plan.is_active:
            raise ValidationError(
                "This membership plan is not available."
            )

        serializer.save(
            member=self.request.user,
            status="PENDING"
        )


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
