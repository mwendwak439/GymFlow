
import { useEffect, useState } from "react";
import api from "../services/api";


export default function MemberSubscriptionHistory() {
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
        setError("Failed to load subscription history.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const getStatusClass = (status) => {
  switch (status) {
    case "ACTIVE":
    case "SUCCESS":
      return "status-active";

    case "PENDING":
      return "status-pending";

    case "EXPIRED":
    case "FAILED":
      return "status-expired";

    default:
      return "status-default";
  }
};

  return (
    <div className="placeholder">
      <h1>My Subscription History</h1>
      <p>View all your current and previous gym memberships.</p>

      {loading ? (
        <p>Loading subscription history...</p>
      ) : error ? (
        <p>{error}</p>
      ) : subscriptions.length === 0 ? (
        <p>You have no subscription history yet.</p>
      ) : (
        <div className="subscription-history">
          <table>
            <thead>
              <tr>
                <th>Plan</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
                <th>Subscription</th>
                <th>Payment</th>
                <th>M-Pesa Receipt</th>
              </tr>
            </thead>

            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td>{subscription.plan_name}</td>
                  <td>KES {subscription.plan_price}</td>
                  <td>{subscription.start_date}</td>
                  <td>{subscription.end_date}</td>
                <td>
  <span className={`status-badge ${getStatusClass(subscription.status)}`}>
    {subscription.status}
  </span>
</td>
                 <td>
  <span
    className={`status-badge ${getStatusClass(
      subscription.latest_payment_status
    )}`}
  >
    {subscription.latest_payment_status || "Not paid"}
  </span>
</td> 
                  <td>
                    {subscription.mpesa_receipt_number || "Not available"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
