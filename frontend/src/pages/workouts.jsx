
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
// Exercise Management
const [exercises, setExercises] = useState([]);
const [selectedWorkout, setSelectedWorkout] = useState(null);
const [showExerciseForm, setShowExerciseForm] = useState(false);
const[editingExercise,setEditingExercise]=useState(null)
// Workout Assignment Management
const [members, setMembers] = useState([]);
const [showAssignmentForm, setShowAssignmentForm] = useState(false);
const [assignmentForm, setAssignmentForm] = useState({
  workout: "",
  member: "",
  start_date: "",
  end_date: "",
});
const [exerciseForm, setExerciseForm] = useState({
  name: "",
  description: "",
  sets: 3,
  repetitions: "",
  duration_minutes: "",
});
const [assignments, setAssignments] = useState([]);
const [assignmentLoading, setAssignmentLoading] = useState(true);

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

  const fetchMembers = async () => {
  try {
    const response = await api.get("/members/");
    setMembers(response.data.results || []);
  } catch (err) {
    setError("Failed to load members.");
  }
};

const fetchExercises = async (workoutId) => {
  try {
    const response = await api.get(`/exercises/?workout=${workoutId}`);

    const data = response.data.results || response.data;

    setExercises(data);
  } catch (err) {
    setError("Failed to load exercises.");
  }
};

const handleExerciseChange = (e) => {
  const { name, value } = e.target;

  setExerciseForm({
    ...exerciseForm,
    [name]: value,
  });
};

const handleEditExercise = (exercise) => {
  setEditingExercise(exercise);

  setExerciseForm({
    name: exercise.name,
    description: exercise.description || "",
    sets: exercise.sets,
    repetitions: exercise.repetitions || "",
    duration_minutes: exercise.duration_minutes || "",
  });

  setShowExerciseForm(true);
};

const handleDeleteExercise = async (exercise) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${exercise.name}?`
  );

  if (!confirmed) return;

  try {
    await api.delete(`/exercises/${exercise.id}/`);

    await fetchExercises(selectedWorkout.id);
  } catch (err) {
    setError("Failed to delete exercise.");
  }
};

const handleExerciseSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const data = {
      ...exerciseForm,
      workout: selectedWorkout.id,
      sets: Number(exerciseForm.sets),
      repetitions: exerciseForm.repetitions
        ? Number(exerciseForm.repetitions)
        : null,
      duration_minutes: exerciseForm.duration_minutes
        ? Number(exerciseForm.duration_minutes)
        : null,
    };

   if(editingExercise){
    await api.patch(`/exercises/${editingExercise.id}/`, data);
   } else{
    await api.post("/exercises/", data)
   }

    setExerciseForm({
      name: "",
      description: "",
      sets: 3,
      repetitions: "",
      duration_minutes: "",
    });

    setShowExerciseForm(false);
    setEditingExercise(null);

    await fetchExercises(selectedWorkout.id);
  } catch (err) {
    setError(
      err.response?.data?.detail ||
      "Failed to save exercise. Please check your information."
    );
  }
};


  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });
};

const handleAssignmentChange = (e) => {
  const { name, value } = e.target;

  setAssignmentForm({
    ...assignmentForm,
    [name]: value,
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

  const fetchAssignments = async () => {
  try {
    const response = await api.get("/workout-assignments/");
    setAssignments(response.data.results || response.data);
  } catch (err) {
    setError("Failed to load workout assignments.");
  } finally {
    setAssignmentLoading(false);
  }
};



useEffect(() => {
  fetchWorkouts();
  fetchAssignments();

  if (user?.role === "ADMIN") {
    fetchMembers();
  }
}, [user?.role]);


const handleAssignmentSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const data = {
      ...assignmentForm,
      workout: Number(assignmentForm.workout),
      member: Number(assignmentForm.member),
      end_date: assignmentForm.end_date || null,
    };

    await api.post("/workout-assignments/", data);

    setAssignmentForm({
      workout: "",
      member: "",
      start_date: "",
      end_date: "",
    });

    setShowAssignmentForm(false);
    await fetchAssignments();

  } catch (err) {
    setError(
      err.response?.data?.detail ||
      "Failed to assign workout."
    );
  }
};

  if (loading) return <p>Loading workouts...</p>;

  return (
    <div className="workouts-page">
      <h1>Workout Management</h1>
      <p className="subtitle">
        Explore and manage gym workout programs.
      </p>

{user?.role === "ADMIN" && (
  <button
    onClick={() => setShowAssignmentForm(!showAssignmentForm)}
  >
    {showAssignmentForm ? "Close Assignment Form" : "Assign Workout"}
  </button>
)}

{showAssignmentForm && user?.role === "ADMIN" && (
  <form
    onSubmit={handleAssignmentSubmit}
    className="workout-form"
  >
    <h2>Assign Workout to Member</h2>

    <label>Workout</label>
    <select
      name="workout"
      value={assignmentForm.workout}
      onChange={handleAssignmentChange}
      required
    >
      <option value="">Select workout</option>

      {workouts
        .filter((workout) => workout.is_active)
        .map((workout) => (
          <option key={workout.id} value={workout.id}>
            {workout.name}
          </option>
        ))}
    </select>

    <label>Member</label>
    <select
      name="member"
      value={assignmentForm.member}
      onChange={handleAssignmentChange}
      required
    >
      <option value="">Select member</option>

      {members.map((member) => (
        <option key={member.id} value={member.id}>
          {member.username}
        </option>
      ))}
    </select>

    <label>Start Date</label>
    <input
      type="date"
      name="start_date"
      value={assignmentForm.start_date}
      onChange={handleAssignmentChange}
      required
    />

    <label>End Date (optional)</label>
    <input
      type="date"
      name="end_date"
      value={assignmentForm.end_date}
      onChange={handleAssignmentChange}
      min={assignmentForm.start_date || undefined}
    />

    <button type="submit">Assign Workout</button>

    <button
      type="button"
      onClick={() => setShowAssignmentForm(false)}
    >
      Cancel
    </button>
  </form>
)}
     
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
  <button
    onClick={() => {
      setSelectedWorkout(workout);
      fetchExercises(workout.id);
      setShowExerciseForm(false);
    }}
  >
    Manage Exercises
  </button>
)}


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
      
 <div className="workout-assignments-section">
        <h2>
          {user?.role === "ADMIN"
            ? "Workout Assignments"
            : "My Assigned Workouts"}
        </h2>

        {assignmentLoading ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p>No workout assignments yet.</p>
        ) : (
          <div className="workouts-grid">
            {assignments.map((assignment) => (
              <div className="workout-card" key={assignment.id}>
                <h3>{assignment.workout_name}</h3>

                {user?.role === "ADMIN" && (
                  <p>Member: {assignment.member_name}</p>
                )}

                <p>Start Date: {assignment.start_date}</p>

                <p>
                  End Date: {assignment.end_date || "Not specified"}
                </p>

                <p>Status: {assignment.status}</p>
                <div className="assigned-exercises">
  <h4>Exercises</h4>

  {assignment.workout_details?.exercises?.length > 0 ? (
    assignment.workout_details.exercises.map((exercise) => (
      <div key={exercise.id}>
        <h5>{exercise.name}</h5>
        <p>{exercise.description}</p>
        <p>Sets: {exercise.sets}</p>
        <p>
          Repetitions: {exercise.repetitions || "Not specified"}
        </p>
        <p>
          Duration: {exercise.duration_minutes
            ? `${exercise.duration_minutes} minutes`
            : "Not specified"}
        </p>
      </div>
    ))
  ) : (
    <p>No exercises added to this workout yet.</p>
  )}
</div>
              </div>
            ))}
          </div>
        )}
      </div>



      {selectedWorkout && user?.role === "ADMIN" && (
  <div className="workout-form">
    <h2>Exercises for {selectedWorkout.name}</h2>

    <button onClick={() => setShowExerciseForm(true)}>
      Add Exercise
    </button>

{showExerciseForm && (
  <form onSubmit={handleExerciseSubmit} className="workout-form">
  <h3>{editingExercise? "Edit Exercise":"Add New Exercise"}</h3>

    <label>Exercise Name</label>
    <input
      type="text"
      name="name"
      value={exerciseForm.name}
      onChange={handleExerciseChange}
      required
    />

    <label>Description</label>
    <textarea
      name="description"
      value={exerciseForm.description}
      onChange={handleExerciseChange}
    />

    <label>Sets</label>
    <input
      type="number"
      name="sets"
      min="1"
      value={exerciseForm.sets}
      onChange={handleExerciseChange}
      required
    />

    <label>Repetitions</label>
    <input
      type="number"
      name="repetitions"
      min="1"
      value={exerciseForm.repetitions}
      onChange={handleExerciseChange}
    />

    <label>Duration (minutes)</label>
    <input
      type="number"
      name="duration_minutes"
      min="1"
      value={exerciseForm.duration_minutes}
      onChange={handleExerciseChange}
    />

    <button type="submit">
   {editingExercise? "Update Exercise":"Save Exercise"}
      </button>

    <button
      type="button"
      onClick={() => setShowExerciseForm(false)}
    >
      Cancel
    </button>
  </form>
)}

    {exercises.length === 0 ? (
      <p>No exercises added yet.</p>
    ) : (
      exercises.map((exercise) => (
        <div key={exercise.id}>
          <h3>{exercise.name}</h3>
          <p>{exercise.description}</p>
          <p>Sets: {exercise.sets}</p>
          <p>Repetitions: {exercise.repetitions || "Not specified"}</p>
          <p>Duration: {exercise.duration_minutes || "Not specified"} minutes</p>
          <div className="exercise-actions">

            <button onClick={() => handleEditExercise(exercise)}>
            Edit
          </button>
          <button
            className="delete-btn"
            onClick={()=>handleDeleteExercise(exercise)}
            >
              Delete

          </button>
          </div>
        </div>
        
      ))
    )}
  </div>
)}
    </div>
    
  );
}
