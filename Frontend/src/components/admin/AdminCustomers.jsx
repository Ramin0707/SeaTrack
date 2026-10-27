import './AdminCustomers.css'

import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

const API_URL = 'https://localhost:44328'

function getToken() {
  return (
    localStorage.getItem('seatrack_access_token') ||
    sessionStorage.getItem('seatrack_access_token')
  )
}

function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const loadCustomers = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setError(
        'Authorization token was not found. Please log in again.'
      )

      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/admin/customers`,
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
          'You do not have permission to view customers.'
        )
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load customers. Status: ${response.status}`
        )
      }

      const data = await response.json()

      setCustomers(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
          'Unable to load customers.'
      )

      setCustomers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  const filteredCustomers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    return customers.filter((customer) => {
      const matchesSearch =
        !normalizedSearch ||
        String(customer.id ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(customer.fullName ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(customer.email ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(customer.phoneNumber ?? '')
          .toLowerCase()
          .includes(normalizedSearch)

      if (!matchesSearch) {
        return false
      }

      if (statusFilter === 'confirmed') {
        return customer.emailConfirmed === true
      }

      if (statusFilter === 'unconfirmed') {
        return customer.emailConfirmed === false
      }

      return true
    })
  }, [
    customers,
    search,
    statusFilter
  ])

  const stats = useMemo(() => {
    const confirmed =
      customers.filter(
        (customer) =>
          customer.emailConfirmed === true
      ).length

    const unconfirmed =
      customers.filter(
        (customer) =>
          customer.emailConfirmed === false
      ).length

    const withPhone =
      customers.filter(
        (customer) =>
          Boolean(
            customer.phoneNumber
          )
      ).length

    return {
      total: customers.length,
      confirmed,
      unconfirmed,
      withPhone
    }
  }, [customers])

  if (isLoading) {
    return (
      <section className="admin-customers">
        <div className="admin-customers-loading">
          Loading customers...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-customers">
        <div className="admin-customers-error">
          <strong>
            Unable to load customers
          </strong>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadCustomers}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-customers">
      <div className="admin-customers-heading">
        <div>
          <span className="admin-customers-eyebrow">
            Customer Operations
          </span>

          <h2>
            Customers
          </h2>

          <p>
            Review registered SeaTrack customers
            and manage customer account
            information.
          </p>
        </div>

        <button
          type="button"
          className="admin-customers-refresh"
          onClick={loadCustomers}
        >
          Refresh Customers

          <span>
            ↻
          </span>
        </button>
      </div>

      <div className="admin-customers-stats">
        <article>
          <span>
            Total Customers
          </span>

          <strong>
            {stats.total}
          </strong>

          <small>
            Registered customer accounts
          </small>
        </article>

        <article>
          <span>
            Confirmed
          </span>

          <strong>
            {stats.confirmed}
          </strong>

          <small>
            Email confirmed accounts
          </small>
        </article>

        <article>
          <span>
            Unconfirmed
          </span>

          <strong>
            {stats.unconfirmed}
          </strong>

          <small>
            Awaiting email confirmation
          </small>
        </article>

        <article>
          <span>
            With Phone
          </span>

          <strong>
            {stats.withPhone}
          </strong>

          <small>
            Accounts with phone number
          </small>
        </article>
      </div>

      <div className="admin-customers-filters">
        <div className="admin-customers-search">
          <span>
            ⌕
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by customer name, email, phone or ID..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="all">
            All Customers
          </option>

          <option value="confirmed">
            Confirmed
          </option>

          <option value="unconfirmed">
            Unconfirmed
          </option>
        </select>
      </div>

      <div className="admin-customers-panel">
        <div className="admin-customers-panel-heading">
          <div>
            <span>
              Customer Directory
            </span>

            <h3>
              Customer Management
            </h3>
          </div>

          <small>
            Showing {filteredCustomers.length} of{' '}
            {customers.length}
          </small>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="admin-customers-empty">
            <strong>
              No customers found
            </strong>

            <span>
              There are no customers matching
              the selected filters.
            </span>
          </div>
        ) : (
          <div className="admin-customers-list">
            {filteredCustomers.map(
              (customer) => (
                <article
                  className="admin-customer-card"
                  key={customer.id}
                >
                  <div className="admin-customer-card-top">
                    <div className="admin-customer-identity">
                      <div className="admin-customer-avatar">
                        {customer.fullName
                          ? customer.fullName
                              .split(' ')
                              .filter(Boolean)
                              .slice(0, 2)
                              .map(
                                (part) =>
                                  part[0]
                              )
                              .join('')
                              .toUpperCase()
                          : 'CU'}
                      </div>

                      <div>
                        <span>
                          Customer
                        </span>

                        <h3>
                          {customer.fullName ||
                            'SeaTrack Customer'}
                        </h3>
                      </div>
                    </div>

                    <span
                      className={
                        customer.emailConfirmed
                          ? 'admin-customer-status confirmed'
                          : 'admin-customer-status unconfirmed'
                      }
                    >
                      {customer.emailConfirmed
                        ? 'Confirmed'
                        : 'Unconfirmed'}
                    </span>
                  </div>

                  <div className="admin-customer-contact">
                    <div>
                      <span>
                        Email Address
                      </span>

                      <strong>
                        {customer.email ||
                          '—'}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Phone Number
                      </span>

                      <strong>
                        {customer.phoneNumber ||
                          '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="admin-customer-details">
                    <div>
                      <span>
                        Customer ID
                      </span>

                      <strong>
                        {customer.id || '—'}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Email Status
                      </span>

                      <strong>
                        {customer.emailConfirmed
                          ? 'Verified'
                          : 'Not Verified'}
                      </strong>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminCustomers