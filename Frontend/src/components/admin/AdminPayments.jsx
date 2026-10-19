import { useEffect, useMemo, useState } from 'react'
import './AdminPayments.css'

const API_URL = 'http://localhost:5080'

const paymentStatusMap = {
  1: {
    label: 'Pending',
    className: 'pending'
  },
  2: {
    label: 'Completed',
    className: 'completed'
  },
  3: {
    label: 'Failed',
    className: 'failed'
  },
  4: {
    label: 'Cancelled',
    className: 'cancelled'
  }
}

const invoiceStatusMap = {
  1: 'Pending',
  2: 'Paid',
  3: 'Cancelled'
}

const orderStatusMap = {
  1: 'Awaiting Quote',
  2: 'Quote Provided',
  3: 'Quote Accepted',
  4: 'Quote Rejected',
  5: 'Confirmed',
  6: 'In Transit',
  7: 'Delivered',
  8: 'Cancelled'
}

function getToken() {
  return (
    localStorage.getItem('seatrack_access_token') ||
    sessionStorage.getItem('seatrack_access_token')
  )
}

function formatDateTime(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatMoney(amount, currency) {
  const numericAmount = Number(amount)

  if (Number.isNaN(numericAmount)) {
    return `0 ${currency || 'USD'}`
  }

  return `${numericAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })} ${currency || 'USD'}`
}

function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true)
        setError('')

        const token = getToken()

        if (!token) {
          throw new Error(
            'Authorization token was not found.'
          )
        }

        const response = await fetch(
          `${API_URL}/api/admin/shipping-orders/payments`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          }
        )

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error(
              'Your session has expired. Please sign in again.'
            )
          }

          if (response.status === 403) {
            throw new Error(
              'You do not have permission to view payments.'
            )
          }

          throw new Error(
            `Failed to load payments. Status: ${response.status}`
          )
        }

        const data = await response.json()

        setPayments(
          Array.isArray(data) ? data : []
        )
      } catch (err) {
        setError(
          err.message ||
            'Failed to load payments.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [])

  const stats = useMemo(() => {
    const total = payments.length

    const pending = payments.filter(
      (payment) =>
        Number(payment.status) === 1
    ).length

    const completed = payments.filter(
      (payment) =>
        Number(payment.status) === 2
    ).length

    const failed = payments.filter(
      (payment) =>
        Number(payment.status) === 3
    ).length

    const cancelled = payments.filter(
      (payment) =>
        Number(payment.status) === 4
    ).length

    const totalProcessed = payments
      .filter(
        (payment) =>
          Number(payment.status) === 2
      )
      .reduce((sum, payment) => {
        const amount = Number(payment.amount)

        return (
          sum +
          (Number.isNaN(amount)
            ? 0
            : amount)
        )
      }, 0)

    return {
      total,
      pending,
      completed,
      failed,
      cancelled,
      totalProcessed
    }
  }, [payments])

  const filteredPayments = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    return payments.filter((payment) => {
      const status = Number(payment.status)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' &&
          status === 1) ||
        (statusFilter === 'completed' &&
          status === 2) ||
        (statusFilter === 'failed' &&
          status === 3) ||
        (statusFilter === 'cancelled' &&
          status === 4)

      if (!matchesStatus) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const searchableValues = [
        payment.id,
        payment.invoiceId,
        payment.shippingOrderId,
        payment.customerId,
        payment.invoiceNumber,
        payment.transactionReference,
        payment.cargoType,
        payment.originPort,
        payment.destinationPort,
        payment.currency
      ]

      return searchableValues.some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(normalizedSearch)
      )
    })
  }, [payments, search, statusFilter])

  if (loading) {
    return (
      <section className="admin-payments">
        <div className="admin-payments-state">
          <div className="admin-payments-loader" />

          <h3>Loading payments...</h3>

          <p>
            Fetching transaction information
            from SeaTrack.
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-payments">
        <div className="admin-payments-state admin-payments-error">
          <span className="admin-payments-state-icon">
            !
          </span>

          <h3>Unable to load payments</h3>

          <p>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-payments">
      <div className="admin-payments-heading">
        <div>
          <span className="admin-payments-eyebrow">
            Financial Operations
          </span>

          <h1>Payments</h1>

          <p>
            Monitor customer payments,
            transaction references and payment
            activity across SeaTrack shipping
            orders.
          </p>
        </div>

        <div className="admin-payments-heading-badge">
          <span>SeaTrack</span>
          <strong>
            Payment Center
          </strong>
        </div>
      </div>

      <div className="admin-payments-stats">
        <article className="admin-payment-stat-card">
          <span className="admin-payment-stat-label">
            Total Payments
          </span>

          <strong>
            {stats.total}
          </strong>

          <small>
            All transactions
          </small>
        </article>

        <article className="admin-payment-stat-card">
          <span className="admin-payment-stat-label">
            Completed
          </span>

          <strong>
            {stats.completed}
          </strong>

          <small>
            Successful payments
          </small>
        </article>

        <article className="admin-payment-stat-card">
          <span className="admin-payment-stat-label">
            Pending
          </span>

          <strong>
            {stats.pending}
          </strong>

          <small>
            Awaiting completion
          </small>
        </article>

        <article className="admin-payment-stat-card">
          <span className="admin-payment-stat-label">
            Failed
          </span>

          <strong>
            {stats.failed}
          </strong>

          <small>
            Failed transactions
          </small>
        </article>

        <article className="admin-payment-stat-card">
          <span className="admin-payment-stat-label">
            Processed Value
          </span>

          <strong>
            {stats.totalProcessed.toLocaleString(
              'en-US',
              {
                maximumFractionDigits: 2
              }
            )}
          </strong>

          <small>
            Completed payment value
          </small>
        </article>
      </div>

      <div className="admin-payments-toolbar">
        <div className="admin-payments-search">
          <span className="admin-payments-search-icon">
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search transaction, invoice, order, customer or route..."
          />
        </div>

        <div className="admin-payments-filters">
          <button
            type="button"
            className={
              statusFilter === 'all'
                ? 'active'
                : ''
            }
            onClick={() =>
              setStatusFilter('all')
            }
          >
            All
          </button>

          <button
            type="button"
            className={
              statusFilter === 'completed'
                ? 'active'
                : ''
            }
            onClick={() =>
              setStatusFilter('completed')
            }
          >
            Completed
          </button>

          <button
            type="button"
            className={
              statusFilter === 'pending'
                ? 'active'
                : ''
            }
            onClick={() =>
              setStatusFilter('pending')
            }
          >
            Pending
          </button>

          <button
            type="button"
            className={
              statusFilter === 'failed'
                ? 'active'
                : ''
            }
            onClick={() =>
              setStatusFilter('failed')
            }
          >
            Failed
          </button>

          <button
            type="button"
            className={
              statusFilter === 'cancelled'
                ? 'active'
                : ''
            }
            onClick={() =>
              setStatusFilter('cancelled')
            }
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="admin-payments-results">
        <div>
          <strong>
            {filteredPayments.length}
          </strong>

          <span>
            {filteredPayments.length === 1
              ? ' payment found'
              : ' payments found'}
          </span>
        </div>

        {(search ||
          statusFilter !== 'all') && (
          <button
            type="button"
            className="admin-payments-clear"
            onClick={() => {
              setSearch('')
              setStatusFilter('all')
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredPayments.length === 0 ? (
        <div className="admin-payments-empty">
          <span>PAY</span>

          <h3>No payments found</h3>

          <p>
            There are no payments matching
            the selected filters.
          </p>
        </div>
      ) : (
        <div className="admin-payments-list">
          {filteredPayments.map(
            (payment) => {
              const status =
                paymentStatusMap[
                  Number(payment.status)
                ] || {
                  label: 'Unknown',
                  className: 'unknown'
                }

              const invoiceStatus =
                invoiceStatusMap[
                  Number(
                    payment.invoiceStatus
                  )
                ] || 'Unknown'

              const orderStatus =
                orderStatusMap[
                  Number(
                    payment.shippingOrderStatus
                  )
                ] || 'Unknown'

              return (
                <article
                  className="admin-payment-card"
                  key={payment.id}
                >
                  <div className="admin-payment-card-top">
                    <div className="admin-payment-number">
                      <span>
                        Payment
                      </span>

                      <h3>
                        Payment #{payment.id}
                      </h3>

                      <small>
                        {payment.transactionReference ||
                          'No transaction reference'}
                      </small>
                    </div>

                    <div
                      className={`admin-payment-status ${status.className}`}
                    >
                      <span />

                      {status.label}
                    </div>
                  </div>

                  <div className="admin-payment-amount">
                    <span>
                      Payment Amount
                    </span>

                    <strong>
                      {formatMoney(
                        payment.amount,
                        payment.currency
                      )}
                    </strong>
                  </div>

                  <div className="admin-payment-route">
                    <div>
                      <span>
                        Origin
                      </span>

                      <strong>
                        {payment.originPort ||
                          '—'}
                      </strong>
                    </div>

                    <div className="admin-payment-route-line">
                      <span />
                      <b>→</b>
                      <span />
                    </div>

                    <div>
                      <span>
                        Destination
                      </span>

                      <strong>
                        {payment.destinationPort ||
                          '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-payment-details-grid">
                    <div>
                      <span>
                        Invoice
                      </span>

                      <strong>
                        {payment.invoiceNumber ||
                          `#${payment.invoiceId}`}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Shipping Order
                      </span>

                      <strong>
                        #
                        {payment.shippingOrderId ??
                          '—'}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Cargo
                      </span>

                      <strong>
                        {payment.cargoType ||
                          '—'}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Invoice Status
                      </span>

                      <strong>
                        {invoiceStatus}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Order Status
                      </span>

                      <strong>
                        {orderStatus}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Payment ID
                      </span>

                      <strong>
                        #{payment.id}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-payment-dates">
                    <div>
                      <span>
                        Created
                      </span>

                      <strong>
                        {formatDateTime(
                          payment.createdAtUtc
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Paid
                      </span>

                      <strong>
                        {formatDateTime(
                          payment.paidAtUtc
                        )}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-payment-customer">
                    <div className="admin-payment-customer-icon">
                      C
                    </div>

                    <div>
                      <span>
                        Customer ID
                      </span>

                      <strong>
                        {payment.customerId ||
                          '—'}
                      </strong>
                    </div>
                  </div>
                </article>
              )
            }
          )}
        </div>
      )}
    </section>
  )
}

export default AdminPayments