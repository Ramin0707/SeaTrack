import './AdminShipments.css'
import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

const API_URL = 'http://localhost:5080'

const shipmentStatusMap = {
  1: 'Preparing',
  2: 'In Transit',
  3: 'Delivered',
  4: 'Cancelled',
  5: 'Loaded',
  6: 'Departed',
  7: 'Arrived',
  8: 'Unloaded'
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

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function getStatusClass(status) {
  switch (Number(status)) {
    case 1:
      return 'preparing'

    case 2:
      return 'in-transit'

    case 3:
      return 'delivered'

    case 4:
      return 'cancelled'

    case 5:
      return 'loaded'

    case 6:
      return 'departed'

    case 7:
      return 'arrived'

    case 8:
      return 'unloaded'

    default:
      return 'default'
  }
}

function AdminShipments() {
  const [shipments, setShipments] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const loadShipments = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setError(
        'Authorization token was not found. Please log in again.'
      )
      setShipments([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/admin/shipping-orders/shipments`,
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
          'You do not have permission to view shipments.'
        )
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load shipments. Status: ${response.status}`
        )
      }

      const data = await response.json()

      setShipments(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
          'Unable to load shipments.'
      )

      setShipments([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadShipments()
  }, [loadShipments])

  const stats = useMemo(() => {
    return {
      total: shipments.length,

      preparing: shipments.filter(
        (shipment) =>
          Number(
            shipment.status ??
              shipment.shipmentStatus
          ) === 1
      ).length,

      active: shipments.filter((shipment) =>
        [2, 5, 6, 7, 8].includes(
          Number(
            shipment.status ??
              shipment.shipmentStatus
          )
        )
      ).length,

      delivered: shipments.filter(
        (shipment) =>
          Number(
            shipment.status ??
              shipment.shipmentStatus
          ) === 3
      ).length
    }
  }, [shipments])

  const filteredShipments = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase()

    return shipments.filter((shipment) => {
      const shipmentStatus = Number(
        shipment.status ??
          shipment.shipmentStatus
      )

      const matchesSearch =
        !normalizedSearch ||
        String(
          shipment.id ??
            shipment.shipmentId ??
            ''
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(
          shipment.shippingOrderId ?? ''
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(
          shipment.trackingNumber ?? ''
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(
          shipment.originPort ?? ''
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(
          shipment.destinationPort ?? ''
        )
          .toLowerCase()
          .includes(normalizedSearch)

      if (!matchesSearch) {
        return false
      }

      if (statusFilter === 'all') {
        return true
      }

      if (statusFilter === 'active') {
        return [2, 5, 6, 7, 8].includes(
          shipmentStatus
        )
      }

      return (
        shipmentStatus ===
        Number(statusFilter)
      )
    })
  }, [
    shipments,
    search,
    statusFilter
  ])

  if (isLoading) {
    return (
      <section className="admin-shipments">
        <div className="admin-shipments-loading">
          Loading shipments...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-shipments">
        <div className="admin-shipments-error">
          <strong>
            Unable to load shipments
          </strong>

          <span>{error}</span>

          <button
            type="button"
            onClick={loadShipments}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-shipments">
      <div className="admin-shipments-heading">
        <div>
          <span className="admin-shipments-eyebrow">
            Logistics Operations
          </span>

          <h2>Shipments</h2>

          <p>
            Monitor active maritime shipments,
            tracking information and delivery
            progress.
          </p>
        </div>

        <button
          type="button"
          className="admin-shipments-refresh"
          onClick={loadShipments}
        >
          Refresh Shipments
          <span>↻</span>
        </button>
      </div>

      <div className="admin-shipments-stats">
        <article>
          <span>
            Total Shipments
          </span>

          <strong>
            {stats.total}
          </strong>

          <small>
            All created shipments
          </small>
        </article>

        <article>
          <span>
            Preparing
          </span>

          <strong>
            {stats.preparing}
          </strong>

          <small>
            Waiting for operations
          </small>
        </article>

        <article>
          <span>
            Active Shipments
          </span>

          <strong>
            {stats.active}
          </strong>

          <small>
            Currently in operation
          </small>
        </article>

        <article>
          <span>
            Delivered
          </span>

          <strong>
            {stats.delivered}
          </strong>

          <small>
            Completed shipments
          </small>
        </article>
      </div>

      <div className="admin-shipments-filters">
        <div className="admin-shipments-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by shipment, order, tracking number or port..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">
            All Shipment Statuses
          </option>

          <option value="1">
            Preparing
          </option>

          <option value="5">
            Loaded
          </option>

          <option value="6">
            Departed
          </option>

          <option value="2">
            In Transit
          </option>

          <option value="7">
            Arrived
          </option>

          <option value="8">
            Unloaded
          </option>

          <option value="3">
            Delivered
          </option>

          <option value="4">
            Cancelled
          </option>

          <option value="active">
            Active Operations
          </option>
        </select>
      </div>

      <div className="admin-shipments-panel">
        <div className="admin-shipments-panel-heading">
          <div>
            <span>
              Maritime Transportation
            </span>

            <h3>
              Shipment Management
            </h3>
          </div>

          <small>
            Showing {filteredShipments.length} of{' '}
            {shipments.length}
          </small>
        </div>

        {filteredShipments.length === 0 ? (
          <div className="admin-shipments-empty">
            <strong>
              No shipments found
            </strong>

            <span>
              There are no shipments matching the
              selected filters.
            </span>
          </div>
        ) : (
          <div className="admin-shipments-list">
            {filteredShipments.map(
              (shipment) => {
                const shipmentId =
                  shipment.id ??
                  shipment.shipmentId

                const status = Number(
                  shipment.status ??
                    shipment.shipmentStatus
                )

                const shippingOrderStatus =
                  Number(
                    shipment.shippingOrderStatus
                  )

                return (
                  <article
                    className="admin-shipment-card"
                    key={
                      shipmentId ??
                      shipment.trackingNumber
                    }
                  >
                    <div className="admin-shipment-card-top">
                      <div>
                        <span>
                          Shipment
                        </span>

                        <h3>
                          #{shipmentId ?? '—'}
                        </h3>
                      </div>

                      <span
                        className={`admin-shipment-state admin-shipment-state-${getStatusClass(
                          status
                        )}`}
                      >
                        {shipmentStatusMap[
                          status
                        ] || 'Unknown'}
                      </span>
                    </div>

                    <div className="admin-shipment-tracking">
                      <span>
                        Tracking Number
                      </span>

                      <strong>
                        {shipment.trackingNumber ||
                          '—'}
                      </strong>
                    </div>

                    <div className="admin-shipment-main-info">
                      <div>
                        <span>
                          Shipping Order
                        </span>

                        <strong>
                          #
                          {shipment.shippingOrderId ??
                            '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Order Status
                        </span>

                        <strong>
                          {orderStatusMap[
                            shippingOrderStatus
                          ] || '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Created
                        </span>

                        <strong>
                          {formatDateTime(
                            shipment.createdAtUtc
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-shipment-timeline">
                      <div>
                        <span>
                          Loaded
                        </span>

                        <strong>
                          {formatDateTime(
                            shipment.loadedAtUtc
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Departed
                        </span>

                        <strong>
                          {formatDateTime(
                            shipment.departedAtUtc ??
                              shipment.shippedAtUtc
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          In Transit
                        </span>

                        <strong>
                          {formatDateTime(
                            shipment.shippedAtUtc
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Arrived
                        </span>

                        <strong>
                          {formatDateTime(
                            shipment.arrivedAtUtc
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Unloaded
                        </span>

                        <strong>
                          {formatDateTime(
                            shipment.unloadedAtUtc
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Delivered
                        </span>

                        <strong>
                          {formatDateTime(
                            shipment.deliveredAtUtc
                          )}
                        </strong>
                      </div>
                    </div>
                  </article>
                )
              }
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminShipments