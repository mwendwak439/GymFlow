
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/members"
        element={
          <ProtectedRoute role="ADMIN">
            <Members />
          </ProtectedRoute>
        }
      />

      <Route
        path="/member"
        element={
          <ProtectedRoute role="MEMBER">
            <MemberDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    
    <Route
  path="/admin/membership-plans"
  element={
    <ProtectedRoute role="ADMIN">
      <MembershipPlans />
    </ProtectedRoute>
  }
/>
    

    <Route
  path="/admin/subscriptions"
  element={
    <ProtectedRoute role="ADMIN">
      <Subscriptions />
    </ProtectedRoute>
  }
/>
<Route
  path="/workouts"
  element={
    <ProtectedRoute>
      <Workouts />
    </ProtectedRoute>
  }
/>


<Route
  path="/attendance"
  element={
    <ProtectedRoute role="MEMBER">
      <Attendance />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/attendance"
  element={
    <ProtectedRoute role="ADMIN">
      <Attendance />
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
  element={<MemberSubscriptionHistory />}
/>

<Route
  path="/admin/trainers"
  element={
    <ProtectedRoute role="ADMIN">
      <Trainers />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/payments"
  element={
    <ProtectedRoute role="ADMIN">
      <PaymentHistory />
    </ProtectedRoute>
  }
/>
</Routes>
  );
}
