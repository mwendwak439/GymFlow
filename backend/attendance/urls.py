from django.urls import path
from .views import CheckInView, AttendanceListView

urlpatterns = [
    path('check-in/', CheckInView.as_view(), name='check-in'),
    path('', AttendanceListView.as_view(), name='attendance-list'),
]