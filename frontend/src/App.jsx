
import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import MemberDashboard from "./pages/MemberDashboard";
import Register from "./pages/Register";
import Members from "./pages/Members";
import MembershipPlans from "./pages/MembershipPlans";
import Subscriptions from "./pages/Subscriptions";
import Workouts from "./pages/workouts";
import Attendance from "./pages/Attendance";
import MemberPlans from "./pages/MemberPlans";
import MemberSubscriptionHistory from "./pages/MemberSubscriptionHistory";
import Trainers from "./pages/Trainers";
import PaymentHistory from "./pages/PaymentHistory";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes with shared sidebar */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="members" element={<Members />} />
        <Route path="membership-plans" element={<MembershipPlans />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="trainers" element={<Trainers />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="workouts" element={<Workouts />} />
      </Route>

      {/* Member routes */}
      <Route
        path="/member"
        element={
          <ProtectedRoute role="MEMBER">
            <MemberDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/plans"
        element={
          <ProtectedRoute role="MEMBER">
            <MemberPlans />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member/subscription-history"
        element={
          <ProtectedRoute role="MEMBER">
            <MemberSubscriptionHistory />
          </ProtectedRoute>
        }
      />

      {/* Shared workout route */}
      <Route
        path="/workouts"
        element={
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        }
      />

      {/* Member attendance */}
      <Route
        path="/attendance"
        element={
          <ProtectedRoute role="MEMBER">
            <Attendance />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
