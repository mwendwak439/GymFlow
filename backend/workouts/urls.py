

from django.urls import path

from .views import (
    WorkoutListCreateView,
    WorkoutDetailView,
    ExerciseListCreateView,
    ExerciseDetailView,
    WorkoutAssignmentListCreateView,
    WorkoutAssignmentDetailView,
)

urlpatterns = [
    # Workouts
    path("workouts/", WorkoutListCreateView.as_view(), name="workouts"),
    path("workouts/<int:pk>/", WorkoutDetailView.as_view(), name="workout-detail"),

    # Exercises
    path("exercises/", ExerciseListCreateView.as_view(), name="exercises"),
    path("exercises/<int:pk>/", ExerciseDetailView.as_view(), name="exercise-detail"),

    # Workout Assignments
    path("workout-assignments/", WorkoutAssignmentListCreateView.as_view(), name="workout-assignments"),
    path("workout-assignments/<int:pk>/", WorkoutAssignmentDetailView.as_view(), name="workout-assignment-detail"),
]
