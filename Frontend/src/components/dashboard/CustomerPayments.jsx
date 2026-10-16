import { useEffect, useMemo, useState } from "react";
import "./CustomerPayments.css";

const API_BASE_URL = "http://localhost:5080";

function getAccessToken() {
  return (
    localStorage.getItem("seatrack_access_token") ||
    sessionStorage.getItem("seatrack_access_token")
  );
}

function getPaymentStatus(status) {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Completed";
    case 3:
      return "Failed";
    case 4:
      return "Cancelled";
    default:
      return "Unknown";
  }
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleString();
}

export default function CustomerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getAccessToken();

        if (!token) {
          throw new Error("Authorization token was not found.");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/shipping-orders/payments/my`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load payments. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const statistics = useMemo(() => {
    const completed = payments.filter(
      (payment) => payment.status === 2
    );

    const pending = payments.filter(
      (payment) => payment.status === 1
    );

    const failed = payments.filter(
      (payment) => payment.status === 3
    );

    const completedValue = completed.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

    return {
      total: payments.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      completedValue,
    };
  }, [payments]);

  if (loading) {
    return (
      <section className="customer-payments">
        <div className="payments-header">
          <div>
            <span className="payments-eyebrow">
              CUSTOMER BILLING
            </span>

            <h1>Payments</h1>

            <p>
              Review your payment history and transaction
              information.
            </p>
          </div>
        </div>

        <div className="payments-state">
          Loading payments...
        </div>
      </section>
    );
  }

  return (
    <section className="customer-payments">
      <div className="payments-header">
        <div>
          <span className="payments-eyebrow">
            CUSTOMER BILLING
          </span>

          <h1>Payments</h1>

          <p>
            Review your completed, pending and failed
            transactions.
          </p>
        </div>
      </div>

      {error && (
        <div className="payments-error">
          {error}
        </div>
      )}

      <div className="payments-stats">
        <div className="payment-stat-card">
          <span>Total Payments</span>
          <strong>{statistics.total}</strong>
        </div>

        <div className="payment-stat-card">
          <span>Completed</span>
          <strong>{statistics.completed}</strong>
        </div>

        <div className="payment-stat-card">
          <span>Pending</span>
          <strong>{statistics.pending}</strong>
        </div>

        <div className="payment-stat-card">
          <span>Failed</span>
          <strong>{statistics.failed}</strong>
        </div>

        <div className="payment-stat-card payment-stat-wide">
          <span>Completed Value</span>
          <strong>
            {statistics.completedValue.toLocaleString()} USD
          </strong>
        </div>
      </div>

      <div className="payments-list-header">
        <div>
          <h2>Payment History</h2>
          <p>
            All transactions associated with your SeaTrack
            invoices.
          </p>
        </div>

        <span className="payments-count">
          {payments.length} transactions
        </span>
      </div>

      {payments.length === 0 && !error ? (
        <div className="payments-empty">
          <div className="payments-empty-icon">
            $
          </div>

          <h3>No payments yet</h3>

          <p>
            Your payment history will appear here after you
            pay an invoice.
          </p>
        </div>
      ) : (
        <div className="payments-list">
          {payments.map((payment) => {
            const statusName =
              getPaymentStatus(payment.status);

            return (
              <article
                className="payment-card"
                key={payment.id}
              >
                <div className="payment-card-top">
                  <div className="payment-main-info">
                    <div className="payment-icon">
                      $
                    </div>

                    <div>
                      <div className="payment-title-row">
                        <h3>
                          Payment #{payment.id}
                        </h3>

                        <span
                          className={`payment-status payment-status-${statusName.toLowerCase()}`}
                        >
                          {statusName}
                        </span>
                      </div>

                      <p>
                        Invoice {payment.invoiceNumber}
                      </p>
                    </div>
                  </div>

                  <div className="payment-amount">
                    <strong>
                      {Number(
                        payment.amount || 0
                      ).toLocaleString()}
                    </strong>

                    <span>
                      {payment.currency}
                    </span>
                  </div>
                </div>

                <div className="payment-details-grid">
                  <div className="payment-detail">
                    <span>Order</span>
                    <strong>
                      #{payment.shippingOrderId}
                    </strong>
                  </div>

                  <div className="payment-detail">
                    <span>Invoice ID</span>
                    <strong>
                      #{payment.invoiceId}
                    </strong>
                  </div>

                  <div className="payment-detail">
                    <span>Created</span>
                    <strong>
                      {formatDate(
                        payment.createdAtUtc
                      )}
                    </strong>
                  </div>

                  <div className="payment-detail">
                    <span>Paid</span>
                    <strong>
                      {formatDate(
                        payment.paidAtUtc
                      )}
                    </strong>
                  </div>
                </div>

                <div className="payment-reference">
                  <span>
                    Transaction Reference
                  </span>

                  <strong>
                    {payment.transactionReference ||
                      "Not available"}
                  </strong>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}