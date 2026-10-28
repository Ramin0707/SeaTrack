
import { useCallback, useEffect, useState } from 'react'
import './AdminShippingOrderDetails.css'

const API_URL = 'https://localhost:44328'

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

const invoiceStatusMap = {
  1: 'Pending',
  2: 'Paid',
  3: 'Cancelled'
}

function formatInvoiceStatus(status) {
  if (status == null) return '—'

  const label = invoiceStatusMap[status]
  if (label) return label

  return typeof status === 'string'
    ? status
    : `Status #${status}`
}

function getToken() {
  return (
    localStorage.getItem('seatrack_access_token') ||
    sessionStorage.getItem('seatrack_access_token')
  )
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function getShipmentTitle(shipment) {
  if (!shipment) return 'No Shipment'

  const shipmentId =
    shipment.id ??
    shipment.shipmentId ??
    shipment.shipment?.id

  if (
    shipmentId == null ||
    String(shipmentId).trim() === ''
  ) {
    return 'Shipment Details'
  }

  return `Shipment #${shipmentId}`
}

function dateForInput(daysFromToday = 0) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromToday)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function extractItems(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.items)) return data.items
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.invoices)) return data.invoices
  if (Array.isArray(data?.data?.items)) return data.data.items

  return []
}

function apiError(data, fallback) {
  const validation = data?.errors
    ? Object.values(data.errors).flat().join(' ')
    : ''

  return (
    validation ||
    data?.message ||
    data?.detail ||
    data?.title ||
    fallback
  )
}

async function authorizedFetch(path, options = {}) {
  const token = getToken()

  if (!token) {
    throw new Error(
      'Authorization token was not found. Please log in again.'
    )
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers
    }
  })
}

async function checkResponse(response, fallback) {
  if (response.ok) return response

  let message = `${fallback} HTTP ${response.status}.`

  try {
    message = apiError(await response.json(), message)
  } catch {
    // Non-JSON error response.
  }

  throw new Error(message)
}

const fieldStyles = {
  form: {
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '20px',
    marginTop: '12px',
    borderTop: '1px solid rgba(64,195,201,.18)'
  },
  title: {
    margin: 0,
    color: '#fff',
    fontSize: '17px',
    fontWeight: 700
  },
  subtitle: {
    margin: '5px 0 0',
    color: '#91b7c6',
    fontSize: '12px',
    lineHeight: 1.6
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
    gap: '14px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    minWidth: 0
  },
  label: {
    color: '#8fc1cd',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '1.2px',
    textTransform: 'uppercase'
  },
  input: {
    boxSizing: 'border-box',
    width: '100%',
    minWidth: 0,
    padding: '12px 13px',
    color: '#f4fbff',
    background: '#062838',
    border: '1px solid rgba(83,166,184,.28)',
    borderRadius: '7px',
    font: 'inherit',
    fontSize: '13px',
    colorScheme: 'dark'
  },
  hint: {
    color: '#91b7c6',
    fontSize: '11px',
    lineHeight: 1.6,
    margin: 0
  },
  submit: {
    alignSelf: 'flex-start',
    minHeight: '42px',
    padding: '0 20px',
    cursor: 'pointer'
  }
}

function AdminShippingOrderDetails({ orderId, onBack }) {
  const [order, setOrder] = useState(null)
  const [shipment, setShipment] = useState(null)

  const [invoice, setInvoice] = useState(null)
  const [invoiceLoading, setInvoiceLoading] = useState(false)
  const [invoiceChecked, setInvoiceChecked] = useState(false)
  const [invoiceError, setInvoiceError] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isShipmentLoading, setIsShipmentLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState('')

  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  const [quoteForm, setQuoteForm] = useState({
    price: '',
    currency: 'USD',
    estimatedTransitDays: '',
    validUntil: dateForInput(7),
    notes: ''
  })

  const [assignmentForm, setAssignmentForm] = useState({
    containerId: '',
    voyageId: ''
  })

  const [availableContainers, setAvailableContainers] = useState([])
  const [activeVoyages, setActiveVoyages] = useState([])
  const [optionsLoading, setOptionsLoading] = useState(false)
  const [optionsError, setOptionsError] = useState('')

  const updateQuoteField = (field, value) => {
    setQuoteForm(current => ({
      ...current,
      [field]: value
    }))
  }

  const updateAssignmentField = (field, value) => {
    setAssignmentForm(current => ({
      ...current,
      [field]: value
    }))
  }

  // LOAD ORDER

  const loadOrder = useCallback(async () => {
    const response = await authorizedFetch(
      `/api/admin/shipping-orders/${orderId}`
    )

    await checkResponse(
      response,
      'Unable to load shipping order.'
    )

    const data = await response.json()
    setOrder(data)
    return data
  }, [orderId])

  // LOAD SHIPMENT

  const loadShipment = useCallback(async () => {
    setIsShipmentLoading(true)

    try {
      const response = await authorizedFetch(
        `/api/admin/shipping-orders/${orderId}/shipment`
      )

      if (response.status === 404) {
        setShipment(null)
        return null
      }

      await checkResponse(
        response,
        'Unable to load shipment.'
      )

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

  // LOAD EXISTING INVOICE

  const loadInvoice = useCallback(async () => {
    setInvoiceLoading(true)
    setInvoiceChecked(false)
    setInvoiceError('')

    try {
      const response = await authorizedFetch(
        '/api/admin/shipping-orders/invoices'
      )

      await checkResponse(
        response,
        'Unable to check existing invoices.'
      )

      const data = await response.json()

      const existing = extractItems(data).find(
        item =>
          Number(item.shippingOrderId) === Number(orderId)
      ) || null

      setInvoice(existing)
      setInvoiceChecked(true)
      return existing
    } catch (requestError) {
      console.error(requestError)

      setInvoiceError(
        requestError.message ||
        'Unable to check existing invoices.'
      )

      return null
    } finally {
      setInvoiceLoading(false)
    }
  }, [orderId])

  // REFRESH PAGE

  const refreshPageData = useCallback(async () => {
    setError('')
    setActionError('')

    try {
      const currentOrder = await loadOrder()

      if (
        [3, 5, 6, 7].includes(Number(currentOrder.status))
      ) {
        await Promise.all([
          loadShipment(),
          loadInvoice()
        ])
      } else {
        setInvoice(null)
        setInvoiceChecked(false)
        setInvoiceError('')
        await loadShipment()
      }
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
        'Unable to load shipping order.'
      )
    }
  }, [loadOrder, loadShipment, loadInvoice])

  // LOAD CONTAINERS AND VOYAGES

  const loadAssignmentOptions = useCallback(async () => {
    setOptionsLoading(true)
    setOptionsError('')

    try {
      const [containersResponse, voyagesResponse] =
        await Promise.all([
          authorizedFetch('/api/admin/containers'),
          authorizedFetch('/api/admin/voyages')
        ])

      await checkResponse(
        containersResponse,
        'Unable to load containers.'
      )

      await checkResponse(
        voyagesResponse,
        'Unable to load voyages.'
      )

      const [containersData, voyagesData] =
        await Promise.all([
          containersResponse.json(),
          voyagesResponse.json()
        ])

      setAvailableContainers(
        extractItems(containersData).filter(container => {
          const available =
            Number(container.status) === 1 ||
            String(container.status).toLowerCase() === 'available'

          return container.isActive !== false && available
        })
      )

      setActiveVoyages(
        extractItems(voyagesData).filter(
          voyage => voyage.isActive !== false
        )
      )
    } catch (requestError) {
      console.error(requestError)

      setOptionsError(
        requestError.message ||
        'Unable to load assignment options.'
      )
    } finally {
      setOptionsLoading(false)
    }
  }, [])

  // INITIAL DATA

  useEffect(() => {
    let active = true
    setIsLoading(true)

    refreshPageData().finally(() => {
      if (active) setIsLoading(false)
    })

    return () => {
      active = false
    }
  }, [refreshPageData])

  useEffect(() => {
    if (
      order?.status === 5 &&
      (!order.containerId || !order.voyageId) &&
      !shipment
    ) {
      loadAssignmentOptions()
    }
  }, [
    order?.status,
    order?.containerId,
    order?.voyageId,
    shipment,
    loadAssignmentOptions
  ])

  // CREATE QUOTE

  const createQuote = async event => {
    event.preventDefault()

    if (order?.status !== 1 || actionLoading) return

    setActionError('')
    setActionMessage('')

    const price = Number(quoteForm.price)
    const estimatedTransitDays =
      Number(quoteForm.estimatedTransitDays)

    const validUntil = new Date(
      `${quoteForm.validUntil}T23:59:59`
    )

    if (!Number.isFinite(price) || price <= 0) {
      setActionError(
        'Enter a quotation price greater than zero.'
      )
      return
    }

    if (
      !Number.isInteger(estimatedTransitDays) ||
      estimatedTransitDays < 1 ||
      estimatedTransitDays > 365
    ) {
      setActionError(
        'Transit time must be between 1 and 365 days.'
      )
      return
    }

    if (
      !quoteForm.validUntil ||
      Number.isNaN(validUntil.getTime()) ||
      validUntil.getTime() <= Date.now()
    ) {
      setActionError(
        'Choose a quotation validity date in the future.'
      )
      return
    }

    setActionLoading('quote')

    try {
      const response = await authorizedFetch(
        `/api/admin/shipping-orders/${orderId}/quote`,
        {
          method: 'POST',
          body: JSON.stringify({
            price,
            currency: quoteForm.currency,
            estimatedTransitDays,
            validUntil: validUntil.toISOString(),
            notes: quoteForm.notes.trim() || null
          })
        }
      )

      await checkResponse(
        response,
        'Unable to create quotation.'
      )

      setActionMessage(
        'Quotation created successfully. The customer can review it in Quotes.'
      )

      await loadOrder()
    } catch (requestError) {
      console.error(requestError)

      setActionError(
        requestError.message ||
        'Unable to create quotation.'
      )
    } finally {
      setActionLoading('')
    }
  }

  // CREATE INVOICE

  const createInvoice = async () => {
    if (
      order?.status !== 3 ||
      actionLoading ||
      invoice ||
      !invoiceChecked
    ) {
      return
    }

    setActionLoading('invoice')
    setActionError('')
    setActionMessage('')

    try {
      const response = await authorizedFetch(
        `/api/admin/shipping-orders/${orderId}/invoice`,
        { method: 'POST' }
      )

      await checkResponse(
        response,
        'Unable to create invoice.'
      )

      const created = await response.json().catch(() => null)

      if (
        created &&
        typeof created === 'object' &&
        created.id != null
      ) {
        setInvoice(created)
        setInvoiceChecked(true)
        setInvoiceError('')
      } else {
        await loadInvoice()
      }

      setActionMessage(
        'Invoice created successfully. The customer can now view it in Invoices.'
      )
    } catch (requestError) {
      console.error(requestError)

      setActionError(
        requestError.message ||
        'Unable to create invoice.'
      )

      await loadInvoice()
    } finally {
      setActionLoading('')
    }
  }

  // ASSIGN CONTAINER AND VOYAGE

  const assignOrder = async event => {
    event.preventDefault()

    if (
      order?.status !== 5 ||
      shipment ||
      actionLoading
    ) {
      return
    }

    const containerId = Number(assignmentForm.containerId)
    const voyageId = Number(assignmentForm.voyageId)

    if (
      !Number.isInteger(containerId) ||
      containerId <= 0 ||
      !Number.isInteger(voyageId) ||
      voyageId <= 0
    ) {
      setActionError(
        'Select a container and a voyage.'
      )
      return
    }

    const validContainer = availableContainers.some(
      container => Number(container.id) === containerId
    )

    const validVoyage = activeVoyages.some(
      voyage => Number(voyage.id) === voyageId
    )

    if (!validContainer || !validVoyage) {
      setActionError(
        'Choose an available container and an active voyage.'
      )
      return
    }

    setActionLoading('assignment')
    setActionError('')
    setActionMessage('')

    try {
      const response = await authorizedFetch(
        `/api/admin/shipping-orders/${orderId}/assignment`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            containerId,
            voyageId
          })
        }
      )

      await checkResponse(
        response,
        'Unable to assign container and voyage.'
      )

      setActionMessage(
        'Container and voyage assigned. You can now create a shipment.'
      )

      await loadOrder()
    } catch (requestError) {
      console.error(requestError)

      setActionError(
        requestError.message ||
        'Unable to assign container and voyage.'
      )
    } finally {
      setActionLoading('')
    }
  }

  // CREATE SHIPMENT

  const createShipment = async () => {
    if (actionLoading) return

    setActionLoading('create')
    setActionError('')
    setActionMessage('')

    try {
      const response = await authorizedFetch(
        `/api/admin/shipping-orders/${orderId}/shipment`,
        { method: 'POST' }
      )

      await checkResponse(
        response,
        'Unable to create shipment.'
      )

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

  // SHIPMENT STATUS ACTION

  const runShipmentAction = async (
    action,
    successMessage
  ) => {
    if (actionLoading) return

    setActionLoading(action)
    setActionError('')
    setActionMessage('')

    try {
      const response = await authorizedFetch(
        `/api/admin/shipping-orders/${orderId}/shipment/${action}`,
        { method: 'PATCH' }
      )

      await checkResponse(
        response,
        'Unable to update shipment.'
      )

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

  // LOADING

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

  const isAssigned =
    Boolean(order.containerId) &&
    Boolean(order.voyageId)

  const shipmentActions = {
    1: [
      'load',
      'Mark as Loaded',
      'Shipment marked as Loaded.'
    ],
    5: [
      'depart',
      'Mark as Departed',
      'Shipment marked as Departed.'
    ],
    6: [
      'start',
      'Start Transit',
      'Shipment is now In Transit.'
    ],
    2: [
      'arrive',
      'Mark as Arrived',
      'Shipment marked as Arrived.'
    ],
    7: [
      'unload',
      'Mark as Unloaded',
      'Shipment marked as Unloaded.'
    ],
    8: [
      'deliver',
      'Mark as Delivered',
      'Shipment delivered successfully.'
    ]
  }

  const nextShipmentAction = shipment
    ? shipmentActions[shipment.status]
    : null

  // RENDER

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
              {orderStatusMap[order.status] || 'Unknown'}
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
          <strong>{order.destinationPort || '—'}</strong>
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
              <strong>{order.cargoType || '—'}</strong>
            </div>

            <div>
              <span>Weight</span>
              <strong>{order.weight ?? '—'} kg</strong>
            </div>

            <div>
              <span>Volume</span>
              <strong>{order.volume ?? '—'} m³</strong>
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
                {formatDate(order.desiredShippingDate)}
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
            <strong>{order.customerId || '—'}</strong>
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
                isAssigned ? 'assigned' : 'not-assigned'
              }
            >
              {isAssigned ? 'Assigned' : 'Not Assigned'}
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
                {order.containerNumber || 'Not assigned'}
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
                {order.voyageNumber || 'Not assigned'}
              </strong>
            </div>

            <div>
              <span>Vessel</span>
              <strong>
                {order.vesselName || 'Not assigned'}
              </strong>
            </div>

            <div>
              <span>Route</span>
              <strong>
                {order.routeName || 'Not assigned'}
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
            <strong>
              {orderStatusMap[order.status] || 'Unknown'}
            </strong>
          </div>

          <div className="admin-order-workflow">
            {[
              [1, 'Awaiting Quote'],
              [2, 'Quote Process'],
              [5, 'Confirmed'],
              [6, 'In Transit'],
              [7, 'Delivered']
            ].map(([status, label], index) => (
              <div
                key={status}
                className={
                  order.status >= status &&
                  order.status !== 8
                    ? 'active'
                    : ''
                }
              >
                <span>
                  {String(index + 1).padStart(2, '0')}
                </span>

                {label}
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="admin-order-shipment-card">
        <div className="admin-order-shipment-heading">
          <div>
            <small>Shipment</small>

            <h3>
              {getShipmentTitle(shipment)}
            </h3>

            <p>
              Tracking and operational shipment information.
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
              <strong>
                {shipmentStatusMap[shipment.status] ||
                  'Unknown'}
              </strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {formatDate(shipment.createdAtUtc)}
              </strong>
            </div>
          </div>
        ) : (
          <div className="admin-order-shipment-empty">
            Shipment has not been created yet.
          </div>
        )}
      </article>

      <article
        className="admin-order-actions-card"
        style={
          order.status === 1 ||
          order.status === 3 ||
          (order.status === 5 && !isAssigned)
            ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                gap: '12px'
              }
            : undefined
        }
      >
        <div>
          <small>Operator Actions</small>
          <h3>Manage Order</h3>

          <p>
            Available actions depend on the current
            shipping order and shipment status.
          </p>
        </div>

        {/* CREATE QUOTE */}

        {order.status === 1 && (
          <form
            onSubmit={createQuote}
            style={fieldStyles.form}
          >
            <div>
              <h4 style={fieldStyles.title}>
                Create Quote
              </h4>

              <p style={fieldStyles.subtitle}>
                Prepare a quotation for this shipping
                request. The customer can accept or reject it.
              </p>
            </div>

            <div style={fieldStyles.grid}>
              <label style={fieldStyles.field}>
                <span style={fieldStyles.label}>
                  Price *
                </span>

                <input
                  style={fieldStyles.input}
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="3200.00"
                  value={quoteForm.price}
                  onChange={event =>
                    updateQuoteField(
                      'price',
                      event.target.value
                    )
                  }
                  required
                  disabled={Boolean(actionLoading)}
                />
              </label>

              <label style={fieldStyles.field}>
                <span style={fieldStyles.label}>
                  Currency *
                </span>

                <select
                  style={fieldStyles.input}
                  value={quoteForm.currency}
                  onChange={event =>
                    updateQuoteField(
                      'currency',
                      event.target.value
                    )
                  }
                  disabled={Boolean(actionLoading)}
                >
                  <option value="USD">
                    USD — US Dollar
                  </option>
                  <option value="EUR">
                    EUR — Euro
                  </option>
                  <option value="AZN">
                    AZN — Manat
                  </option>
                </select>
              </label>

              <label style={fieldStyles.field}>
                <span style={fieldStyles.label}>
                  Transit Time (Days) *
                </span>

                <input
                  style={fieldStyles.input}
                  type="number"
                  min="1"
                  max="365"
                  step="1"
                  placeholder="4"
                  value={quoteForm.estimatedTransitDays}
                  onChange={event =>
                    updateQuoteField(
                      'estimatedTransitDays',
                      event.target.value
                    )
                  }
                  required
                  disabled={Boolean(actionLoading)}
                />
              </label>

              <label style={fieldStyles.field}>
                <span style={fieldStyles.label}>
                  Valid Until *
                </span>

                <input
                  style={fieldStyles.input}
                  type="date"
                  min={dateForInput()}
                  value={quoteForm.validUntil}
                  onChange={event =>
                    updateQuoteField(
                      'validUntil',
                      event.target.value
                    )
                  }
                  required
                  disabled={Boolean(actionLoading)}
                />
              </label>
            </div>

            <label style={fieldStyles.field}>
              <span style={fieldStyles.label}>
                Operator Notes
              </span>

              <textarea
                style={{
                  ...fieldStyles.input,
                  minHeight: '90px',
                  resize: 'vertical'
                }}
                rows={3}
                placeholder="Optional information about this quotation..."
                value={quoteForm.notes}
                onChange={event =>
                  updateQuoteField(
                    'notes',
                    event.target.value
                  )
                }
                disabled={Boolean(actionLoading)}
              />
            </label>

            <p style={fieldStyles.hint}>
              The quotation will be submitted for
              Order #{order.id}. Check the price and
              validity date before sending.
            </p>

            <button
              type="submit"
              className="admin-order-primary-action"
              style={fieldStyles.submit}
              disabled={Boolean(actionLoading)}
            >
              {actionLoading === 'quote'
                ? 'Creating Quote...'
                : 'Create Quote →'}
            </button>
          </form>
        )}

        {/* QUOTE PROVIDED */}

        {order.status === 2 && (
          <p style={fieldStyles.hint}>
            A quotation has been created.
            The customer can review it in the Quotes section.
          </p>
        )}

        {/* QUOTE ACCEPTED + CREATE INVOICE */}

        {order.status === 3 && (
          <div style={fieldStyles.form}>
            <h4 style={fieldStyles.title}>
              Quote Accepted
            </h4>

            <p style={fieldStyles.subtitle}>
              {invoice
                ? 'The customer accepted the quotation. An invoice has been created.'
                : 'The customer accepted the quotation. Create an invoice for this order.'}
              {' '}After payment is completed, the order can proceed
              to logistics assignment.
            </p>

            {invoiceLoading && (
              <p style={fieldStyles.hint}>
                Checking existing invoices...
              </p>
            )}

            {invoiceError && (
              <p
                style={{
                  ...fieldStyles.hint,
                  color: '#ff9a9a'
                }}
              >
                {invoiceError} Use Refresh to retry.
                Invoice creation is disabled until the
                check succeeds.
              </p>
            )}

            {!invoice && invoiceChecked && !invoiceLoading && (
              <button
                type="button"
                className="admin-order-primary-action"
                style={fieldStyles.submit}
                onClick={createInvoice}
                disabled={Boolean(actionLoading)}
              >
                {actionLoading === 'invoice'
                  ? 'Creating Invoice...'
                  : 'Create Invoice →'}
              </button>
            )}
          </div>
        )}

        {/* EXISTING INVOICE DETAILS */}

        {invoice &&
          [3, 5, 6, 7].includes(Number(order.status)) && (
            <div style={fieldStyles.form}>
              <h4 style={fieldStyles.title}>
                Invoice Created
              </h4>

              <div style={fieldStyles.grid}>
                <div style={fieldStyles.field}>
                  <span style={fieldStyles.label}>
                    Invoice Number
                  </span>

                  <strong style={{ color: '#fff' }}>
                    {invoice.invoiceNumber || `#${invoice.id}`}
                  </strong>
                </div>

                <div style={fieldStyles.field}>
                  <span style={fieldStyles.label}>
                    Amount
                  </span>

                  <strong style={{ color: '#fff' }}>
                    {invoice.amount != null &&
                    Number.isFinite(Number(invoice.amount))
                      ? Number(invoice.amount).toLocaleString(
                          'en-US',
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )
                      : '—'}{' '}
                    {invoice.currency || ''}
                  </strong>
                </div>

                <div style={fieldStyles.field}>
                  <span style={fieldStyles.label}>
                    Issued
                  </span>

                  <strong style={{ color: '#fff' }}>
                    {formatDate(invoice.issuedAtUtc)}
                  </strong>
                </div>

                <div style={fieldStyles.field}>
                  <span style={fieldStyles.label}>
                    Due Date
                  </span>

                  <strong style={{ color: '#fff' }}>
                    {formatDate(invoice.dueDateUtc)}
                  </strong>
                </div>

                <div style={fieldStyles.field}>
                  <span style={fieldStyles.label}>
                    Status
                  </span>

                  <strong style={{ color: '#fff' }}>
                    {formatInvoiceStatus(invoice.status)}
                  </strong>
                </div>
              </div>

              <p style={fieldStyles.hint}>
                Invoice already exists for this shipping order.
                A duplicate cannot be created here.
              </p>
            </div>
          )}

        {/* ASSIGN CONTAINER AND VOYAGE */}

        {order.status === 5 &&
          !isAssigned &&
          !shipment && (
            <form
              onSubmit={assignOrder}
              style={fieldStyles.form}
            >
              <div>
                <h4 style={fieldStyles.title}>
                  Assign Container &amp; Voyage
                </h4>

                <p style={fieldStyles.subtitle}>
                  Choose an available container and
                  an active voyage for Order #{order.id}.
                </p>
              </div>

              {optionsError && (
                <p
                  style={{
                    ...fieldStyles.hint,
                    color: '#ff9a9a'
                  }}
                >
                  {optionsError}
                </p>
              )}

              <div style={fieldStyles.grid}>
                <label style={fieldStyles.field}>
                  <span style={fieldStyles.label}>
                    Available Container *
                  </span>

                  <select
                    style={fieldStyles.input}
                    value={assignmentForm.containerId}
                    onChange={event =>
                      updateAssignmentField(
                        'containerId',
                        event.target.value
                      )
                    }
                    required
                    disabled={
                      optionsLoading ||
                      Boolean(actionLoading)
                    }
                  >
                    <option value="">
                      {optionsLoading
                        ? 'Loading containers...'
                        : 'Select container'}
                    </option>

                    {availableContainers.map(container => (
                      <option
                        key={container.id}
                        value={container.id}
                      >
                        {container.containerNumber ||
                          container.number ||
                          `Container #${container.id}`}

                        {containerTypeMap[container.containerType]
                          ? ` — ${containerTypeMap[container.containerType]}`
                          : ''}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={fieldStyles.field}>
                  <span style={fieldStyles.label}>
                    Active Voyage *
                  </span>

                  <select
                    style={fieldStyles.input}
                    value={assignmentForm.voyageId}
                    onChange={event =>
                      updateAssignmentField(
                        'voyageId',
                        event.target.value
                      )
                    }
                    required
                    disabled={
                      optionsLoading ||
                      Boolean(actionLoading)
                    }
                  >
                    <option value="">
                      {optionsLoading
                        ? 'Loading voyages...'
                        : 'Select voyage'}
                    </option>

                    {activeVoyages.map(voyage => (
                      <option
                        key={voyage.id}
                        value={voyage.id}
                      >
                        {voyage.voyageNumber ||
                          `Voyage #${voyage.id}`}

                        {voyage.vesselName
                          ? ` — ${voyage.vesselName}`
                          : ''}

                        {voyage.routeName
                          ? ` — ${voyage.routeName}`
                          : ''}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {!optionsLoading &&
                availableContainers.length === 0 && (
                  <p style={fieldStyles.hint}>
                    No available containers.
                    Check the Containers section.
                  </p>
                )}

              {!optionsLoading &&
                activeVoyages.length === 0 && (
                  <p style={fieldStyles.hint}>
                    No active voyages.
                    Check Routes &amp; Voyages.
                  </p>
                )}

              <button
                type="submit"
                className="admin-order-primary-action"
                style={fieldStyles.submit}
                disabled={
                  Boolean(actionLoading) ||
                  optionsLoading ||
                  !assignmentForm.containerId ||
                  !assignmentForm.voyageId
                }
              >
                {actionLoading === 'assignment'
                  ? 'Assigning...'
                  : 'Assign Container & Voyage →'}
              </button>
            </form>
          )}

        {/* SHIPMENT ACTIONS */}

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

          {shipment && nextShipmentAction && (
            <button
              type="button"
              className="admin-order-primary-action"
              onClick={() =>
                runShipmentAction(
                  nextShipmentAction[0],
                  nextShipmentAction[2]
                )
              }
              disabled={Boolean(actionLoading)}
            >
              {actionLoading === nextShipmentAction[0]
                ? 'Processing...'
                : nextShipmentAction[1]}
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
