
import { useEffect, useState } from "react";
import api from "../services/api";
import "./PaymentHistory.css";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("ALL");
const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/payments/history/");
        setPayments(response.data.results || []);
      } catch (err) {
        setError("Failed to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

const filteredPayments = payments.filter((payment) => {
  const searchTerm = search.toLowerCase();

  const matchesSearch =
  payment.member_username.toLowerCase().includes(searchTerm) ||
  payment.member_email.toLowerCase().includes(searchTerm) ||
  payment.plan_name.toLowerCase().includes(searchTerm) ||
  payment.phone_number.includes(searchTerm) ||
  (payment.mpesa_receipt_number || "")
    .toLowerCase()
    .includes(searchTerm);

  const matchesStatus =
    statusFilter === "ALL" || payment.status === statusFilter;

  return matchesSearch && matchesStatus;
});

const totalPayments = payments.length;

const successfulPayments = payments.filter(
  (payment) => payment.status === "SUCCESS"
);

const pendingPayments = payments.filter(
  (payment) => payment.status === "PENDING"
);

const failedPayments = payments.filter(
  (payment) => payment.status === "FAILED"
);

const totalRevenue = successfulPayments.reduce(
  (total, payment) => total + Number(payment.amount),
  0
);

  return (
    <div className="payment-history-page">
      <h1>Payment History</h1>
      <p>View and manage gym membership payments.</p>

      {loading && <p>Loading payments...</p>}

      {error && <p className="error-message">{error}</p>}
{!loading && !error && (
  <>
    <div className="payment-summary-grid">
  <div className="payment-summary-card">
    <h3>Total Payments</h3>
    <h2>{totalPayments}</h2>
  </div>

  <div className="payment-summary-card">
    <h3>Successful Payments</h3>
    <h2>{successfulPayments.length}</h2>
  </div>

  <div className="payment-summary-card">
    <h3>Pending Payments</h3>
    <h2>{pendingPayments.length}</h2>
  </div>

  <div className="payment-summary-card">
    <h3>Failed Payments</h3>
    <h2>{failedPayments.length}</h2>
  </div>

  <div className="payment-summary-card revenue-card">
    <h3>Total Revenue</h3>
    <h2>KES {totalRevenue.toLocaleString()}</h2>
  </div>
</div>

<div className="payment-filters">
  <input
    type="text"
    placeholder="Search by member, email or plan..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="ALL">All Payments</option>
    <option value="SUCCESS">Successful</option>
    <option value="PENDING">Pending</option>
    <option value="FAILED">Failed</option>
  </select>
</div>

    <div className="payment-table-container">
      <table className="payment-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Phone</th>
            <th>Status</th>
            <th>M-Pesa Receipt</th>
            <th>Date</th>
<th>Action</th>
          </tr>
        </thead>

<tbody>
  {filteredPayments.length === 0 ? (
    <tr>
      <td colSpan="8" className="payment-empty-state">
        No matching payment records found.
      </td>
    </tr>
  ) : (
    filteredPayments.map((payment) => (
      <tr key={payment.id}>
        <td>
          <strong>{payment.member_username}</strong>
          <small>{payment.member_email}</small>
        </td>

        <td>{payment.plan_name}</td>

        <td>
          KES {Number(payment.amount).toLocaleString()}
        </td>

        <td>{payment.phone_number}</td>

        <td>
          <span className={`payment-status ${payment.status.toLowerCase()}`}>
            {payment.status}
          </span>
        </td>

        <td>
          {payment.mpesa_receipt_number || "Not available"}
        </td>

        <td>
          {new Date(payment.created_at).toLocaleDateString()}
        </td>
        <td>
  <button
    className="view-payment-btn"
    onClick={() => setSelectedPayment(payment)}
  >
    View Details
  </button>
</td>
      </tr>
    ))
  )}
</tbody>

       
      </table>
    </div>
    {selectedPayment && (
  <div className="payment-modal-overlay">
    <div className="payment-modal">
      <h2>Payment Details</h2>

      <div className="payment-details-grid">
        <div>
          <strong>Member</strong>
          <p>{selectedPayment.member_username}</p>
        </div>

        <div>
          <strong>Email</strong>
          <p>{selectedPayment.member_email}</p>
        </div>

        <div>
          <strong>Membership Plan</strong>
          <p>{selectedPayment.plan_name}</p>
        </div>

        <div>
          <strong>Amount</strong>
          <p>KES {Number(selectedPayment.amount).toLocaleString()}</p>
        </div>

        <div>
          <strong>Phone Number</strong>
          <p>{selectedPayment.phone_number}</p>
        </div>

        <div>
          <strong>Payment Status</strong>
          <p>{selectedPayment.status}</p>
        </div>

        <div>
          <strong>M-Pesa Receipt</strong>
          <p>{selectedPayment.mpesa_receipt_number || "Not available"}</p>
        </div>

        <div>
          <strong>Checkout Request ID</strong>
          <p>{selectedPayment.checkout_request_id || "Not available"}</p>
        </div>

        <div>
          <strong>Merchant Request ID</strong>
          <p>{selectedPayment.merchant_request_id || "Not available"}</p>
        </div>

        <div>
          <strong>Result Code</strong>
          <p>{selectedPayment.result_code || "Not available"}</p>
        </div>

        <div className="payment-result-description">
          <strong>Result Description</strong>
          <p>{selectedPayment.result_description || "Not available"}</p>
        </div>

        <div>
          <strong>Created At</strong>
          <p>{new Date(selectedPayment.created_at).toLocaleString()}</p>
        </div>

        <div>
          <strong>Last Updated</strong>
          <p>{new Date(selectedPayment.updated_at).toLocaleString()}</p>
        </div>
      </div>

      <button
        className="close-payment-modal"
        onClick={() => setSelectedPayment(null)}
      >
        Close
      </button>
    </div>
  </div>
)}
  </>
)}
     
    </div>
  );
}
