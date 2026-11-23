
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";
import RevenueChart from "../components/RevenueChart";
import MemberGrowthChart from "../components/MemberGrowthChart";
import PlanPerformanceChart from "../components/PlanPerformanceChart";
import ExpiryAlerts from "../components/ExpiryAlerts";  
import UrgentExpiryAlerts from "../components/UrgentExpiryAlerts";
import RecentActivity from "../components/RecentActivity";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  console.log("Plan performance:", stats?.plan_performance);
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
   <div className="dashboard-page">
  <div className="dashboard-heading">
    <div>
      <span className="dashboard-eyebrow">GYMFLOW OVERVIEW</span>
      <h1>Dashboard</h1>
      <p>
        Welcome back, {user?.first_name || user?.username}.
        Here's what's happening at your gym today.
      </p>
    </div>
  </div>
     <div className="dashboard-quick-actions">
  <h2>Quick Actions</h2>

  <div className="quick-actions-grid">
    <Link to="/admin/members" className="quick-action-card">
      <span>＋</span>
      <div>
        <h3>Manage Members</h3>
        <p>Register and manage gym members</p>
      </div>
    </Link>

    <Link to="/admin/membership-plans" className="quick-action-card">
      <span>▤</span>
      <div>
        <h3>Membership Plans</h3>
        <p>Create and manage gym plans</p>
      </div>
    </Link>

    <Link to="/admin/payments" className="quick-action-card">
      <span>↗</span>
      <div>
        <h3>View Payments</h3>
        <p>Track member payments</p>
      </div>
    </Link>

    <Link to="/admin/trainers" className="quick-action-card">
      <span>♟</span>
      <div>
        <h3>Manage Trainers</h3>
        <p>View and manage gym trainers</p>
      </div>
    </Link>
  </div>
</div>

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
{stats && (
  <PlanPerformanceChart
    data={stats.plan_performance || []}
  />
  
)}
<RecentActivity activities={stats.recent_activity || []} />
{stats && (
  <ExpiryAlerts
    subscriptions={stats.expiring_subscriptions || []}
  />
)}
{stats && (
  <UrgentExpiryAlerts
    subscriptions={stats.urgent_expiring_subscriptions || []}
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

    </div>
  );
}
