

import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
  setSidebarOpen(false);
}, [location.pathname]);

  const pageTitles = {
    "/admin": "Dashboard",
    "/admin/members": "Members",
    "/admin/membership-plans": "Membership Plans",
    "/admin/subscriptions": "Subscriptions",
    "/admin/trainers": "Trainers",
    "/admin/payments": "Payments",
    "/admin/attendance": "Attendance",
    "/admin/workouts": "Workouts",
  };

  const pageTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <div className="admin-layout">
      <AdminSidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>
{sidebarOpen && (
  <div
    className="sidebar-overlay"
    onClick={() => setSidebarOpen(false)}
  />
)}

      <main className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>

            <div>
              <h2>{pageTitle}</h2>
              <p>Welcome back, {user?.username || "Administrator"}</p>
            </div>
          </div>

          <div className="admin-topbar-profile">
            <span className="admin-status-dot"></span>
            <span>Administrator</span>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
