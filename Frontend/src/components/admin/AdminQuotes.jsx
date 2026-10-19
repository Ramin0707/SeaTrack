import './AdminQuotes.css'
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

const API_URL = 'http://localhost:5080'

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

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

function formatMoney(value, currency = 'USD') {
  const amount = Number(value)

  if (Number.isNaN(amount)) {
    return '—'
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 2
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency || ''}`.trim()
  }
}

function AdminQuotes() {
  const [quotes, setQuotes] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const loadQuotes = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setError(
        'Authorization token was not found. Please log in again.'
      )
      setQuotes([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/admin/shipping-orders/quotes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      if (response.status === 403) {
        throw new Error(
          'You do not have permission to view quotations.'
        )
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load quotations. Status: ${response.status}`
        )
      }

      const data = await response.json()

      setQuotes(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
          'Unable to load quotations.'
      )

      setQuotes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadQuotes()
  }, [loadQuotes])

  const quoteStats = useMemo(() => {
    const total = quotes.length

    const pendingCustomer = quotes.filter(
      (quote) =>
        Number(quote.shippingOrderStatus) === 2
    ).length

    const accepted = quotes.filter(
      (quote) => {
        const status =
          Number(quote.shippingOrderStatus)

        return (
          status === 3 ||
          status === 5 ||
          status === 6 ||
          status === 7
        )
      }
    ).length

    const rejected = quotes.filter(
      (quote) =>
        Number(quote.shippingOrderStatus) === 4
    ).length

    return {
      total,
      pendingCustomer,
      accepted,
      rejected
    }
  }, [quotes])

  const filteredQuotes = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase()

    return quotes.filter((quote) => {
      const status =
        Number(quote.shippingOrderStatus)

      const matchesSearch =
        !normalizedSearch ||
        String(quote.id ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(quote.shippingOrderId ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(quote.customerId ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(quote.cargoType ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(quote.originPort ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(quote.destinationPort ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(quote.currency ?? '')
          .toLowerCase()
          .includes(normalizedSearch)

      if (!matchesSearch) {
        return false
      }

      if (statusFilter === 'all') {
        return true
      }

      if (statusFilter === 'pending') {
        return status === 2
      }

      if (statusFilter === 'accepted') {
        return (
          status === 3 ||
          status === 5 ||
          status === 6 ||
          status === 7
        )
      }

      if (statusFilter === 'rejected') {
        return status === 4
      }

      return true
    })
  }, [quotes, search, statusFilter])

  const getQuoteState = (orderStatus) => {
    const status = Number(orderStatus)

    if (status === 2) {
      return {
        label: 'Awaiting Customer',
        className: 'pending'
      }
    }

    if (status === 4) {
      return {
        label: 'Rejected',
        className: 'rejected'
      }
    }

    if (
      status === 3 ||
      status === 5 ||
      status === 6 ||
      status === 7
    ) {
      return {
        label: 'Accepted',
        className: 'accepted'
      }
    }

    return {
      label:
        orderStatusMap[status] ||
        'Unknown',
      className: 'default'
    }
  }

  if (isLoading) {
    return (
      <section className="admin-quotes">
        <div className="admin-quotes-loading">
          Loading quotations...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-quotes">
        <div className="admin-quotes-error">
          <strong>
            Unable to load quotations
          </strong>

          <span>{error}</span>

          <button
            type="button"
            onClick={loadQuotes}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-quotes">
      <div className="admin-quotes-heading">
        <div>
          <span className="admin-quotes-eyebrow">
            Commercial Operations
          </span>

          <h2>Quotes</h2>

          <p>
            Review quotations created for customer
            shipping orders and monitor their current
            status.
          </p>
        </div>

        <button
          type="button"
          className="admin-quotes-refresh"
          onClick={loadQuotes}
        >
          Refresh Quotes
          <span>↻</span>
        </button>
      </div>

      <div className="admin-quotes-stats">
        <article>
          <span>Total Quotes</span>
          <strong>{quoteStats.total}</strong>
          <small>All created quotations</small>
        </article>

        <article>
          <span>Awaiting Customer</span>

          <strong>
            {quoteStats.pendingCustomer}
          </strong>

          <small>
            Waiting for customer decision
          </small>
        </article>

        <article>
          <span>Accepted</span>

          <strong>
            {quoteStats.accepted}
          </strong>

          <small>
            Approved quotations
          </small>
        </article>

        <article>
          <span>Rejected</span>

          <strong>
            {quoteStats.rejected}
          </strong>

          <small>
            Rejected by customers
          </small>
        </article>
      </div>

      <div className="admin-quotes-filters">
        <div className="admin-quotes-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by quote, order, cargo, port or customer ID..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">
            All Quote Statuses
          </option>

          <option value="pending">
            Awaiting Customer
          </option>

          <option value="accepted">
            Accepted
          </option>

          <option value="rejected">
            Rejected
          </option>
        </select>
      </div>

      <div className="admin-quotes-panel">
        <div className="admin-quotes-panel-heading">
          <div>
            <span>
              Customer Quotations
            </span>

            <h3>
              Quote Management
            </h3>
          </div>

          <small>
            Showing {filteredQuotes.length} of{' '}
            {quotes.length}
          </small>
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="admin-quotes-empty">
            <strong>
              No quotations found
            </strong>

            <span>
              There are no quotations matching the
              selected filters.
            </span>
          </div>
        ) : (
          <div className="admin-quotes-list">
            {filteredQuotes.map((quote) => {
              const status =
                Number(
                  quote.shippingOrderStatus
                )

              const quoteState =
                getQuoteState(status)

              return (
                <article
                  className="admin-quote-card"
                  key={quote.id}
                >
                  <div className="admin-quote-card-top">
                    <div>
                      <span>Quote</span>

                      <h3>
                        #{quote.id}
                      </h3>
                    </div>

                    <span
                      className={`admin-quote-state admin-quote-state-${quoteState.className}`}
                    >
                      {quoteState.label}
                    </span>
                  </div>

                  <div className="admin-quote-order">
                    <div>
                      <span>
                        Shipping Order
                      </span>

                      <strong>
                        #{quote.shippingOrderId}
                      </strong>
                    </div>

                    <div className="admin-quote-route">
                      <div>
                        <span>
                          Origin
                        </span>

                        <strong>
                          {quote.originPort || '—'}
                        </strong>
                      </div>

                      <div className="admin-quote-route-line">
                        <span>→</span>
                      </div>

                      <div>
                        <span>
                          Destination
                        </span>

                        <strong>
                          {quote.destinationPort || '—'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="admin-quote-information">
                    <div>
                      <span>
                        Price
                      </span>

                      <strong className="admin-quote-price">
                        {formatMoney(
                          quote.price,
                          quote.currency
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Transit Time
                      </span>

                      <strong>
                        {quote.estimatedTransitDays ??
                          '—'}{' '}
                        days
                      </strong>
                    </div>

                    <div>
                      <span>
                        Valid Until
                      </span>

                      <strong>
                        {formatDate(
                          quote.validUntil
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Cargo
                      </span>

                      <strong>
                        {quote.cargoType || '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-quote-notes">
                    <span>
                      Operator Notes
                    </span>

                    <p>
                      {quote.notes ||
                        'No notes were added to this quotation.'}
                    </p>
                  </div>

                  <div className="admin-quote-footer">
                    <div>
                      <span>
                        Customer ID
                      </span>

                      <strong>
                        {quote.customerId || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Order Status
                      </span>

                      <strong>
                        {orderStatusMap[
                          status
                        ] || 'Unknown'}
                      </strong>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminQuotes