from django.urls import path
from .views import (
    CsrfView,
    LoginView,
    LogoutView,
    MeView,
    RegisterView,
    MemberListCreateView,
    MemberDetailView,
)
urlpatterns = [
    path("csrf/", CsrfView.as_view()),
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("me/", MeView.as_view()),
    path("members/", MemberListCreateView.as_view(), name="member-list-create"),
    path("members/<int:pk>/", MemberDetailView.as_view(), name="member-detail")
]