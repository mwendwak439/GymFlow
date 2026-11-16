
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function MemberDashboard() {
  const { user, logout } = useAuth();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get("/my-subscriptions/");
        const data = response.data.results || response.data;
        setSubscriptions(data);
      } catch (err) {
        setError("Unable to load your subscription information.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const currentSubscription = subscriptions.find(
    (subscription) =>
      subscription.status === "ACTIVE" ||
      subscription.status === "PENDING"
  );

  return (
    <div className="placeholder">
      <h1>Member Dashboard</h1>

      <p>Welcome, {user.first_name || user.username}.</p>

      <div className="dashboard-actions">
        <Link to="/workouts" className="btn btn-primary">
          View Workouts
        </Link>

        <Link to="/attendance" className="btn btn-primary">
          My Attendance
        </Link>

        <Link to="/member/plans" className="btn btn-primary">
          View Membership Plans
        </Link>
        <Link
          to="/member/subscription-history"
          className="btn btn-primary"
        >
          My Subscription History
        </Link>
        <button className="btn btn-primary" onClick={logout}>
          Log out
        </button>
      </div>

      <section className="subscription-summary">
        <h2>My Membership</h2>

        {loading ? (
          <p>Loading subscription information...</p>
        ) : error ? (
          <p>{error}</p>
        ) : currentSubscription ? (
          <div className="plan-card">
            <h3>{currentSubscription.plan_name}</h3>

            <p>
              Amount: KES {currentSubscription.plan_price}
            </p>

            <p>
              Subscription Status: {currentSubscription.status}
            </p>

            <p>
              Payment Status:{" "}
              {currentSubscription.latest_payment_status || "Not paid"}
            </p>

            <p>
              Start Date: {currentSubscription.start_date}
            </p>

            <p>
              Expiry Date: {currentSubscription.end_date}
            </p>

            <p>
              M-Pesa Receipt:{" "}
              {currentSubscription.mpesa_receipt_number || "Not available"}
            </p>
          </div>
        ) : (
          <p>You don't have an active or pending membership.</p>
        )}

        <Link to="/member/plans" className="btn btn-primary">
          Manage Membership
        </Link>
      </section>
    </div>
  );
}
