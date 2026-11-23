
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
  profile:{
    gender:"",
    date_of_birth:"",
    address:""
  }
}); 
const [editingMember, setEditingMember] = useState(null);
const [selectedMember, setSelectedMember] = useState(null);
const [profileLoading, setProfileLoading] = useState(false);
const [memberSubscriptions, setMemberSubscriptions] = useState([]);
const handleEditClick = (member) => {
  setEditingMember(member);

  setFormData({
    first_name: member.first_name || "",
    last_name: member.last_name || "",
    username: member.username || "",
    email: member.email || "",
    phone: member.phone || "",
     profile: {
    gender: member.profile?.gender || "",
    date_of_birth: member.profile?.date_of_birth || "",
    address: member.profile?.address || "",
  },
  });

  setShowForm(true);
};

const fetchMembers = async () => {
  try {
    const response = await api.get("/members/");
    setMembers(response.data.results || []);
  } catch (err) {
    setError("Failed to load members.");
  }
};

const handleViewProfile = async (member) => {
  setProfileLoading(true);
  setSelectedMember(null);

  try {
    const response = await api.get(`/members/${member.id}/`);
    setSelectedMember(response.data);

    const subscriptions = await api.get(
      `/subscriptions/?member=${member.id}`
    );

    setMemberSubscriptions(subscriptions.data.results);

  } catch (err) {
    setError("Failed to load member profile.");
    console.error("Profile error:", err);
  } finally {
    setProfileLoading(false);
  }
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

  // Validate required fields
if (
  !formData.first_name.trim() ||
  !formData.last_name.trim() ||
  !formData.username.trim() ||
  !formData.email.trim() ||
  !formData.phone.trim()
) {
  setError("Please fill in all required fields.");
  return;
}

// Validate email format
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(formData.email)) {
  setError("Please enter a valid email address.");
  return;
}

// Validate phone number
if (!/^\+?\d{10,15}$/.test(formData.phone.trim())) {
  setError("Please enter a valid phone number (10–15 digits).");
  return;
}

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
        profile: {
    gender: "",
    date_of_birth: "",
    address: "",
  },
    });

    setEditingMember(null);
    setShowForm(false);
    setError("");
 } catch (err) {
  const responseData = err.response?.data;

  if (responseData) {
    const firstError = Object.values(responseData)
      .flat(Infinity)
      .find((message) => typeof message === "string");

    setError(firstError || "Failed to save member. Please check your details.");
  } else {
    setError("Unable to connect to the server. Please try again.");
  }
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
        {profileLoading && (
  <div className="loading">Loading member profile...</div>
)}

{selectedMember && (
  <div className="member-profile">
    <div className="profile-header">
      <h2>Member Profile</h2>

      <button
        className="btn btn-cancel"
        onClick={() => setSelectedMember(null)}
      >
        Close Profile
      </button>
    </div>

    <div className="profile-details">
      <h3>
        {selectedMember.first_name} {selectedMember.last_name}
      </h3>

      <p><strong>Username:</strong> {selectedMember.username}</p>
      <p><strong>Email:</strong> {selectedMember.email}</p>
      <p><strong>Phone:</strong> {selectedMember.phone || "Not provided"}</p>
      <p><strong>Gender:</strong> {selectedMember.profile?.gender || "Not provided"}</p>
      <p><strong>Date of Birth:</strong> {selectedMember.profile?.date_of_birth || "Not provided"}</p>
      <p><strong>Address:</strong> {selectedMember.profile?.address || "Not provided"}</p>
      <p><strong>Account Status:</strong> {selectedMember.is_active ? "Active" : "Inactive"}</p>
      <p><strong>Profile Status:</strong> {selectedMember.profile?.status || "Not provided"}</p>
      <p><strong>Date Registered:</strong> {selectedMember.date_joined ? new Date(selectedMember.date_joined).toLocaleDateString() : "Not available"}</p>
    </div>

<div className="membership-history">
  <h3>Membership History</h3>

  {memberSubscriptions.length === 0 ? (
    <p>No membership history found.</p>
  ) : (
    <div className="history-list">
      {memberSubscriptions.map((subscription) => (
        <div className="history-card" key={subscription.id}>
          <h4>{subscription.plan_name}</h4>

          <p>
            <strong>Price:</strong> KES{" "}
            {Number(subscription.plan_price).toLocaleString()}
          </p>

          <p>
            <strong>Start Date:</strong> {subscription.start_date}
          </p>

          <p>
            <strong>End Date:</strong> {subscription.end_date}
          </p>

         <p>
  <strong>Status:</strong>{" "}
  <span className={`subscription-status ${subscription.status.toLowerCase()}`}>
    {subscription.status}
  </span>
</p>

          <p>
            <strong>Payment:</strong>{" "}
            {subscription.latest_payment_status || "No payment recorded"}
          </p>

          <p>
            <strong>M-Pesa Receipt:</strong>{" "}
            {subscription.mpesa_receipt_number || "Not available"}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

  </div>
)}
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

      <div className="form-group">
  <label>Gender</label>
  <select
    value={formData.profile.gender}
    onChange={(e) =>
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          gender: e.target.value,
        },
      })
    }
  >
    <option value="">Select gender</option>
    <option value="M">Male</option>
    <option value="F">Female</option>
    <option value="O">Other</option>
  </select>
</div>

<div className="form-group">
  <label>Date of Birth</label>
  <input
  type="date"
  value={
    formData.profile.date_of_birth
      ? formData.profile.date_of_birth.slice(0, 10)
      : ""
  }
  onChange={(e) =>
    setFormData({
      ...formData,
      profile: {
        ...formData.profile,
        date_of_birth: e.target.value,
      },
    })
  }
/>
</div>

<div className="form-group">
  <label>Address</label>
  <textarea
    placeholder="Enter member's address"
    value={formData.profile.address}
    onChange={(e) =>
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          address: e.target.value,
        },
      })
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
<button
  type="button"
  className="btn btn-primary"
  onClick={() => handleViewProfile(member)}
>
  View Profile
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

