import { useEffect, useState } from "react";
import api from "../services/api";
import "./Trainers.css";

export default function Trainers() {

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
const [profileLoading, setProfileLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    trainer_profile: {
      specialization: "",
      experience_years: 0,
      bio: "",
    },
  });

useEffect(() => {
  const fetchTrainers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/trainers/");

      setTrainers(response.data.results || []);
      setError("");
    } catch (err) {
      console.error("Error fetching trainers:", err);
      setError("Failed to load trainers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchTrainers();
}, []);

const handleAddTrainer = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/trainers/", formData);

    setTrainers((prev) => [response.data, ...prev]);

    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      trainer_profile: {
        specialization: "",
        experience_years: 0,
        bio: "",
      },
    });

    setShowForm(false);
    setError("");

  } catch (err) {
    console.error("Error adding trainer:", err);

    setError(
      err.response?.data?.username?.[0] ||
      err.response?.data?.email?.[0] ||
      "Failed to register trainer. Please check the details."
    );
  }
};

const handleEditTrainer = async (e) => {
  e.preventDefault();

  try {
    const response = await api.patch(
      `/trainers/${editingTrainer.id}/`,
      formData
    );

    setTrainers((prev) =>
      prev.map((trainer) =>
        trainer.id === editingTrainer.id ? response.data : trainer
      )
    );

    setEditingTrainer(null);
    setShowForm(false);

    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      trainer_profile: {
        specialization: "",
        experience_years: 0,
        bio: "",
      },
    });

    setError("");

  } catch (err) {
    console.error("Error updating trainer:", err);

    setError(
      "Failed to update trainer. Please check the details."
    );
  }
};

const handleEditClick = (trainer) => {
  setEditingTrainer(trainer);

  setFormData({
    first_name: trainer.first_name || "",
    last_name: trainer.last_name || "",
    username: trainer.username || "",
    email: trainer.email || "",
    phone: trainer.phone || "",
    trainer_profile: {
      specialization: trainer.trainer_profile?.specialization || "",
      experience_years: trainer.trainer_profile?.experience_years || 0,
      bio: trainer.trainer_profile?.bio || "",
    },
  });

  setShowForm(true);
};

const filteredTrainers = trainers.filter((trainer) => {
  const searchTerm = search.toLowerCase();

  const fullName = `${trainer.first_name} ${trainer.last_name}`.toLowerCase();

  const matchesSearch =
    fullName.includes(searchTerm) ||
    trainer.email?.toLowerCase().includes(searchTerm) ||
    trainer.username?.toLowerCase().includes(searchTerm) ||
    trainer.trainer_profile?.specialization?.toLowerCase().includes(searchTerm);

  const matchesStatus =
    statusFilter === "all" ||
    (statusFilter === "active" && trainer.is_active) ||
    (statusFilter === "inactive" && !trainer.is_active);

  return matchesSearch && matchesStatus;
});

const handleToggleStatus = async (trainer) => {
  try {
    const response = await api.patch(
      `/trainers/${trainer.id}/`,
      {
        is_active: !trainer.is_active,
      }
    );

    setTrainers((prev) =>
      prev.map((item) =>
        item.id === trainer.id ? response.data : item
      )
    );

    setError("");

  } catch (err) {
    console.error("Error updating trainer status:", err);
    setError("Failed to update trainer status. Please try again.");
  }
};


const handleViewTrainer = async (trainer) => {
  try {
    setProfileLoading(true);
    setError("");

    const response = await api.get(`/trainers/${trainer.id}/`);

    setSelectedTrainer(response.data);

  } catch (err) {
    console.error("Error loading trainer profile:", err);
    setError("Failed to load trainer profile.");
  } finally {
    setProfileLoading(false);
  }
};
 return (
  <div className="trainers-page">

    <div className="trainers-header">
      <div>
        <h1>Trainer Management</h1>
        <p>Manage your gym trainers and their professional information.</p>
      </div>
<button onClick={() => {
  setEditingTrainer(null);

  setFormData({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone: "",
    trainer_profile: {
      specialization: "",
      experience_years: 0,
      bio: "",
    },
  });

  setShowForm(true);
}}>
  + Add Trainer
</button>
    </div>
{showForm && (
  <div className="trainer-modal-overlay">
    <div className="trainer-modal">
     <h2>{editingTrainer ? "Edit Trainer" : "Register New Trainer"}</h2> 
<form onSubmit={editingTrainer ? handleEditTrainer : handleAddTrainer}>
     

        <div className="trainer-form-grid">

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              required
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              required
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Specialization</label>
            <input
              type="text"
              placeholder="e.g. Bodybuilding"
              value={formData.trainer_profile.specialization}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trainer_profile: {
                    ...formData.trainer_profile,
                    specialization: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Years of Experience</label>
            <input
              type="number"
              min="0"
              value={formData.trainer_profile.experience_years}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trainer_profile: {
                    ...formData.trainer_profile,
                    experience_years: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Professional Bio</label>
            <textarea
              placeholder="Describe the trainer's experience and skills"
              value={formData.trainer_profile.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trainer_profile: {
                    ...formData.trainer_profile,
                    bio: e.target.value,
                  },
                })
              }
            />
          </div>

        </div>

        <div className="trainer-form-actions">
          <button type="submit">
  {editingTrainer ? "Save Changes" : "Register Trainer"}
</button>

      <button
  type="button"
  onClick={() => {
    setShowForm(false);
    setEditingTrainer(null);
  }}
>
  Cancel
</button>   
        </div>

      </form>
    </div>
  </div>
)}
    
{(profileLoading || selectedTrainer) && (
  <div className="trainer-modal-overlay">
    <div className="trainer-modal trainer-profile-modal">

      <h2>Trainer Profile</h2>

      {profileLoading ? (
        <p>Loading trainer profile...</p>
      ) : selectedTrainer && (
        <>
          <div className="trainer-profile-details">

            <div>
              <strong>Full Name</strong>
              <p>
                {selectedTrainer.first_name} {selectedTrainer.last_name}
              </p>
            </div>

            <div>
              <strong>Username</strong>
              <p>{selectedTrainer.username}</p>
            </div>

            <div>
              <strong>Email</strong>
              <p>{selectedTrainer.email}</p>
            </div>

            <div>
              <strong>Phone</strong>
              <p>{selectedTrainer.phone || "Not provided"}</p>
            </div>

            <div>
              <strong>Specialization</strong>
              <p>
                {selectedTrainer.trainer_profile?.specialization || "Not specified"}
              </p>
            </div>

            <div>
              <strong>Experience</strong>
              <p>
                {selectedTrainer.trainer_profile?.experience_years || 0} years
              </p>
            </div>

            <div>
              <strong>Status</strong>
              <p>
                {selectedTrainer.is_active ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <strong>Professional Bio</strong>
              <p>
                {selectedTrainer.trainer_profile?.bio || "No bio provided"}
              </p>
            </div>

          </div>

          <div className="trainer-form-actions">
            <button
              type="button"
              onClick={() => setSelectedTrainer(null)}
            >
              Close Profile
            </button>
          </div>
        </>
      )}

    </div>
  </div>
)}

    <div className="trainers-filters">
  <input
    type="text"
    placeholder="Search trainers..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="all">All Trainers</option>
    <option value="active">Active Trainers</option>
    <option value="inactive">Inactive Trainers</option>
  </select>
</div>
    
    {error && <p className="error-message">{error}</p>}

  {loading ? (
  <p>Loading trainers...</p>
) : trainers.length === 0 ? (
  <div className="empty-state">
    <h3>No trainers found</h3>
    <p>Start by registering your first gym trainer.</p>
  </div>
) : filteredTrainers.length === 0 ? (
  <div className="empty-state">
    <h3>No matching trainers</h3>
    <p>Try changing your search or status filter.</p>
  </div>
) : (

      <div className="trainers-table-container">
        <table className="trainers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
         {filteredTrainers.map((trainer) => (
              <tr key={trainer.id}>
                <td>
                  {trainer.first_name} {trainer.last_name}
                </td>
                <td>{trainer.email}</td>
                <td>{trainer.phone || "N/A"}</td>
                <td>
                  {trainer.trainer_profile?.specialization || "N/A"}
                </td>
                <td>
                  {trainer.trainer_profile?.experience_years || 0} years
                </td>
                <td>
                  <span className={
                    trainer.is_active ? "status-active" : "status-inactive"
                  }>
                    {trainer.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
          <td>
  <div className="trainer-actions">

    <button onClick={() => handleViewTrainer(trainer)}>
      View
    </button>

    <button onClick={() => handleEditClick(trainer)}>
      Edit
    </button>

    <button
      onClick={() => handleToggleStatus(trainer)}
      className={trainer.is_active ? "deactivate-btn" : "activate-btn"}
    >
      {trainer.is_active ? "Deactivate" : "Activate"}
    </button>

  </div>
</td>
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