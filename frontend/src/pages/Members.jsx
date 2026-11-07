
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Members.css"

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get("/members/");
        setMembers(response.data.results || []);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          "Failed to load members. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const fullName =
      `${member.first_name || ""} ${member.last_name || ""}`.trim();

    const displayName = fullName || member.username;

    const matchesSearch = [
      displayName,
      member.username,
      member.email,
      member.phone,
    ]
      .filter(Boolean)
      .some((value) =>
        value.toLowerCase().includes(search.toLowerCase())
      );

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && member.is_active) ||
      (statusFilter === "inactive" && !member.is_active);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="members-page">
      <div className="members-header">
        <div>
          <h1>Gym Members</h1>
          <p>Manage and monitor your gym members.</p>
        </div>
      </div>

      <div className="members-summary">
        <div className="summary-card">
          <h3>Total Members</h3>
          <h2>{members.length}</h2>
          <p>Registered gym members</p>
        </div>
      </div>

      <div className="members-content">
        <div className="members-toolbar">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Members</option>
            <option value="active">Active Members</option>
            <option value="inactive">Inactive Members</option>
          </select>
        </div>

        <div className="members-table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const fullName =
                    `${member.first_name || ""} ${member.last_name || ""}`.trim();

                  return (
                    <tr key={member.id}>
                      <td>
                        <strong>{fullName || member.username}</strong>
                      </td>
                      <td>{member.email}</td>
                      <td>{member.phone || "Not provided"}</td>
                      <td>
                        <span
                          className={
                            member.is_active
                              ? "status-badge active"
                              : "status-badge inactive"
                          }
                        >
                          {member.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <p className="members-count">
          Showing {filteredMembers.length} of {members.length} members
        </p>
      </div>
    </div>
  );
}
