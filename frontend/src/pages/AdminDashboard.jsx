
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";
import RevenueChart from "../components/RevenueChart";
import MemberGrowthChart from "../components/MemberGrowthChart";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/admin/stats/");

console.log("Dashboard API data:", response.data);

setStats(response.data);
      } catch (err) {
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return `KES ${Number(amount ?? 0).toLocaleString("en-KE")}`;
  };

  return (
    <div className="placeholder">
      <h1>Admin Dashboard</h1>

      <p>Welcome, {user?.first_name || user?.username}.</p>

      <h2>Gym Overview</h2>

      {loading ? (
        <p>Loading dashboard statistics...</p>
      ) : error ? (
        <p>{error}</p>
      ) : stats ? (
        <>
          <div className="dashboard-stats">

            <div className="stat-card">
              <h3>Total Members</h3>
              <p>{stats.total_members}</p>
            </div>

            <div className="stat-card">
              <h3>Active Subscriptions</h3>
              <p>{stats.active_subscriptions}</p>
            </div>

            <div className="stat-card">
              <h3>Expired Subscriptions</h3>
              <p>{stats.expired_subscriptions}</p>
            </div>

            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p>{formatCurrency(stats.total_revenue)}</p>
            </div>
            <div className="stat-card">
  <h3>Today's Revenue</h3>
  <p>{formatCurrency(stats.today_revenue)}</p>
</div>

<div className="stat-card">
  <h3>This Month's Revenue</h3>
  <p>{formatCurrency(stats.month_revenue)}</p>
</div>

<div className="stat-card">
  <h3>Successful Payments</h3>
  <p>{stats.successful_payments}</p>
</div>

<div className="stat-card">
  <h3>Failed Payments</h3>
  <p>{stats.failed_payments}</p>
</div>

          </div>
          {stats && (
  <RevenueChart data={stats.monthly_revenue || []} />
)}

{stats && (
  <MemberGrowthChart
    data={stats.monthly_member_growth || []}
  />
)}
          <h2>Recent Payments</h2>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>M-Pesa Receipt</th>
                </tr>
              </thead>

              <tbody>
                {stats.recent_payments.length > 0 ? (
                  stats.recent_payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.member}</td>
                      <td>{payment.plan}</td>
                      <td>{formatCurrency(payment.amount)}</td>
                     <td>
  <span className={`status-badge ${
    payment.status === "SUCCESS"
      ? "status-active"
      : payment.status === "PENDING"
      ? "status-pending"
      : payment.status === "FAILED"
      ? "status-expired"
      : "status-default"
  }`}>
    {payment.status}
  </span>
</td>
                      <td>{payment.receipt || "Not available"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No payments recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2>Recent Member Registrations</h2>

          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Date Registered</th>
                </tr>
              </thead>

              <tbody>
                {stats.recent_members.length > 0 ? (
                  stats.recent_members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.username}</td>
                      <td>{member.email}</td>
                      <td>
                        {new Date(member.date_joined).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No members registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}

      <h2>Management</h2>

      <div className="dashboard-actions">
        <Link to="/admin/members" className="btn btn-primary">
          Manage Members
        </Link>

        <Link to="/admin/membership-plans" className="btn btn-primary">
          Manage Membership Plans
        </Link>

        <Link to="/admin/subscriptions" className="btn btn-primary">
          Manage Subscriptions
        </Link>

        <Link to="/workouts" className="btn btn-primary">
          Manage Workouts
        </Link>

        <Link to="/admin/attendance" className="btn btn-primary">
          Manage Attendance
        </Link>

        <button className="btn btn-primary" onClick={logout}>
          Log out
        </button>
      </div>
    </div>
  );
}
