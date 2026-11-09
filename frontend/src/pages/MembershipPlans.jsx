import { useEffect, useState } from "react";
import api from "../services/api";
import "./MembershipPlans.css";

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
const [editingPlan, setEditingPlan] = useState(null);

const [formData, setFormData] = useState({
  name: "",
  description: "",
  duration: "MONTHLY",
  price: "",
  is_active: true,
});

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/plans/");
        setPlans(response.data.results || []);
      } catch (err) {
        setError("Failed to load membership plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) return <p>Loading membership plans...</p>;
  if (error) return <p>{error}</p>;


const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let response;

    if (editingPlan) {
      response = await api.patch(
        `/plans/${editingPlan.id}/`,
        formData
      );

      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlan.id ? response.data : plan
        )
      );
    } else {
      response = await api.post("/plans/", formData);
      setPlans((prev) => [...prev, response.data]);
    }

    setFormData({
      name: "",
      description: "",
      duration: "MONTHLY",
      price: "",
      is_active: true,
    });

    setEditingPlan(null);
    setShowForm(false);
    setError("");
  } catch (err) {
    setError("Failed to save membership plan. Check your details.");
  }
};
const handleEdit = (plan) => {
  setEditingPlan(plan);
  setFormData({
    name: plan.name,
    description: plan.description || "",
    duration: plan.duration,
    price: plan.price,
    is_active: plan.is_active,
  });
  setShowForm(true);
};

const handleToggleStatus = async (plan) => {
  try {
    const response = await api.patch(`/plans/${plan.id}/`, {
      is_active: !plan.is_active,
    });

    setPlans((prev) =>
      prev.map((p) => p.id === plan.id ? response.data : p)
    );
  } catch (err) {
    setError("Failed to update plan status.");
  }
};
return (
  <div className="membership-plans">
    <h1>Membership Plans</h1>

    <p>Total Plans: {plans.length}</p>

    <button onClick={() => {
      setEditingPlan(null);
      setFormData({
        name: "",
        description: "",
        duration: "MONTHLY",
        price: "",
        is_active: true,
      });
      setShowForm(true);
    }}>
      Add New Plan
    </button>

    {error && <p className="alert alert-error">{error}</p>}

    {showForm && (
      <form onSubmit={handleSubmit}>
        <h2>{editingPlan ? "Edit Plan" : "Add New Plan"}</h2>

        <input name="name" placeholder="Plan Name" value={formData.name}
          onChange={handleChange} required />

        <textarea name="description" placeholder="Description"
          value={formData.description} onChange={handleChange} />

        <select name="duration" value={formData.duration}
          onChange={handleChange}>
          <option value="MONTHLY">Monthly</option>
          <option value="QUARTERLY">Quarterly</option>
          <option value="YEARLY">Yearly</option>
        </select>

        <input name="price" type="number" min="0.01" step="0.01"
          placeholder="Price (KES)" value={formData.price}
          onChange={handleChange} required />

        <button type="submit">
          {editingPlan ? "Update Plan" : "Save Plan"}
        </button>

        <button type="button" onClick={() => {
          setShowForm(false);
          setEditingPlan(null);
        }}>
          Cancel
        </button>
      </form>
    )}

    {loading ? (
      <p>Loading plans...</p>
    ) : plans.length === 0 ? (
      <p>No membership plans available.</p>
    ) : (
      <div className="plans-list">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <p>Duration: {plan.duration}</p>
            <p>Price: KES {plan.price}</p>
            <p>Status: {plan.is_active ? "Active" : "Inactive"}</p>

            <button onClick={() => handleEdit(plan)}>Edit</button>

            <button onClick={() => handleToggleStatus(plan)}>
              {plan.is_active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
    )}