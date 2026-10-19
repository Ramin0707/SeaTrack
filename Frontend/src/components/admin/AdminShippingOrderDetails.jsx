import './AdminShippingOrderDetails.css'
import { useCallback, useEffect, useState } from 'react'

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

const containerTypeMap = {
  1: 'Standard',
  2: 'High Cube',
  3: 'Reefer',
  4: 'Open Top',
  5: 'Flat Rack'
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function AdminShippingOrderDetails({ orderId, onBack }) {
  const [order, setOrder] = useState(null)
  const [shipment, setShipment] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isShipmentLoading, setIsShipmentLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  const loadOrder = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setError('Authorization token was not found.')
      return null
    }

    const response = await fetch(
      `${API_URL}/api/admin/shipping-orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(
        `Unable to load shipping order. Status: ${response.status}`
      )
    }

    const data = await response.json()
    setOrder(data)

    return data
  }, [orderId])

  const loadShipment = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setShipment(null)
      return null
    }

    setIsShipmentLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/api/admin/shipping-orders/${orderId}/shipment`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 404) {
        setShipment(null)
        return null
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load shipment. Status: ${response.status}`
        )
      }

      const data = await response.json()
      setShipment(data)

      return data
    } catch (requestError) {
      console.error(requestError)
      setShipment(null)
      return null
    } finally {
      setIsShipmentLoading(false)
    }
  }, [orderId])

  const refreshPageData = useCallback(async () => {
    setError('')
    setActionError('')

    try {
      await Promise.all([
        loadOrder(),
        loadShipment()
      ])
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
        'Unable to load shipping order.'
      )
    }
  }, [loadOrder, loadShipment])

  useEffect(() => {
    let isMounted = true

    const loadInitialData = async () => {
      setIsLoading(true)

      try {
        await refreshPageData()
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadInitialData()

    return () => {
      isMounted = false
    }
  }, [refreshPageData])

  const runShipmentAction = async (
    action,
    successMessage
  ) => {
    const token = getToken()

    if (!token) {
      setActionError(
        'Authorization token was not found. Please log in again.'
      )
      return
    }

    setActionLoading(action)
    setActionError('')
    setActionMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/admin/shipping-orders/${orderId}/shipment/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        let message = `Action failed. Status: ${response.status}`

        try {
          const data = await response.json()

          if (data?.message) {
            message = data.message
          }
        } catch {
          const text = await response.text()

          if (text) {
            message = text
          }
        }

        throw new Error(message)
      }

      setActionMessage(successMessage)

      await Promise.all([
        loadOrder(),
        loadShipment()
      ])
    } catch (requestError) {
      console.error(requestError)

      setActionError(
        requestError.message ||
        'Unable to update shipment.'
      )
    } finally {
      setActionLoading('')
    }
  }

  const createShipment = async () => {
    const token = getToken()

    if (!token) {
      setActionError(
        'Authorization token was not found. Please log in again.'
      )
      return
    }

    setActionLoading('create')
    setActionError('')
    setActionMessage('')

    try {
      const response = await fetch(
        `${API_URL}/api/admin/shipping-orders/${orderId}/shipment`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        let message =
          `Unable to create shipment. Status: ${response.status}`

        try {
          const data = await response.json()

          if (data?.message) {
            message = data.message
          }
        } catch {
          const text = await response.text()

          if (text) {
            message = text
          }
        }

        throw new Error(message)
      }

      setActionMessage(
        'Shipment created successfully.'
      )

      await Promise.all([
        loadOrder(),
        loadShipment()
      ])
    } catch (requestError) {
      console.error(requestError)

      setActionError(
        requestError.message ||
        'Unable to create shipment.'
      )
    } finally {
      setActionLoading('')
    }
  }

  const getNextShipmentAction = () => {
    if (!shipment) {
      return null
    }

    switch (shipment.status) {
      case 1:
        return {
          action: 'load',
          label: 'Mark as Loaded',
          message: 'Shipment marked as Loaded.'
        }

      case 5:
        return {
          action: 'depart',
          label: 'Mark as Departed',
          message: 'Shipment marked as Departed.'
        }

      case 6:
        return {
          action: 'start',
          label: 'Start Transit',
          message: 'Shipment is now In Transit.'
        }

      case 2:
        return {
          action: 'arrive',
          label: 'Mark as Arrived',
          message: 'Shipment marked as Arrived.'
        }

      case 7:
        return {
          action: 'unload',
          label: 'Mark as Unloaded',
          message: 'Shipment marked as Unloaded.'
        }

      case 8:
        return {
          action: 'deliver',
          label: 'Mark as Delivered',
          message: 'Shipment delivered successfully.'
        }

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <section className="admin-order-details">
        <div className="admin-order-details-loading">
          Loading shipping order...
        </div>
      </section>
    )
  }

  if (error || !order) {
    return (
      <section className="admin-order-details">
        <button
          type="button"
          className="admin-order-back-button"
          onClick={onBack}
        >
          ← Back to Shipping Orders
        </button>

        <div className="admin-order-details-error">
          {error || 'Shipping order was not found.'}
        </div>
      </section>
    )
  }

  const orderStatus =
    orderStatusMap[order.status] || 'Unknown'

  const shipmentStatus = shipment
    ? shipmentStatusMap[shipment.status] || 'Unknown'
    : null

  const isAssigned =
    Boolean(order.containerId) &&
    Boolean(order.voyageId)

  const nextShipmentAction =
    getNextShipmentAction()

  return (
    <section className="admin-order-details">
      <div className="admin-order-details-toolbar">
        <button
          type="button"
          className="admin-order-back-button"
          onClick={onBack}
        >
          ← Back to Shipping Orders
        </button>

        <button
          type="button"
          className="admin-order-refresh-button"
          onClick={refreshPageData}
          disabled={
            isShipmentLoading ||
            Boolean(actionLoading)
          }
        >
          Refresh
        </button>
      </div>

      <div className="admin-order-details-heading">
        <div>
          <span className="admin-order-eyebrow">
            Shipping Order
          </span>

          <div className="admin-order-title-row">
            <h2>Order #{order.id}</h2>

            <span
              className={`admin-order-status admin-order-status-${order.status}`}
            >
              {orderStatus}
            </span>
          </div>

          <p>
            Review cargo information, logistics assignment
            and operational shipment status.
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="admin-order-action-message">
          {actionMessage}
        </div>
      )}

      {actionError && (
        <div className="admin-order-action-error">
          {actionError}
        </div>
      )}

      <div className="admin-order-route-card">
        <div>
          <span>Origin Port</span>
          <strong>{order.originPort || '—'}</strong>
        </div>

        <div className="admin-order-route-line">
          <span>→</span>
        </div>

        <div className="admin-order-route-destination">
          <span>Destination Port</span>
          <strong>
            {order.destinationPort || '—'}
          </strong>
        </div>
      </div>

      <div className="admin-order-details-grid">
        <article className="admin-order-card">
          <div className="admin-order-card-title">
            <span className="admin-order-card-number">
              01
            </span>

            <div>
              <small>Order Information</small>
              <h3>Cargo Details</h3>
            </div>
          </div>

          <div className="admin-order-info-grid">
            <div>
              <span>Cargo Type</span>
              <strong>
                {order.cargoType || '—'}
              </strong>
            </div>

            <div>
              <span>Weight</span>
              <strong>
                {order.weight ?? '—'} kg
              </strong>
            </div>

            <div>
              <span>Volume</span>
              <strong>
                {order.volume ?? '—'} m³
              </strong>
            </div>

            <div>
              <span>Requested Container</span>
              <strong>
                {containerTypeMap[order.containerType] ||
                  `Type ${order.containerType}`}
              </strong>
            </div>

            <div>
              <span>Desired Shipping Date</span>
              <strong>
                {formatDate(
                  order.desiredShippingDate
                )}
              </strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {formatDate(order.createdAtUtc)}
              </strong>
            </div>
          </div>
        </article>

        <article className="admin-order-card">
          <div className="admin-order-card-title">
            <span className="admin-order-card-number">
              02
            </span>

            <div>
              <small>Customer</small>
              <h3>Customer Information</h3>
            </div>
          </div>

          <div className="admin-order-customer-box">
            <span>Customer ID</span>
            <strong>
              {order.customerId || '—'}
            </strong>
          </div>

          <p className="admin-order-card-note">
            Customer account information is available
            from the Customers section of the Logistics
            Admin Panel.
          </p>
        </article>

        <article className="admin-order-card">
          <div className="admin-order-card-title">
            <span className="admin-order-card-number">
              03
            </span>

            <div>
              <small>Logistics</small>
              <h3>Operational Assignment</h3>
            </div>
          </div>

          <div className="admin-order-assignment-status">
            <span>Assignment Status</span>

            <strong
              className={
                isAssigned
                  ? 'assigned'
                  : 'not-assigned'
              }
            >
              {isAssigned
                ? 'Assigned'
                : 'Not Assigned'}
            </strong>
          </div>

          <div className="admin-order-info-grid">
            <div>
              <span>Container ID</span>
              <strong>
                {order.containerId ?? 'Not assigned'}
              </strong>
            </div>

            <div>
              <span>Container Number</span>
              <strong>
                {order.containerNumber ||
                  'Not assigned'}
              </strong>
            </div>

            <div>
              <span>Voyage ID</span>
              <strong>
                {order.voyageId ?? 'Not assigned'}
              </strong>
            </div>

            <div>
              <span>Voyage Number</span>
              <strong>
                {order.voyageNumber ||
                  'Not assigned'}
              </strong>
            </div>

            <div>
              <span>Vessel</span>
              <strong>
                {order.vesselName ||
                  'Not assigned'}
              </strong>
            </div>

            <div>
              <span>Route</span>
              <strong>
                {order.routeName ||
                  'Not assigned'}
              </strong>
            </div>
          </div>
        </article>

        <article className="admin-order-card">
          <div className="admin-order-card-title">
            <span className="admin-order-card-number">
              04
            </span>

            <div>
              <small>Workflow</small>
              <h3>Order Status</h3>
            </div>
          </div>

          <div className="admin-order-current-status">
            <span>Current Status</span>
            <strong>{orderStatus}</strong>
          </div>

          <div className="admin-order-workflow">
            <div
              className={
                order.status >= 1
                  ? 'active'
                  : ''
              }
            >
              <span>01</span>
              Awaiting Quote
            </div>

            <div
              className={
                order.status >= 2
                  ? 'active'
                  : ''
              }
            >
              <span>02</span>
              Quote Process
            </div>

            <div
              className={
                order.status >= 5
                  ? 'active'
                  : ''
              }
            >
              <span>03</span>
              Confirmed
            </div>

            <div
              className={
                order.status >= 6
                  ? 'active'
                  : ''
              }
            >
              <span>04</span>
              In Transit
            </div>

            <div
              className={
                order.status >= 7
                  ? 'active'
                  : ''
              }
            >
              <span>05</span>
              Delivered
            </div>
          </div>
        </article>
      </div>

      <article className="admin-order-shipment-card">
        <div className="admin-order-shipment-heading">
          <div>
            <small>Shipment</small>
            <h3>
              {shipment
                ? `Shipment #${shipment.id}`
                : 'No Shipment'}
            </h3>

            <p>
              Tracking and operational shipment
              information.
            </p>
          </div>
        </div>

        {isShipmentLoading ? (
          <div className="admin-order-shipment-empty">
            Loading shipment...
          </div>
        ) : shipment ? (
          <div className="admin-order-shipment-grid">
            <div>
              <span>Tracking Number</span>
              <strong>
                {shipment.trackingNumber || '—'}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong>{shipmentStatus}</strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {formatDate(
                  shipment.createdAtUtc
                )}
              </strong>
            </div>
          </div>
        ) : (
          <div className="admin-order-shipment-empty">
            Shipment has not been created yet.
          </div>
        )}
      </article>

      <article className="admin-order-actions-card">
        <div>
          <small>Operator Actions</small>
          <h3>Manage Order</h3>

          <p>
            Available actions depend on the current
            shipping order and shipment status.
          </p>
        </div>

        <div className="admin-order-actions">
          {!shipment &&
            order.status === 5 &&
            isAssigned && (
              <button
                type="button"
                className="admin-order-primary-action"
                onClick={createShipment}
                disabled={Boolean(actionLoading)}
              >
                {actionLoading === 'create'
                  ? 'Creating...'
                  : 'Create Shipment'}
              </button>
            )}

          {!shipment && !isAssigned && (
            <span className="admin-order-action-hint">
              Assign a container and voyage before
              creating a shipment.
            </span>
          )}

          {shipment && nextShipmentAction && (
            <button
              type="button"
              className="admin-order-primary-action"
              onClick={() =>
                runShipmentAction(
                  nextShipmentAction.action,
                  nextShipmentAction.message
                )
              }
              disabled={Boolean(actionLoading)}
            >
              {actionLoading ===
              nextShipmentAction.action
                ? 'Processing...'
                : nextShipmentAction.label}
            </button>
          )}

          {shipment?.status === 3 && (
            <span className="admin-order-completed-badge">
              Shipment Delivered
            </span>
          )}

          {shipment?.status === 4 && (
            <span className="admin-order-cancelled-badge">
              Shipment Cancelled
            </span>
          )}
        </div>
      </article>
    </section>
  )
}

export default AdminShippingOrderDetails