import './CustomerShipments.css'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


function CustomerShipments({
  orders = []
}) {
  const navigate = useNavigate()

  const [shipments, setShipments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')


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
     SHIPMENT STATUS
  ====================================== */

  const getShipmentStatus = (status) => {
    const statuses = {
      1: 'Preparing',
      2: 'In Transit',
      3: 'Delivered',
      4: 'Cancelled',
      5: 'Loaded',
      6: 'Departed',
      7: 'Arrived',
      8: 'Unloaded'
    }

    return statuses[status] || 'Unknown'
  }


  const getStatusClass = (status) => {
    const classes = {
      1: 'preparing',
      2: 'transit',
      3: 'delivered',
      4: 'cancelled',
      5: 'loaded',
      6: 'departed',
      7: 'arrived',
      8: 'unloaded'
    }

    return classes[status] || ''
  }


  /* =====================================
     FORMAT DATE
  ====================================== */

  const formatDate = (date) => {
    if (!date) {
      return '—'
    }

    return new Date(date).toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    )
  }


  /* =====================================
     LOAD SHIPMENTS
  ====================================== */

  const loadShipments = async () => {
    const token = getToken()

    if (!token) {
      setError(
        'Your session has expired. Please sign in again.'
      )

      setIsLoading(false)

      return
    }


    setIsLoading(true)
    setError('')


    try {
      const results = await Promise.all(
        orders.map(async (order) => {
          try {
            const response = await fetch(
              `http://localhost:5080/api/shipping-orders/${order.id}/shipment`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )


            if (
              response.status === 404 ||
              response.status === 400
            ) {
              return null
            }


            if (response.status === 401) {
              throw new Error(
                'SESSION_EXPIRED'
              )
            }


            if (!response.ok) {
              return null
            }


            const shipment =
              await response.json()


            return {
              ...shipment,

              orderId: order.id,
              cargoType: order.cargoType,
              originPort: order.originPort,
              destinationPort:
                order.destinationPort
            }

          } catch (requestError) {

            if (
              requestError.message ===
              'SESSION_EXPIRED'
            ) {
              throw requestError
            }

            return null
          }
        })
      )


      const availableShipments =
        results
          .filter(Boolean)
          .sort(
            (a, b) =>
              new Date(b.createdAtUtc) -
              new Date(a.createdAtUtc)
          )


      setShipments(
        availableShipments
      )

    } catch (loadError) {

      if (
        loadError.message ===
        'SESSION_EXPIRED'
      ) {
        setError(
          'Your session has expired. Please sign in again.'
        )
      } else {
        setError(
          'Unable to load shipments.'
        )
      }

    } finally {

      setIsLoading(false)

    }
  }


  useEffect(() => {
    loadShipments()
  }, [orders])


  /* =====================================
     COUNTERS
  ====================================== */

  const activeCount =
    shipments.filter(
      (shipment) =>
        shipment.status !== 3 &&
        shipment.status !== 4
    ).length


  const deliveredCount =
    shipments.filter(
      (shipment) =>
        shipment.status === 3
    ).length


  const cancelledCount =
    shipments.filter(
      (shipment) =>
        shipment.status === 4
    ).length


  /* =====================================
     TIMELINE
  ====================================== */

  const getTimeline = (shipment) => {
    return [
      {
        label: 'Created',
        date: shipment.createdAtUtc
      },
      {
        label: 'Loaded',
        date: shipment.loadedAtUtc
      },
      {
        label: 'Shipped',
        date: shipment.shippedAtUtc
      },
      {
        label: 'Arrived',
        date: shipment.arrivedAtUtc
      },
      {
        label: 'Unloaded',
        date: shipment.unloadedAtUtc
      },
      {
        label: 'Delivered',
        date: shipment.deliveredAtUtc
      }
    ]
  }


  /* =====================================
     TRACK
  ====================================== */

  const handleTrackShipment =
    (trackingNumber) => {

      navigate(
        `/tracking?trackingNumber=${encodeURIComponent(
          trackingNumber
        )}`
      )
    }


  /* =====================================
     RENDER
  ====================================== */

  return (
    <section className="customer-shipments">


      {/* HEADER */}

      <div className="customer-shipments-header">

        <div>

          <span className="customer-shipments-label">
            MARITIME SHIPMENTS
          </span>


          <h2>
            Shipments
          </h2>


          <p>
            Follow your active and completed
            shipments, tracking numbers and
            cargo journey timeline.
          </p>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="customer-shipments-summary">


        <div>

          <span>
            TOTAL SHIPMENTS
          </span>

          <strong>
            {shipments.length}
          </strong>

        </div>


        <div>

          <span>
            ACTIVE
          </span>

          <strong>
            {activeCount}
          </strong>

        </div>


        <div>

          <span>
            DELIVERED
          </span>

          <strong>
            {deliveredCount}
          </strong>

        </div>


        <div>

          <span>
            CANCELLED
          </span>

          <strong>
            {cancelledCount}
          </strong>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="customer-shipments-error">
          {error}
        </div>

      )}


      {/* CONTENT */}

      {isLoading ? (

        <div className="customer-shipments-loading">
          Loading shipments...
        </div>

      ) : shipments.length === 0 ? (

        <div className="customer-shipments-empty">

          <span>
            SHIPMENTS
          </span>


          <h3>
            No shipments yet
          </h3>


          <p>
            Shipment information will appear
            here after your confirmed order is
            assigned and processed by SeaTrack.
          </p>

        </div>

      ) : (

        <div className="customer-shipments-list">


          {shipments.map(
            (shipment) => (

              <article
                className="customer-shipment-card"
                key={shipment.shipmentId}
              >


                {/* TOP */}

                <div className="customer-shipment-top">


                  <div>

                    <span>
                      SHIPMENT
                    </span>

                    <h3>
                      #{shipment.shipmentId}
                    </h3>

                    <small>
                      Order #{shipment.orderId}
                    </small>

                  </div>


                  <div
                    className={
                      `customer-shipment-status ${
                        getStatusClass(
                          shipment.status
                        )
                      }`
                    }
                  >

                    <i></i>

                    {
                      getShipmentStatus(
                        shipment.status
                      )
                    }

                  </div>

                </div>


                {/* TRACKING NUMBER */}

                <div className="customer-shipment-tracking">


                  <div>

                    <span>
                      TRACKING NUMBER
                    </span>

                    <strong>
                      {
                        shipment
                          .trackingNumber
                      }
                    </strong>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      handleTrackShipment(
                        shipment
                          .trackingNumber
                      )
                    }
                  >
                    Track Shipment
                    <span>→</span>
                  </button>

                </div>


                {/* ROUTE */}

                <div className="customer-shipment-route">


                  <div>

                    <span>
                      ORIGIN
                    </span>

                    <strong>
                      {shipment.originPort}
                    </strong>

                  </div>


                  <div className="customer-shipment-route-line">

                    <i></i>

                    <span>
                      →
                    </span>

                  </div>


                  <div className="customer-shipment-destination">

                    <span>
                      DESTINATION
                    </span>

                    <strong>
                      {
                        shipment
                          .destinationPort
                      }
                    </strong>

                  </div>

                </div>


                {/* INFO */}

                <div className="customer-shipment-info">


                  <div>

                    <span>
                      SHIPMENT ID
                    </span>

                    <strong>
                      #
                      {
                        shipment
                          .shipmentId
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      ORDER ID
                    </span>

                    <strong>
                      #
                      {
                        shipment
                          .shippingOrderId
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      CARGO
                    </span>

                    <strong>
                      {
                        shipment
                          .cargoType
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      STATUS
                    </span>

                    <strong>
                      {
                        getShipmentStatus(
                          shipment.status
                        )
                      }
                    </strong>

                  </div>

                </div>


                {/* TIMELINE */}

                <div className="customer-shipment-timeline">


                  <div className="customer-shipment-timeline-header">

                    <span>
                      SHIPMENT TIMELINE
                    </span>

                    <h4>
                      Cargo Journey
                    </h4>

                  </div>


                  <div className="customer-shipment-timeline-grid">

                    {
                      getTimeline(
                        shipment
                      ).map(
                        (
                          item,
                          index
                        ) => (

                          <div
                            className={
                              `customer-shipment-timeline-item ${
                                item.date
                                  ? 'completed'
                                  : 'waiting'
                              }`
                            }
                            key={
                              item.label
                            }
                          >

                            <div className="customer-shipment-timeline-marker">

                              <i></i>

                              {
                                index < 5 && (
                                  <span></span>
                                )
                              }

                            </div>


                            <div>

                              <small>
                                0{index + 1}
                              </small>

                              <strong>
                                {item.label}
                              </strong>

                              <p>
                                {
                                  formatDate(
                                    item.date
                                  )
                                }
                              </p>

                            </div>

                          </div>

                        )
                      )
                    }

                  </div>

                </div>

              </article>

            )
          )}

        </div>

      )}

    </section>
  )
}


export default CustomerShipments