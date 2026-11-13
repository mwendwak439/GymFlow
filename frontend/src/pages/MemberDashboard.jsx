import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MemberDashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div className="placeholder">
      <h1>Member Dashboard</h1>
      <p>Welcome, {user.first_name || user.username}.</p>

      <div className="dashboard-actions">
      <Link to="/workouts" className="btn btn-primary">
      View workouts
      </Link>
      
      <button className="btn btn-primary" onClick={logout}>Log out</button>
    </div>
    </div>
  );
}