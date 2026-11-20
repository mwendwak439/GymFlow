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
 return (
  <div className="trainers-page">

    <div className="trainers-header">
      <div>
        <h1>Trainer Management</h1>
        <p>Manage your gym trainers and their professional information.</p>
      </div>

      <button onClick={() => setShowForm(true)}>
        + Add Trainer
      </button>
    </div>
{showForm && (
  <div className="trainer-modal-overlay">
    <div className="trainer-modal">
      <h2>Register New Trainer</h2>

      <form onSubmit={handleAddTrainer}>

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
          <button type="submit">Register Trainer</button>

          <button
            type="button"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  </div>
)}
    {error && <p className="error-message">{error}</p>}

    {loading ? (
      <p>Loading trainers...</p>
    ) : trainers.length === 0 ? (
      <div className="empty-state">
        <h3>No trainers found</h3>
        <p>Start by registering your first gym trainer.</p>
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
            {trainers.map((trainer) => (
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
                  <button onClick={() => setEditingTrainer(trainer)}>
                    Edit
                  </button>
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