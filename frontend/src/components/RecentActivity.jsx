
export default function RecentActivity({ activities = [] }) {
  const getActivityIcon = (type) => {
    if (type === "MEMBER_REGISTERED") return "♙";
    if (type === "SUBSCRIPTION_CREATED") return "▤";
    if (type === "PAYMENT_SUCCESS") return "✓";
    if (type === "PAYMENT_FAILED") return "✕";
    return "•";
  };

  const getActivityClass = (type) => {
    if (type === "PAYMENT_FAILED") return "activity-failed";
    if (type === "PAYMENT_SUCCESS") return "activity-success";
    if (type === "MEMBER_REGISTERED") return "activity-member";
    return "activity-default";
  };

  return (
    <div className="recent-activity">
      <div className="activity-heading">
        <div>
          <span className="activity-eyebrow">GYMFLOW UPDATES</span>
          <h2>Recent Activity</h2>
          <p>Latest events happening at your gym</p>
        </div>
        <span className="activity-count">
          {activities.length} Activities
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="no-activity">
          <p>No recent activity available.</p>
        </div>
      ) : (
        <div className="activity-list">
          {activities.map((activity) => (
            <div className="activity-item" key={activity.id}>
              <span className={`activity-icon ${getActivityClass(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </span>

              <div className="activity-details">
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <small>
                  {new Date(activity.date).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
