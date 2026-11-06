import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    // Logged in but wrong role: send them to their own dashboard
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/member"} replace />;
  }
  return children;
}