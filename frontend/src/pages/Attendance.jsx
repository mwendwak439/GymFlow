
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Attendance.css";

export default function Attendance() {
  const { user } = useAuth();

  const isAdmin = user?.role === "ADMIN";

  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/attendance/");
      setAttendance(response.data.results || response.data);
    } catch (err) {
      setError("Failed to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/attendance/check-in/", {});
      setSuccess("Attendance recorded successfully!");
      await fetchAttendance();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Check-in failed. Please try again."
      );
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="placeholder">
      <h1>
        {isAdmin ? "Attendance Management" : "My Attendance"}
      </h1>

      <p>
        {isAdmin
          ? "Monitor gym attendance across all members."
          : "Record and track your gym visits."}
      </p>

      {!isAdmin && (
        <button
          className="btn btn-primary"
          onClick={handleCheckIn}
          disabled={checkingIn}
        >
          {checkingIn ? "Checking in..." : "Check In"}
        </button>
      )}

      {success && <p>{success}</p>}
      {error && <p>{error}</p>}

      <h2>
        {isAdmin ? "All Attendance Records" : "Attendance History"}
      </h2>

      {loading ? (
        <p>Loading attendance...</p>
      ) : attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <div>
          {attendance.map((record) => (
            <div key={record.id} className="attendance-card">
              <h3>Gym Visit #{record.id}</h3>
              <p>Member: {record.member_name}</p>
              <p>
                Check-in: {new Date(record.check_in).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
