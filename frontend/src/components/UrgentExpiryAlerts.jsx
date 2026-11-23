
export default function UrgentExpiryAlerts({ subscriptions = [] }) {
  return (
    <div className="urgent-expiry-alerts">
      <div className="urgent-alert-heading">
        <div>
          <span className="urgent-eyebrow">ACTION REQUIRED</span>
          <h2>Urgent Membership Expiry</h2>
          <p>Memberships expiring within the next 3 days</p>
        </div>

        <span className="urgent-count">
          {subscriptions.length} Urgent
        </span>
      </div>

      {subscriptions.length === 0 ? (
        <div className="no-urgent-alerts">
          <p>No memberships expiring within the next 3 days.</p>
        </div>
      ) : (
        <div className="urgent-expiry-list">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="urgent-expiry-card">
              <h3>Membership Expiring Soon!</h3>

              <p>Member: {subscription.member}</p>
              <p>Plan: {subscription.plan}</p>
              <p>Expiry Date: {subscription.end_date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
