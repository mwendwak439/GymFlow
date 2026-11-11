
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Subscriptions.css"

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    member: "",
    plan: "",
    start_date: new Date().toLocaleDateString("en-CA"),
  });

  const fetchData = async () => {
    try {
      const [subscriptionRes, memberRes, planRes] =
        await Promise.all([
          api.get("/subscriptions/"),
          api.get("/members/"),
          api.get("/plans/"),
        ]);

      setSubscriptions(subscriptionRes.data.results || []);
      setMembers(memberRes.data.results || []);
      setPlans(planRes.data.results || []);
    } catch (err) {
      setError("Failed to load subscription information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/subscriptions/", formData);

      setFormData({
        member: "",
        plan: "",
        start_date: new Date().toLocaleDateString("en-CA"),
      });

      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Failed to create subscription. Check your selections."
      );
    }
  };

  const handleCancel = async (subscription) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) {
      return;
    }

    try {
      await api.patch(`/subscriptions/${subscription.id}/`, {
        status: "CANCELLED",
      });

      fetchData();
    } catch (err) {
      setError("Failed to cancel subscription.");
    }
  };

  const handleRenew = async (subscription) => {
    try {
      await api.patch(`/subscriptions/${subscription.id}/`, {
        start_date: new Date().toLocaleDateString("en-CA"),
        status: "ACTIVE",
      });

      fetchData();
    } catch (err) {
      setError("Failed to renew subscription.");
    }
  };

  if (loading) return <p>Loading subscriptions...</p>;

  return (
  <div className="subscriptions-page"> 
      <h1>Member Subscriptions</h1>
<p className="subtitle">
  Manage member plans, renewals and subscription status.
</p>
      <button onClick={() => setShowForm(!showForm)}>
        Assign Subscription
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>Assign Membership Plan</h2>

          <label>Member</label>
          <select
            name="member"
            value={formData.member}
            onChange={handleChange}
            required
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.first_name} {member.last_name} ({member.username})
              </option>
            ))}
          </select>

          <label>Membership Plan</label>
          <select
            name="plan"
            value={formData.plan}
            onChange={handleChange}
            required
          >
            <option value="">Select Plan</option>
            {plans
              .filter((plan) => plan.is_active)
              .map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - KES {plan.price}
                </option>
              ))}
          </select>

          <label>Start Date</label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />

          <button type="submit">Save Subscription</button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

      <table border="1" cellPadding="10" style={{ marginTop: "25px" }}>
        <thead>
          <tr>
            <th>Member</th>
            <th>Plan</th>
            <th>Start Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {subscriptions.map((subscription) => (
            <tr key={subscription.id}>
              <td>{subscription.member_name}</td>
              <td>{subscription.plan_name}</td>
              <td>{subscription.start_date}</td>
              <td>{subscription.end_date}</td>
               <td>
  <span className={`status-${subscription.status.toLowerCase()}`}>
    {subscription.status}
  </span>
</td> 
              <td>
                {subscription.status !== "CANCELLED" && (
                 <button
  className="cancel-btn"
  onClick={() => handleCancel(subscription)}
>
  Cancel
</button> 
                )}

                {(subscription.status === "EXPIRED" ||
                  subscription.status === "CANCELLED") && (
                  <button 
                   className="renew-btn"
                  onClick={() => handleRenew(subscription)}>
                    Renew
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
