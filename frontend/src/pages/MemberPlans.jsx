
import { useEffect, useState } from "react";
import api from "../services/api";

export default function MemberPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [creating, setCreating] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentId, setPaymentId] = useState(null);
const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get("/plans/");
        const data = response.data.results || response.data;

        setPlans(data.filter((plan) => plan.is_active));
      } catch (err) {
        setError("Failed to load membership plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
  if (!paymentId || paymentStatus !== "PENDING") return;

  const interval = setInterval(async () => {
    try {
      const response = await api.get(
        `/payments/${paymentId}/status/`
      );

      const status = response.data.status;

      setPaymentStatus(status);

      if (status === "SUCCESS") {
        setPaymentMessage(
          `Payment successful! Receipt: ${response.data.receipt_number}`
        );
        clearInterval(interval);
      } else if (status === "FAILED") {
        setPaymentMessage(
          response.data.result_description || "Payment failed."
        );
        clearInterval(interval);
      }
    } catch (err) {
      console.error("Unable to check payment status.");
    }
  }, 3000);

  return () => clearInterval(interval);
}, [paymentId, paymentStatus]);

  const handleChoosePlan = async (plan) => {
    setCreating(true);
    setError("");

    try {
      const response = await api.post("/my-subscriptions/", {
        plan: plan.id,
      });

      setSelectedPlan({
        ...plan,
        subscriptionId: response.data.id,
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Failed to select membership plan."
      );
    } finally {
      setCreating(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");
    setPaymentMessage("");

    const cleanedPhone = phoneNumber.replace(/\s+/g, "");

    let formattedPhone = cleanedPhone;

    if (cleanedPhone.startsWith("0")) {
      formattedPhone = "254" + cleanedPhone.substring(1);
    } else if (cleanedPhone.startsWith("+254")) {
      formattedPhone = cleanedPhone.substring(1);
    }

    if (!/^254(7|1)\d{8}$/.test(formattedPhone)) {
      setError("Enter a valid Kenyan M-Pesa number, e.g. 0712345678.");
      return;
    }

    setPaying(true);

    try {
      const response = await api.post("/payments/initiate-stk/", {
        subscription_id: selectedPlan.subscriptionId,
        phone_number: formattedPhone,
      });

    setPaymentId(response.data.payment_id);
setPaymentStatus("PENDING");

setPaymentMessage(
  "STK Push sent! Enter your M-Pesa PIN on your phone."
);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Unable to initiate M-Pesa payment. Please try again."
      );
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <p>Loading membership plans...</p>;

  return (
    <div className="membership-plans">
      <h1>Choose Your Membership</h1>
      <p>Select a membership plan to get started.</p>

      {error && <p className="alert alert-error">{error}</p>}

      {selectedPlan ? (
        <div className="plan-card">
          <h2>{selectedPlan.name}</h2>

          <p>Subscription created successfully.</p>
          <p>Status: Pending Payment</p>
          <p>Amount: KES {selectedPlan.price}</p>

          <form onSubmit={handlePayment}>
            <h3>Pay with M-Pesa</h3>

            <label htmlFor="phoneNumber">
              M-Pesa Phone Number
            </label>

            <input
              id="phoneNumber"
              type="tel"
              placeholder="0712345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={paying}
            >
              {paying ? "Sending Request..." : "Pay with M-Pesa"}
            </button>
          </form>
{paymentMessage && (
  <div className="payment-success">
    <p>{paymentMessage}</p>

    {paymentStatus === "PENDING" && (
      <p>Waiting for M-Pesa confirmation...</p>
    )}

    {paymentStatus === "SUCCESS" && (
      <h3>Payment Completed!</h3>
    )}

    {paymentStatus === "FAILED" && (
      <p>Please try again or contact the gym administrator.</p>
    )}
  </div>
)}
        </div>
      ) : plans.length === 0 ? (
        <p>No active membership plans are currently available.</p>
      ) : (
        <div className="plans-list">
          {plans.map((plan) => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <p>Duration: {plan.duration}</p>
              <h3>KES {plan.price}</h3>

              <button
                className="btn btn-primary"
                onClick={() => handleChoosePlan(plan)}
                disabled={creating}
              >
                {creating ? "Please wait..." : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
