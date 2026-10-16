import './CustomerOrderDetails.css'

import { useEffect, useState } from 'react'


function CustomerOrderDetails({
  orderId,
  onBack
}) {
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')


  const getToken = () => {
    return (
      localStorage.getItem('seatrack_access_token') ||
      sessionStorage.getItem('seatrack_access_token')
    )
  }


  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        return
      }

      setIsLoading(true)
      setError('')

      const token = getToken()

      try {
        const response = await fetch(
          `http://localhost:5080/api/shipping-orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.status === 404) {
          setError('Shipping order was not found.')
          return
        }

        if (!response.ok) {
          setError(
            'Unable to load shipping order.'
          )
          return
        }

        const data = await response.json()

        setOrder(data)

      } catch {
        setError(
          'Unable to connect to SeaTrack.'
        )
      } finally {
        setIsLoading(false)
      }
    }


    loadOrder()

  }, [orderId])


  const getOrderStatus = (status) => {
    const statuses = {
      1: 'Awaiting Quote',
      2: 'Quote Provided',
      3: 'Quote Accepted',
      4: 'Quote Rejected',
      5: 'Confirmed',
      6: 'In Transit',
      7: 'Delivered',
      8: 'Cancelled'
    }

    return statuses[status] || 'Unknown'
  }


  const getStatusClass = (status) => {
    const classes = {
      1: 'awaiting',
      2: 'quote',
      3: 'accepted',
      4: 'rejected',
      5: 'confirmed',
      6: 'transit',
      7: 'delivered',
      8: 'cancelled'
    }

    return classes[status] || ''
  }


  const getContainerType = (type) => {
    const containerTypes = {
      1: 'Standard',
      2: 'High Cube',
      3: 'Refrigerated',
      4: 'Open Top',
      5: 'Flat Rack'
    }

    return (
      containerTypes[type] ||
      `Type ${type}`
    )
  }


  const formatDate = (date) => {
    if (!date) {
      return '—'
    }

    return new Date(date)
      .toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      )
  }


  if (isLoading) {
    return (
      <div className="order-details-loading">
        Loading shipping order...
      </div>
    )
  }


  if (error) {
    return (
      <div className="order-details-error">

        <span>SEATRACK</span>

        <h2>
          Unable to load order
        </h2>

        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={onBack}
        >
          ← Back to My Orders
        </button>

      </div>
    )
  }


  if (!order) {
    return null
  }


  return (
    <section className="order-details">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="order-details-header">

        <div>

          <button
            type="button"
            className="order-details-back"
            onClick={onBack}
          >
            ← Back to My Orders
          </button>


          <span className="order-details-label">
            SHIPPING ORDER
          </span>


          <h2>
            Order #{order.id}
          </h2>


          <p>
            Complete information about your
            maritime shipping request.
          </p>

        </div>


        <div
          className={
            `order-details-status ${
              getStatusClass(order.status)
            }`
          }
        >
          <i></i>

          {getOrderStatus(order.status)}
        </div>

      </div>


      {/* =====================================
          ROUTE
      ====================================== */}

      <div className="order-details-route">

        <div className="order-details-port">

          <span>
            ORIGIN PORT
          </span>

          <strong>
            {order.originPort}
          </strong>

        </div>


        <div className="order-details-route-center">

          <span></span>

          <div>
            <i></i>
          </div>

          <strong>
            →
          </strong>

        </div>


        <div className="order-details-port destination">

          <span>
            DESTINATION PORT
          </span>

          <strong>
            {order.destinationPort}
          </strong>

        </div>

      </div>


      {/* =====================================
          MAIN INFORMATION
      ====================================== */}

      <div className="order-details-grid">

        <article className="order-details-card">

          <span className="order-details-number">
            01
          </span>

          <small>
            CARGO TYPE
          </small>

          <strong>
            {order.cargoType}
          </strong>

          <p>
            Cargo declared for this
            maritime shipping request.
          </p>

        </article>


        <article className="order-details-card">

          <span className="order-details-number">
            02
          </span>

          <small>
            WEIGHT
          </small>

          <strong>
            {order.weight} kg
          </strong>

          <p>
            Total declared cargo weight.
          </p>

        </article>


        <article className="order-details-card">

          <span className="order-details-number">
            03
          </span>

          <small>
            VOLUME
          </small>

          <strong>
            {order.volume} m³
          </strong>

          <p>
            Total declared cargo volume.
          </p>

        </article>


        <article className="order-details-card">

          <span className="order-details-number">
            04
          </span>

          <small>
            CONTAINER
          </small>

          <strong>
            {getContainerType(
              order.containerType
            )}
          </strong>

          <p>
            Requested container type.
          </p>

        </article>

      </div>


      {/* =====================================
          SHIPPING INFORMATION
      ====================================== */}

      <div className="order-details-panel">

        <div className="order-details-panel-header">

          <div>
            <span>
              ORDER INFORMATION
            </span>

            <h3>
              Shipping Details
            </h3>
          </div>

        </div>


        <div className="order-details-information">

          <div>

            <span>
              ORDER ID
            </span>

            <strong>
              #{order.id}
            </strong>

          </div>


          <div>

            <span>
              DESIRED SHIPPING DATE
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
              CREATED
            </span>

            <strong>
              {
                formatDate(
                  order.createdAtUtc
                )
              }
            </strong>

          </div>


          <div>

            <span>
              CURRENT STATUS
            </span>

            <strong className="order-details-status-text">
              {
                getOrderStatus(
                  order.status
                )
              }
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          NEXT ACTION
      ====================================== */}

      <div className="order-details-action">

        <div>

          <span>
            SEATRACK SHIPPING WORKFLOW
          </span>

          <h3>
            Follow the next stage
            of your shipment.
          </h3>

          <p>
            Quotes, payments and shipment
            tracking will appear in your
            customer dashboard as the order
            progresses.
          </p>

        </div>


        <button type="button">
          View Shipment Progress
          <span>→</span>
        </button>

      </div>

    </section>
  )
}


export default CustomerOrderDetails