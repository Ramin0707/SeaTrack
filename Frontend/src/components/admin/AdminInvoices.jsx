import { useEffect, useMemo, useState } from "react";
import "./AdminInvoices.css";

const API_URL = "https://localhost:44328";

const invoiceStatusMap = {
  1: {
    label: "Pending",
    className: "pending",
  },
  2: {
    label: "Paid",
    className: "paid",
  },
  3: {
    label: "Cancelled",
    className: "cancelled",
  },
};

const orderStatusMap = {
  1: "Awaiting Quote",
  2: "Quote Provided",
  3: "Quote Accepted",
  4: "Quote Rejected",
  5: "Confirmed",
  6: "In Transit",
  7: "Delivered",
  8: "Cancelled",
};

function getToken() {
  return (
    localStorage.getItem("seatrack_access_token") ||
    sessionStorage.getItem("seatrack_access_token")
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(amount, currency) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `0 ${currency || "USD"}`;
  }

  return `${numericAmount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${currency || "USD"}`;
}

function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error("Authorization token was not found.");
        }

        const response = await fetch(
          `${API_URL}/api/admin/shipping-orders/invoices`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              "Your session has expired. Please sign in again."
            );
          }

          if (response.status === 403) {
            throw new Error(
              "You do not have permission to view invoices."
            );
          }

          throw new Error(
            `Failed to load invoices. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setInvoices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const stats = useMemo(() => {
    const total = invoices.length;

    const pending = invoices.filter(
      (invoice) => Number(invoice.status) === 1
    ).length;

    const paid = invoices.filter(
      (invoice) => Number(invoice.status) === 2
    ).length;

    const cancelled = invoices.filter(
      (invoice) => Number(invoice.status) === 3
    ).length;

    const totalAmount = invoices.reduce((sum, invoice) => {
      const amount = Number(invoice.amount);

      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);

    return {
      total,
      pending,
      paid,
      cancelled,
      totalAmount,
    };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const status = Number(invoice.status);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && status === 1) ||
        (statusFilter === "paid" && status === 2) ||
        (statusFilter === "cancelled" && status === 3);

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableValues = [
        invoice.id,
        invoice.shippingOrderId,
        invoice.quoteId,
        invoice.invoiceNumber,
        invoice.customerId,
        invoice.cargoType,
        invoice.originPort,
        invoice.destinationPort,
        invoice.currency,
      ];

      return searchableValues.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [invoices, search, statusFilter]);

  if (loading) {
    return (
      <section className="admin-invoices">
        <div className="admin-invoices-state">
          <div className="admin-invoices-loader" />
          <h3>Loading invoices...</h3>
          <p>Fetching billing information from SeaTrack.</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-invoices">
        <div className="admin-invoices-state admin-invoices-error">
          <span className="admin-invoices-state-icon">!</span>
          <h3>Unable to load invoices</h3>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-invoices">
      <div className="admin-invoices-heading">
        <div>
          <span className="admin-invoices-eyebrow">
            Billing Management
          </span>

          <h1>Invoices</h1>

          <p>
            Monitor customer invoices, payment status and billing
            information across all shipping orders.
          </p>
        </div>

        <div className="admin-invoices-heading-badge">
          <span>SeaTrack</span>
          <strong>Billing Center</strong>
        </div>
      </div>

      <div className="admin-invoices-stats">
        <article className="admin-invoice-stat-card">
          <span className="admin-invoice-stat-label">
            Total Invoices
          </span>

          <strong>{stats.total}</strong>

          <small>All generated invoices</small>
        </article>

        <article className="admin-invoice-stat-card">
          <span className="admin-invoice-stat-label">
            Pending
          </span>

          <strong>{stats.pending}</strong>

          <small>Awaiting payment</small>
        </article>

        <article className="admin-invoice-stat-card">
          <span className="admin-invoice-stat-label">
            Paid
          </span>

          <strong>{stats.paid}</strong>

          <small>Completed invoices</small>
        </article>

        <article className="admin-invoice-stat-card">
          <span className="admin-invoice-stat-label">
            Cancelled
          </span>

          <strong>{stats.cancelled}</strong>

          <small>Cancelled invoices</small>
        </article>

        <article className="admin-invoice-stat-card">
          <span className="admin-invoice-stat-label">
            Total Value
          </span>

          <strong>
            {stats.totalAmount.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </strong>

          <small>Combined invoice value</small>
        </article>
      </div>

      <div className="admin-invoices-toolbar">
        <div className="admin-invoices-search">
          <span className="admin-invoices-search-icon">
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search invoice, order, customer, cargo or route..."
          />
        </div>

        <div className="admin-invoices-filters">
          <button
            type="button"
            className={
              statusFilter === "all" ? "active" : ""
            }
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>

          <button
            type="button"
            className={
              statusFilter === "pending" ? "active" : ""
            }
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </button>

          <button
            type="button"
            className={
              statusFilter === "paid" ? "active" : ""
            }
            onClick={() => setStatusFilter("paid")}
          >
            Paid
          </button>

          <button
            type="button"
            className={
              statusFilter === "cancelled" ? "active" : ""
            }
            onClick={() => setStatusFilter("cancelled")}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="admin-invoices-results">
        <div>
          <strong>{filteredInvoices.length}</strong>
          <span>
            {filteredInvoices.length === 1
              ? " invoice found"
              : " invoices found"}
          </span>
        </div>

        {(search || statusFilter !== "all") && (
          <button
            type="button"
            className="admin-invoices-clear"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="admin-invoices-empty">
          <span>INV</span>
          <h3>No invoices found</h3>
          <p>
            There are no invoices matching the selected filters.
          </p>
        </div>
      ) : (
        <div className="admin-invoices-list">
          {filteredInvoices.map((invoice) => {
            const status =
              invoiceStatusMap[Number(invoice.status)] || {
                label: "Unknown",
                className: "unknown",
              };

            const orderStatus =
              orderStatusMap[
                Number(invoice.shippingOrderStatus)
              ] || "Unknown";

            return (
              <article
                className="admin-invoice-card"
                key={invoice.id}
              >
                <div className="admin-invoice-card-top">
                  <div className="admin-invoice-number">
                    <span>Invoice</span>

                    <h3>
                      {invoice.invoiceNumber ||
                        `Invoice #${invoice.id}`}
                    </h3>

                    <small>Invoice ID #{invoice.id}</small>
                  </div>

                  <div
                    className={`admin-invoice-status ${status.className}`}
                  >
                    <span />
                    {status.label}
                  </div>
                </div>

                <div className="admin-invoice-amount">
                  <span>Invoice Amount</span>

                  <strong>
                    {formatMoney(
                      invoice.amount,
                      invoice.currency
                    )}
                  </strong>
                </div>

                <div className="admin-invoice-route">
                  <div>
                    <span>Origin</span>
                    <strong>
                      {invoice.originPort || "—"}
                    </strong>
                  </div>

                  <div className="admin-invoice-route-line">
                    <span />
                    <b>→</b>
                    <span />
                  </div>

                  <div>
                    <span>Destination</span>
                    <strong>
                      {invoice.destinationPort || "—"}
                    </strong>
                  </div>
                </div>

                <div className="admin-invoice-details-grid">
                  <div>
                    <span>Shipping Order</span>
                    <strong>
                      #{invoice.shippingOrderId ?? "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Quote</span>
                    <strong>
                      #{invoice.quoteId ?? "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Cargo</span>
                    <strong>
                      {invoice.cargoType || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Order Status</span>
                    <strong>{orderStatus}</strong>
                  </div>

                  <div>
                    <span>Issued</span>
                    <strong>
                      {formatDate(invoice.issuedAtUtc)}
                    </strong>
                  </div>

                  <div>
                    <span>Due Date</span>
                    <strong>
                      {formatDate(invoice.dueDateUtc)}
                    </strong>
                  </div>
                </div>

                <div className="admin-invoice-customer">
                  <div className="admin-invoice-customer-icon">
                    C
                  </div>

                  <div>
                    <span>Customer ID</span>
                    <strong>
                      {invoice.customerId || "—"}
                    </strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AdminInvoices;