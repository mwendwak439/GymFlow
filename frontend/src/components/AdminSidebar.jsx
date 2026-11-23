
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "▦" },
    { name: "Members", path: "/admin/members", icon: "♙" },
    { name: "Membership Plans", path: "/admin/membership-plans", icon: "▤" },
    { name: "Subscriptions", path: "/admin/subscriptions", icon: "▣" },
    { name: "Trainers", path: "/admin/trainers", icon: "♟" },
    { name: "Payments", path: "/admin/payments", icon: "↗" },
    { name: "Attendance", path: "/admin/attendance", icon: "◷" },
    { name: "Workouts", path: "/admin/workouts", icon: "◎" },
  ];

  return (
    
    <aside className={`admin-sidebar ${isOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-brand">
        <h2>GYM<span>FLOW</span></h2>
        <p>ADMIN PANEL</p>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">
          {(user?.username || "A").charAt(0).toUpperCase()}
        </div>

        <div>
          <h4>{user?.username || "Administrator"}</h4>
          <p>Administrator</p>
        </div>
      </div>

      <nav className="sidebar-navigation">
        <p className="sidebar-heading">MANAGEMENT</p>

        {menuItems.map((item) => (
          <NavLink
             onClick={onClose}
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
         
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">↪</span>
          Logout
        </button>

        <p className="sidebar-version">GYMFLOW MANAGEMENT SYSTEM</p>
      </div>
    </aside>
  );
}
