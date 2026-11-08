
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Members.css"

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone: "",
}); 
const [editingMember, setEditingMember] = useState(null);
const handleEditClick = (member) => {
  setEditingMember(member);

  setFormData({
    first_name: member.first_name || "",
    last_name: member.last_name || "",
    username: member.username || "",
    email: member.email || "",
    phone: member.phone || "",
  });

  setShowForm(true);
};


const handleToggleStatus = async (member) => {
  try {
    const response = await api.patch(`/members/${member.id}/`, {
      is_active: !member.is_active,
    });

    setMembers((prev) =>
      prev.map((m) =>
        m.id === member.id ? response.data : m
      )
    );
  } catch (err) {
    setError("Failed to update member status.");
  }
};
const handleAddMember = async (e) => {
  e.preventDefault();

  try {
    let response;

    if (editingMember) {
      response = await api.patch(
        `/members/${editingMember.id}/`,
        formData
      );

      setMembers((prev) =>
        prev.map((member) =>
          member.id === editingMember.id ? response.data : member
        )
      );
    } else {
      response = await api.post("/members/", formData);

      setMembers((prev) => [response.data, ...prev]);
    }

    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
    });

    setEditingMember(null);
    setShowForm(false);
    setError("");
  } catch (err) {
    setError("Failed to save member. Please check the details and try again.");
  }
};
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

  if (error && loading) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="members-page">
      <div className="members-header">
        <div>
          <h1>Gym Members</h1>
          <p>Manage and monitor your gym members.</p>

          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add Member
          </button>
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
        {showForm && (
  <div className="member-form-container">
   <h2>{editingMember ? "Edit Member" : "Add New Member"}</h2>

    <form className="member-form" onSubmit={handleAddMember}>
      <div className="form-group">
        <label>First Name</label>
      <input
  type="text"
  placeholder="Enter first name"
  value={formData.first_name}
  onChange={(e) =>
    setFormData({ ...formData, first_name: e.target.value })
  }
  required
/>
      </div>

      <div className="form-group">
        <label>Last Name</label>
        <input
  type="text"
  placeholder="Enter last name"
  value={formData.last_name}
  onChange={(e) =>
    setFormData({ ...formData, last_name: e.target.value })
  }
  required
/>
      </div>

      <div className="form-group">
        <label>Username</label>
       <input
  type="text"
  placeholder="Enter username"
  value={formData.username}
  onChange={(e) =>
    setFormData({ ...formData, username: e.target.value })
  }
  required
/>
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
  type="email"
  placeholder="Enter email address"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
  required
/>
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
  type="text"
  placeholder="Enter phone number"
  value={formData.phone}
  onChange={(e) =>
    setFormData({ ...formData, phone: e.target.value })
  }
/>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
        {editingMember ? "Update Member" : "Save Member"} 
        </button>

        <button
          type="button"
          className="btn btn-cancel"
         onClick={() => {
  setShowForm(false);
  setEditingMember(null);
  setFormData({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
  });
}}
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}
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
                <th>Actions </th>
                
              </tr>
              
            </thead>

            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
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
                      </td><td>
  <button
    type="button"
    className="btn btn-primary"
    onClick={() => handleEditClick(member)}
  >
    Edit
  </button>
  <button
  type="button"
  className="btn btn-primary"
  onClick={() => handleToggleStatus(member)}
>
  {member.is_active ? "Deactivate" : "Activate"}
</button>
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
