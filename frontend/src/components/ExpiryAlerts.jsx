export default function ExpiryAlerts({ subscriptions = [] }) {
  return (
    <div className="expiry-alerts">
      <h2>Membership Expiry Alerts</h2>
      <p>Subscriptions expiring within the next 7 days</p>

      {subscriptions.length === 0 ? (
        <div className="no-expiry-alerts">
          <p>No memberships are expiring soon.</p>
        </div>
      ) : (
        <div className="expiry-list">
          {subscriptions.map((subscription) => (
            <div className="expiry-item" key={subscription.id}>
              <div>
                <h3>{subscription.member}</h3>
                <p>{subscription.plan} Plan</p>
                <small>Expires: {subscription.end_date}</small>
              </div>

              <span className="expiry-days">
                {subscription.days_remaining === 0
                  ? "Expires today"
                  : `${subscription.days_remaining} days left`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}