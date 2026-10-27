import './AdminShippingOrders.css'

import {
  useEffect,
  useMemo,
  useState
} from 'react'


function AdminShippingOrders({
  onViewOrder
}) {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')


  /* =====================================
     TOKEN
  ====================================== */

  const getToken = () => {
    return (
      localStorage.getItem(
        'seatrack_access_token'
      ) ||
      sessionStorage.getItem(
        'seatrack_access_token'
      )
    )
  }


  /* =====================================
     STATUS
  ====================================== */

  const statusMap = {
    1: {
      label: 'Awaiting Quote',
      className: 'awaiting'
    },

    2: {
      label: 'Quote Provided',
      className: 'provided'
    },

    3: {
      label: 'Quote Accepted',
      className: 'accepted'
    },

    4: {
      label: 'Quote Rejected',
      className: 'rejected'
    },

    5: {
      label: 'Confirmed',
      className: 'confirmed'
    },

    6: {
      label: 'In Transit',
      className: 'transit'
    },

    7: {
      label: 'Delivered',
      className: 'delivered'
    },

    8: {
      label: 'Cancelled',
      className: 'cancelled'
    }
  }


  const getStatus = (status) => {
    return (
      statusMap[status] || {
        label: 'Unknown',
        className: 'unknown'
      }
    )
  }


  /* =====================================
     CONTAINER TYPE
  ====================================== */

  const getContainerType = (type) => {
    const containerTypes = {
      1: 'Standard',
      2: 'High Cube',
      3: 'Reefer',
      4: 'Open Top',
      5: 'Flat Rack'
    }

    return (
      containerTypes[type] ||
      `Type ${type}`
    )
  }


  /* =====================================
     DATE
  ====================================== */

  const formatDate = (date) => {
    if (!date) {
      return '—'
    }

    return new Intl.DateTimeFormat(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(new Date(date))
  }


  /* =====================================
     LOAD ORDERS
  ====================================== */

  const loadOrders = async () => {
    setIsLoading(true)
    setError('')

    try {
      const token = getToken()

      if (!token) {
        throw new Error(
          'Authentication token not found.'
        )
      }


      const response = await fetch(
        'https://localhost:44328/api/admin/shipping-orders',
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )


      if (response.status === 401) {
        throw new Error(
          'Your session has expired. Please sign in again.'
        )
      }


      if (response.status === 403) {
        throw new Error(
          'You do not have permission to view shipping orders.'
        )
      }


      if (!response.ok) {
        throw new Error(
          'Unable to load shipping orders.'
        )
      }


      const data =
        await response.json()


      setOrders(
        Array.isArray(data)
          ? data
          : []
      )

    } catch (err) {
      console.error(err)

      setError(
        err.message ||
        'Unable to load shipping orders.'
      )

    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    loadOrders()
  }, [])


  /* =====================================
     STATISTICS
  ====================================== */

  const statistics = useMemo(() => {
    return {
      total: orders.length,

      awaitingQuote:
        orders.filter(
          (order) =>
            order.status === 1
        ).length,

      confirmed:
        orders.filter(
          (order) =>
            order.status === 5
        ).length,

      inTransit:
        orders.filter(
          (order) =>
            order.status === 6
        ).length,

      delivered:
        orders.filter(
          (order) =>
            order.status === 7
        ).length
    }
  }, [orders])


  /* =====================================
     FILTER ORDERS
  ====================================== */

  const filteredOrders = useMemo(() => {
    const normalizedSearch =
      search
        .trim()
        .toLowerCase()


    return orders.filter((order) => {
      const statusMatches =
        statusFilter === 'all' ||
        String(order.status) ===
          statusFilter


      if (!statusMatches) {
        return false
      }


      if (!normalizedSearch) {
        return true
      }


      const searchableValues = [
        order.id,
        order.customerId,
        order.cargoType,
        order.originPort,
        order.destinationPort
      ]


      return searchableValues.some(
        (value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(
              normalizedSearch
            )
      )
    })
  }, [
    orders,
    search,
    statusFilter
  ])


  /* =====================================
     OPEN ORDER
  ====================================== */

  const handleViewOrder = (orderId) => {
    if (onViewOrder) {
      onViewOrder(orderId)
    }
  }


  /* =====================================
     LOADING
  ====================================== */

  if (isLoading) {
    return (
      <section className="admin-orders-state">

        <span>
          SHIPPING OPERATIONS
        </span>

        <h2>
          Loading Shipping Orders...
        </h2>

        <p>
          Retrieving maritime cargo
          orders from SeaTrack.
        </p>

      </section>
    )
  }


  /* =====================================
     ERROR
  ====================================== */

  if (error) {
    return (
      <section className="admin-orders-state error">

        <span>
          SHIPPING OPERATIONS
        </span>

        <h2>
          Unable to load orders
        </h2>

        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={loadOrders}
        >
          Try Again
        </button>

      </section>
    )
  }


  return (
    <div className="admin-orders-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <section className="admin-orders-header">

        <div>

          <span className="admin-orders-label">
            SHIPPING OPERATIONS
          </span>

          <h2>
            Shipping Orders
          </h2>

          <p>
            Review customer cargo requests,
            quotations and current shipping
            order status.
          </p>

        </div>


        <button
          type="button"
          className="admin-orders-refresh"
          onClick={loadOrders}
        >
          Refresh Orders
          <span>↻</span>
        </button>

      </section>


      {/* =====================================
          STATS
      ====================================== */}

      <section className="admin-orders-stats">

        <article>

          <span>
            TOTAL ORDERS
          </span>

          <strong>
            {statistics.total}
          </strong>

          <p>
            All customer orders
          </p>

        </article>


        <article>

          <span>
            AWAITING QUOTE
          </span>

          <strong>
            {statistics.awaitingQuote}
          </strong>

          <p>
            Require operator action
          </p>

        </article>


        <article>

          <span>
            CONFIRMED
          </span>

          <strong>
            {statistics.confirmed}
          </strong>

          <p>
            Ready for operations
          </p>

        </article>


        <article>

          <span>
            IN TRANSIT
          </span>

          <strong>
            {statistics.inTransit}
          </strong>

          <p>
            Active transportation
          </p>

        </article>


        <article>

          <span>
            DELIVERED
          </span>

          <strong>
            {statistics.delivered}
          </strong>

          <p>
            Completed orders
          </p>

        </article>

      </section>


      {/* =====================================
          TOOLBAR
      ====================================== */}

      <section className="admin-orders-toolbar">


        <div className="admin-orders-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by order, cargo, port or customer ID..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
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
            All Statuses
          </option>

          <option value="1">
            Awaiting Quote
          </option>

          <option value="2">
            Quote Provided
          </option>

          <option value="3">
            Quote Accepted
          </option>

          <option value="4">
            Quote Rejected
          </option>

          <option value="5">
            Confirmed
          </option>

          <option value="6">
            In Transit
          </option>

          <option value="7">
            Delivered
          </option>

          <option value="8">
            Cancelled
          </option>

        </select>

      </section>


      {/* =====================================
          ORDERS
      ====================================== */}

      <section className="admin-orders-list">


        <div className="admin-orders-list-header">

          <div>

            <span>
              CUSTOMER ORDERS
            </span>

            <h3>
              Order Management
            </h3>

          </div>


          <p>
            Showing{' '}
            <strong>
              {filteredOrders.length}
            </strong>{' '}
            of{' '}
            <strong>
              {orders.length}
            </strong>
          </p>

        </div>


        {filteredOrders.length === 0 ? (

          <div className="admin-orders-empty">

            <strong>
              No shipping orders found.
            </strong>

            <p>
              Try changing the search
              or status filter.
            </p>

          </div>

        ) : (

          <div className="admin-orders-grid">

            {filteredOrders.map(
              (order) => {

                const status =
                  getStatus(
                    order.status
                  )


                return (
                  <article
                    className="admin-order-card"
                    key={order.id}
                  >


                    {/* CARD TOP */}

                    <div className="admin-order-card-top">


                      <div>

                        <span className="admin-order-number">
                          ORDER
                        </span>

                        <h3>
                          #{order.id}
                        </h3>

                      </div>


                      <span
                        className={
                          `admin-order-status ${status.className}`
                        }
                      >
                        {status.label}
                      </span>

                    </div>


                    {/* ROUTE */}

                    <div className="admin-order-route">

                      <div>

                        <span>
                          ORIGIN
                        </span>

                        <strong>
                          {
                            order.originPort ||
                            '—'
                          }
                        </strong>

                      </div>


                      <div className="admin-order-route-line">

                        <span></span>

                        <strong>
                          →
                        </strong>

                        <span></span>

                      </div>


                      <div>

                        <span>
                          DESTINATION
                        </span>

                        <strong>
                          {
                            order.destinationPort ||
                            '—'
                          }
                        </strong>

                      </div>

                    </div>


                    {/* DETAILS */}

                    <div className="admin-order-details">


                      <div>

                        <span>
                          Cargo Type
                        </span>

                        <strong>
                          {
                            order.cargoType ||
                            '—'
                          }
                        </strong>

                      </div>


                      <div>

                        <span>
                          Weight
                        </span>

                        <strong>
                          {
                            order.weight ??
                            '—'
                          } kg
                        </strong>

                      </div>


                      <div>

                        <span>
                          Volume
                        </span>

                        <strong>
                          {
                            order.volume ??
                            '—'
                          } m³
                        </strong>

                      </div>


                      <div>

                        <span>
                          Container
                        </span>

                        <strong>
                          {
                            getContainerType(
                              order.containerType
                            )
                          }
                        </strong>

                      </div>


                      <div>

                        <span>
                          Shipping Date
                        </span>

                        <strong>
                          {
                            formatDate(
                              order.desiredShippingDate
                            )
                          }
                        </strong>

                      </div>


                      <div>

                        <span>
                          Created
                        </span>

                        <strong>
                          {
                            formatDate(
                              order.createdAtUtc
                            )
                          }
                        </strong>

                      </div>

                    </div>


                    {/* CUSTOMER */}

                    <div className="admin-order-customer">

                      <span>
                        CUSTOMER ID
                      </span>

                      <p>
                        {
                          order.customerId ||
                          '—'
                        }
                      </p>

                    </div>


                    {/* ACTION */}

                    <div className="admin-order-actions">

                      <button
                        type="button"
                        className="admin-order-view"
                        onClick={() =>
                          handleViewOrder(
                            order.id
                          )
                        }
                      >
                        View Order

                        <span>
                          →
                        </span>
                      </button>

                    </div>


                  </article>
                )
              }
            )}

          </div>

        )}

      </section>

    </div>
  )
}


export default AdminShippingOrders