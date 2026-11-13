
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./workouts.css";



export default function Workouts() {
      const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({

  name: "",
  description: "",
  duration: "",
  difficulty: "BEGINNER",
  is_active: true,
});
const [editingWorkout, setEditingWorkout] = useState(null);

  const fetchWorkouts = async () => {
    try {
      const response = await api.get("/workouts/");
      setWorkouts(response.data.results || response.data);
    } catch (err) {
      setError("Failed to load workouts.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });
};

const handleEdit = (workout) => {
  setEditingWorkout(workout);
  setFormData({
    name: workout.name,
    description: workout.description,
    duration: workout.duration,
    difficulty: workout.difficulty,
    is_active: workout.is_active,
  });
  setShowForm(true);
};

const handleDelete = async (workout) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${workout.name}?`
  );

  if (!confirmed) return;

  try {
    await api.delete(`/workouts/${workout.id}/`);
    await fetchWorkouts();
  } catch (err) {
    setError("Failed to delete workout.");
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const data = {
      ...formData,
      duration: Number(formData.duration),
    };

    if (editingWorkout) {
      await api.patch(`/workouts/${editingWorkout.id}/`, data);
    } else {
      await api.post("/workouts/", data);
    }

    setFormData({
      name: "",
      description: "",
      duration: "",
      difficulty: "BEGINNER",
      is_active: true,
    });

    setEditingWorkout(null);
    setShowForm(false);

    await fetchWorkouts();
  } catch (err) {
    setError(
      err.response?.data?.detail ||
      "Failed to save workout. Please check your information."
    );
  }
};


  useEffect(() => {
    fetchWorkouts();
  }, []);

  if (loading) return <p>Loading workouts...</p>;

  return (
    <div className="workouts-page">
      <h1>Workout Management</h1>
      <p className="subtitle">
        Explore and manage gym workout programs.
      </p>

     
{user?.role === "ADMIN" && (
  <button onClick={() => setShowForm(!showForm)}>
    {showForm ? "Close Form" : "Add Workout"}
  </button>
)}

{showForm && user?.role === "ADMIN" && (
  <form onSubmit={handleSubmit} className="workout-form">
   
<h2>{editingWorkout ? "Edit Workout" : "Add New Workout"}</h2>
    <label>Workout Name</label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
    />

    <label>Description</label>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      required
    />

    <label>Duration (minutes)</label>
    <input
      type="number"
      name="duration"
      value={formData.duration}
      onChange={handleChange}
      min="1"
      required
    />

    <label>Difficulty</label>
    <select
      name="difficulty"
      value={formData.difficulty}
      onChange={handleChange}
    >
      <option value="BEGINNER">Beginner</option>
      <option value="INTERMEDIATE">Intermediate</option>
      <option value="ADVANCED">Advanced</option>
    </select>

    <label>
      <input
        type="checkbox"
        name="is_active"
        checked={formData.is_active}
        onChange={handleChange}
      />
      Active workout
    </label>

   <button type="submit">
  {editingWorkout ? "Update Workout" : "Save Workout"}
</button>
  </form>
)}
 

      {error && <p className="error-message">{error}</p>}

      <div className="workouts-grid">
        {workouts.map((workout) => (
          <div className="workout-card" key={workout.id}>
            <h2>{workout.name}</h2>

            <p>{workout.description}</p>

            <div className="workout-details">
              <span>{workout.duration} minutes</span>
              <span>{workout.difficulty}</span>
            </div>

            <span
              className={`workout-status ${
                workout.is_active ? "active" : "inactive"
              }`}
            >
              {workout.is_active ? "Active" : "Inactive"}
            </span>

{user?.role === "ADMIN" && (
  <div className="workout-actions">
    <button onClick={() => handleEdit(workout)}>
      Edit
    </button>

    <button
      className="delete-btn"
      onClick={() => handleDelete(workout)}
    >
      Delete
    </button>
  </div>
)}

          </div>
        ))}
      </div>

      {workouts.length === 0 && (
        <p>No workouts available yet.</p>
      )}
    </div>
  );
}
