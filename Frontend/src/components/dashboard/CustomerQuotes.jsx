import './CustomerQuotes.css'

import { useEffect, useState } from 'react'


function CustomerQuotes({
  orders = [],
  onOrdersChanged
}) {
  const [quotes, setQuotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionQuoteId, setActionQuoteId] = useState(null)
  const [error, setError] = useState('')


  /* =====================================
     TOKEN
  ====================================== */

  const getToken = () => {
    return (
      localStorage.getItem('seatrack_access_token') ||
      sessionStorage.getItem('seatrack_access_token')
    )
  }


  /* =====================================
     STATUS
  ====================================== */

  const getQuoteStatus = (orderStatus) => {
    const statuses = {
      2: 'Awaiting Decision',
      3: 'Accepted',
      4: 'Rejected',
      5: 'Accepted',
      6: 'Accepted',
      7: 'Accepted'
    }

    return statuses[orderStatus] || 'Quote'
  }


  const getStatusClass = (orderStatus) => {
    if (orderStatus === 2) {
      return 'pending'
    }

    if (
      orderStatus === 3 ||
      orderStatus === 5 ||
      orderStatus === 6 ||
      orderStatus === 7
    ) {
      return 'accepted'
    }

    if (orderStatus === 4) {
      return 'rejected'
    }

    return ''
  }


  /* =====================================
     FORMAT
  ====================================== */

  const formatDate = (date) => {
    if (!date) {
      return '—'
    }

    return new Date(date).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
  }


  const formatPrice = (
    price,
    currency
  ) => {
    const amount = Number(price)

    if (Number.isNaN(amount)) {
      return `${price} ${currency || ''}`
    }

    return `${amount.toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )} ${currency || ''}`
  }


  /* =====================================
     LOAD QUOTES
  ====================================== */

  const loadQuotes = async () => {
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
              `http://localhost:5080/api/shipping-orders/${order.id}/quote`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            )


            /*
              No quote for this order.
            */

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


            const quote =
              await response.json()


            return {
              ...quote,

              orderId: order.id,
              orderStatus: order.status,
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


      const availableQuotes =
        results
          .filter(Boolean)
          .sort(
            (a, b) =>
              Number(b.id) -
              Number(a.id)
          )


      setQuotes(availableQuotes)

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
          'Unable to load quotations.'
        )
      }

    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    loadQuotes()
  }, [orders])


  /* =====================================
     ACCEPT
  ====================================== */

  const handleAccept = async (quote) => {
    const token = getToken()

    if (!token) {
      setError(
        'Your session has expired. Please sign in again.'
      )

      return
    }


    setActionQuoteId(quote.id)
    setError('')


    try {
      const response = await fetch(
        `http://localhost:5080/api/shipping-orders/${quote.orderId}/quote/accept`,
        {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )


      if (response.status === 401) {
        setError(
          'Your session has expired. Please sign in again.'
        )

        return
      }


      if (!response.ok) {
        let message =
          'Unable to accept quotation.'


        try {
          const data =
            await response.json()


          if (data?.message) {
            message = data.message
          }


          if (
            Array.isArray(data?.errors) &&
            data.errors.length > 0
          ) {
            message = data.errors[0]
          }

        } catch {
          // Keep default message.
        }


        setError(message)

        return
      }


      if (onOrdersChanged) {
        await onOrdersChanged()
      }


      await loadQuotes()

    } catch {
      setError(
        'Unable to connect to SeaTrack.'
      )

    } finally {
      setActionQuoteId(null)
    }
  }


  /* =====================================
     REJECT
  ====================================== */

  const handleReject = async (quote) => {
    const token = getToken()

    if (!token) {
      setError(
        'Your session has expired. Please sign in again.'
      )

      return
    }


    setActionQuoteId(quote.id)
    setError('')


    try {
      const response = await fetch(
        `http://localhost:5080/api/shipping-orders/${quote.orderId}/quote/reject`,
        {
          method: 'PATCH',

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )


      if (response.status === 401) {
        setError(
          'Your session has expired. Please sign in again.'
        )

        return
      }


      if (!response.ok) {
        let message =
          'Unable to reject quotation.'


        try {
          const data =
            await response.json()


          if (data?.message) {
            message = data.message
          }


          if (
            Array.isArray(data?.errors) &&
            data.errors.length > 0
          ) {
            message = data.errors[0]
          }

        } catch {
          // Keep default message.
        }


        setError(message)

        return
      }


      if (onOrdersChanged) {
        await onOrdersChanged()
      }


      await loadQuotes()

    } catch {
      setError(
        'Unable to connect to SeaTrack.'
      )

    } finally {
      setActionQuoteId(null)
    }
  }


  /* =====================================
     COUNTERS
  ====================================== */

  const pendingCount =
    quotes.filter(
      (quote) => quote.orderStatus === 2
    ).length


  const acceptedCount =
    quotes.filter(
      (quote) =>
        quote.orderStatus === 3 ||
        quote.orderStatus === 5 ||
        quote.orderStatus === 6 ||
        quote.orderStatus === 7
    ).length


  const rejectedCount =
    quotes.filter(
      (quote) => quote.orderStatus === 4
    ).length


  /* =====================================
     RENDER
  ====================================== */

  return (
    <section className="customer-quotes">


      {/* HEADER */}

      <div className="customer-quotes-header">

        <div>

          <span className="customer-quotes-label">
            SHIPPING QUOTATIONS
          </span>


          <h2>
            Quotes
          </h2>


          <p>
            Review quotations prepared for your
            shipping orders and accept or reject
            available offers.
          </p>

        </div>

      </div>


      {/* SUMMARY */}

      <div className="customer-quotes-summary">

        <div>
          <span>TOTAL QUOTES</span>
          <strong>{quotes.length}</strong>
        </div>


        <div>
          <span>AWAITING DECISION</span>
          <strong>{pendingCount}</strong>
        </div>


        <div>
          <span>ACCEPTED</span>
          <strong>{acceptedCount}</strong>
        </div>


        <div>
          <span>REJECTED</span>
          <strong>{rejectedCount}</strong>
        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="customer-quotes-error">
          {error}
        </div>
      )}


      {/* LOADING */}

      {isLoading ? (

        <div className="customer-quotes-loading">
          Loading quotations...
        </div>

      ) : quotes.length === 0 ? (

        <div className="customer-quotes-empty">

          <span>QUOTATIONS</span>

          <h3>
            No quotations yet
          </h3>

          <p>
            When a SeaTrack operator prepares a
            quote for one of your shipping orders,
            it will appear here.
          </p>

        </div>

      ) : (

        <div className="customer-quotes-list">

          {quotes.map((quote) => (

            <article
              className="customer-quote-card"
              key={`${quote.orderId}-${quote.id}`}
            >

              {/* TOP */}

              <div className="customer-quote-top">

                <div>

                  <span>
                    QUOTE #{quote.id}
                  </span>

                  <h3>
                    Order #{quote.orderId}
                  </h3>

                </div>


                <div
                  className={
                    `customer-quote-status ${
                      getStatusClass(
                        quote.orderStatus
                      )
                    }`
                  }
                >
                  <i></i>

                  {
                    getQuoteStatus(
                      quote.orderStatus
                    )
                  }
                </div>

              </div>


              {/* ROUTE */}

              <div className="customer-quote-route">

                <div>

                  <span>
                    ORIGIN
                  </span>

                  <strong>
                    {quote.originPort}
                  </strong>

                </div>


                <div className="customer-quote-route-line">

                  <i></i>

                  <span>→</span>

                </div>


                <div className="customer-quote-destination">

                  <span>
                    DESTINATION
                  </span>

                  <strong>
                    {quote.destinationPort}
                  </strong>

                </div>

              </div>


              {/* PRICE */}

              <div className="customer-quote-price">

                <span>
                  TOTAL QUOTATION
                </span>

                <strong>
                  {
                    formatPrice(
                      quote.price,
                      quote.currency
                    )
                  }
                </strong>

              </div>


              {/* INFO */}

              <div className="customer-quote-info">

                <div>

                  <span>
                    CARGO
                  </span>

                  <strong>
                    {quote.cargoType}
                  </strong>

                </div>


                <div>

                  <span>
                    TRANSIT TIME
                  </span>

                  <strong>
                    {
                      quote.estimatedTransitDays
                    } days
                  </strong>

                </div>


                <div>

                  <span>
                    VALID UNTIL
                  </span>

                  <strong>
                    {
                      formatDate(
                        quote.validUntil
                      )
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    CURRENCY
                  </span>

                  <strong>
                    {quote.currency || '—'}
                  </strong>

                </div>

              </div>


              {/* NOTES */}

              {quote.notes && (
                <div className="customer-quote-notes">

                  <span>
                    OPERATOR NOTES
                  </span>

                  <p>
                    {quote.notes}
                  </p>

                </div>
              )}


              {/* ACTIONS */}

              <div className="customer-quote-footer">

                <span>
                  SeaTrack quotation for
                  shipping order #{quote.orderId}
                </span>


                {quote.orderStatus === 2 ? (

                  <div className="customer-quote-actions">

                    <button
                      type="button"
                      className="customer-quote-reject"
                      disabled={
                        actionQuoteId ===
                        quote.id
                      }
                      onClick={() =>
                        handleReject(quote)
                      }
                    >
                      Reject
                    </button>


                    <button
                      type="button"
                      className="customer-quote-accept"
                      disabled={
                        actionQuoteId ===
                        quote.id
                      }
                      onClick={() =>
                        handleAccept(quote)
                      }
                    >
                      {
                        actionQuoteId ===
                        quote.id
                          ? 'Processing...'
                          : 'Accept Quote'
                      }

                      {
                        actionQuoteId !==
                        quote.id &&
                        <span>→</span>
                      }
                    </button>

                  </div>

                ) : (

                  <strong className="customer-quote-completed">
                    {
                      getQuoteStatus(
                        quote.orderStatus
                      )
                    }
                  </strong>

                )}

              </div>

            </article>

          ))}

        </div>

      )}

    </section>
  )
}


export default CustomerQuotes