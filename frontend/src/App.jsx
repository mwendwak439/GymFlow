
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import MemberDashboard from "./pages/MemberDashboard";
import Register from "./pages/Register";
import Members from "./pages/Members";
import MembershipPlans from "./pages/MembershipPlans";

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
    </Routes>
  );
}
