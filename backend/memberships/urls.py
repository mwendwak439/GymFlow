from django.urls import path
from .views import (
    MembershipPlanListCreateView,
    MembershipPlanDetailView,
)

urlpatterns = [
    path("plans/", MembershipPlanListCreateView.as_view(), name="membership-plans"),
    path("plans/<int:pk>/", MembershipPlanDetailView.as_view(), name="membership-plan-detail"),
]