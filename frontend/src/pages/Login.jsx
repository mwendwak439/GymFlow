import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter your username and password.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(form);
      navigate(user.role === "ADMIN" ? "/admin" : "/member");
    } catch (err) {
      const data = err.response?.data;
      setError(data?.non_field_errors?.[0] || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="brand">GymFlow</h1>
        <h2>Welcome back</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} autoFocus />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />

        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}