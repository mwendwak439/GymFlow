import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="placeholder">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.first_name || user.username}.</p>
      <button className="btn btn-primary" onClick={logout}>Log out</button>
    </div>
  );
}