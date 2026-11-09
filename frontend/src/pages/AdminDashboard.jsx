import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="placeholder">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.first_name || user.username}.</p>

      <div className="dashboard-actions">
          <Link to="/admin/members" className="btn btn-primary">
          Manage Members
          </Link>

    <Link to="/admin/membership-plans" className="btn btn-primary">
      Manage Membership Plans
    </Link>
      <button className="btn btn-primary" onClick={logout}>
        Log out
        </button>


      </div>
    </div>
  );
}