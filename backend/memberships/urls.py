from django.urls import path
from .views import (
    MembershipPlanListCreateView,
    MembershipPlanDetailView,
     SubscriptionListCreateView,
     SubscriptionDetailView,
    MemberSubscriptionCreateView,
)  


urlpatterns = [
    path("plans/", MembershipPlanListCreateView.as_view(), name="membership-plans"),
    path("plans/<int:pk>/", MembershipPlanDetailView.as_view(), name="membership-plan-detail"),
    
    path("subscriptions/", SubscriptionListCreateView.as_view(), name="subscriptions"),
    path("subscriptions/<int:pk>/", SubscriptionDetailView.as_view(), name="subscription-detail"),
    path(
    "my-subscriptions/",
    MemberSubscriptionCreateView.as_view(),
    name="member-subscription-create"
),

]





