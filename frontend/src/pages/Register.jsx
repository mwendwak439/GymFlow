import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const empty = {
  username: "", email: "", first_name: "", last_name: "",
  phone: "", password: "", password_confirm: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required.";
    if (!form.first_name.trim()) e.first_name = "First name is required.";
    if (!form.last_name.trim()) e.last_name = "Last name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (form.password !== form.password_confirm) e.password_confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const clientErrors = validate();
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) return;

    setSubmitting(true);
    try {
      await register(form);
      navigate("/member");
    } catch (err) {
      // Django returns errors like { email: ["..."] }; show the first message per field
      const data = err.response?.data || {};
      const mapped = {};
      for (const key in data) {
        mapped[key] = Array.isArray(data[key]) ? data[key][0] : String(data[key]);
      }
      setErrors(Object.keys(mapped).length ? mapped : { general: "Registration failed." });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, type = "text") => (
    <>
      <label>{label}</label>
      <input name={name} type={type} value={form[name]} onChange={handleChange} />
      {errors[name] && <small className="field-error">{errors[name]}</small>}
    </>
  );

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="brand">GymFlow</h1>
        <h2>Create your account</h2>
        {errors.general && <div className="alert alert-error">{errors.general}</div>}
        {errors.non_field_errors && <div className="alert alert-error">{errors.non_field_errors}</div>}

        {field("first_name", "First name")}
        {field("last_name", "Last name")}
        {field("username", "Username")}
        {field("email", "Email", "email")}
        {field("phone", "Phone number")}
        {field("password", "Password", "password")}
        {field("password_confirm", "Confirm password", "password")}

        <button className="btn btn-primary" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </button>
        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}