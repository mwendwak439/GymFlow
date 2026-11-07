from django.shortcuts import render
from django.contrib.auth import login, logout
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status, generics, filters
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer
from .serializers import AdminMemberSerializer
from .permissions import IsAdminUser
from .models import User
from .pagination import MemberPagination

@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    """React calls this once on startup so the browser receives the csrftoken cookie."""
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"csrfToken": get_token(request)})


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)  # log them in straight after registering
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)  # creates the session
        return Response(UserSerializer(user).data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)  # destroys the session
        return Response({"detail": "Logged out."})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
    
class MemberListCreateView(generics.ListCreateAPIView):
    """
    Admin can view all members and register new members.
    """

    serializer_class = AdminMemberSerializer
    permission_classes = [IsAdminUser]
    pagination_class = MemberPagination
    queryset = User.objects.filter(role=User.Role.MEMBER)

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["is_active"]
    search_fields = [
        "username",
        "first_name",
        "last_name",
        "email",
        "phone",
    ]

    ordering_fields = ["date_joined", "first_name", "last_name"]
    ordering = ["-date_joined"]


class MemberDetailView(generics.RetrieveUpdateAPIView):
    """
    Admin can view, update and delete a specific member.
    """

    serializer_class = AdminMemberSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return User.objects.filter(role=User.Role.MEMBER)