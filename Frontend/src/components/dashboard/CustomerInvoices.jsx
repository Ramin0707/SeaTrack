import './CustomerInvoices.css'

import { useEffect, useState } from 'react'


function CustomerInvoices({
  orders = [],
  onOrdersChanged
}) {
  const [invoices, setInvoices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [payingInvoiceId, setPayingInvoiceId] =
    useState(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


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

  const getInvoiceStatus = (status) => {
    const statuses = {
      1: 'Pending',
      2: 'Paid',
      3: 'Cancelled'
    }

    return statuses[status] || 'Unknown'
  }


  const getStatusClass = (status) => {
    const classes = {
      1: 'pending',
      2: 'paid',
      3: 'cancelled'
    }

    return classes[status] || ''
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


  const formatAmount = (
    amount,
    currency
  ) => {
    const value = Number(amount)

    if (Number.isNaN(value)) {
      return `${amount} ${currency || ''}`
    }

    return `${value.toLocaleString(
      'en-US',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )} ${currency || ''}`
  }


  /* =====================================
     LOAD INVOICES
  ====================================== */

  const loadInvoices = async () => {
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
              `https://localhost:44328/api/shipping-orders/${order.id}/invoice`,
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


            const invoice =
              await response.json()


            return {
              ...invoice,

              orderId: order.id,
              cargoType: order.cargoType,
              originPort: order.originPort,
              destinationPort:
                order.destinationPort,
              orderStatus: order.status
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


      const availableInvoices =
        results
          .filter(Boolean)
          .sort(
            (a, b) =>
              new Date(b.issuedAtUtc) -
              new Date(a.issuedAtUtc)
          )


      setInvoices(
        availableInvoices
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
          'Unable to load invoices.'
        )
      }

    } finally {

      setIsLoading(false)

    }
  }


  useEffect(() => {
    loadInvoices()
  }, [orders])


  /* =====================================
     PAY INVOICE
  ====================================== */

  const handlePayInvoice =
    async (invoice) => {

      const token = getToken()

      if (!token) {
        setError(
          'Your session has expired. Please sign in again.'
        )

        return
      }


      setPayingInvoiceId(
        invoice.id
      )

      setError('')
      setSuccess('')


      try {
        const response = await fetch(
          `https://localhost:44328/api/shipping-orders/invoices/${invoice.id}/pay`,
          {
            method: 'POST',

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        )


        if (response.status === 401) {
          setError(
            'Your session has expired. Please sign in again.'
          )

          return
        }


        if (response.status === 404) {
          setError(
            'Invoice was not found.'
          )

          return
        }


        if (!response.ok) {
          let message =
            'Unable to pay invoice.'


          try {
            const data =
              await response.json()


            if (data?.message) {
              message =
                data.message
            }


            if (
              Array.isArray(
                data?.errors
              ) &&
              data.errors.length > 0
            ) {
              message =
                data.errors[0]
            }

          } catch {
            // Keep default message.
          }


          setError(message)

          return
        }


        setSuccess(
          `Invoice ${invoice.invoiceNumber} paid successfully.`
        )


        /*
          Payment may also change
          ShippingOrder status.
        */

        if (onOrdersChanged) {
          await onOrdersChanged()
        }


        await loadInvoices()

      } catch {

        setError(
          'Unable to connect to SeaTrack.'
        )

      } finally {

        setPayingInvoiceId(null)

      }
    }


  /* =====================================
     COUNTERS
  ====================================== */

  const pendingCount =
    invoices.filter(
      (invoice) =>
        invoice.status === 1
    ).length


  const paidCount =
    invoices.filter(
      (invoice) =>
        invoice.status === 2
    ).length


  const cancelledCount =
    invoices.filter(
      (invoice) =>
        invoice.status === 3
    ).length


  const pendingAmount =
    invoices
      .filter(
        (invoice) =>
          invoice.status === 1
      )
      .reduce(
        (total, invoice) =>
          total +
          Number(invoice.amount || 0),
        0
      )


  /* =====================================
     RENDER
  ====================================== */

  return (
    <section className="customer-invoices">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="customer-invoices-header">

        <div>

          <span className="customer-invoices-label">
            BILLING & PAYMENTS
          </span>


          <h2>
            Invoices
          </h2>


          <p>
            Review invoices generated for your
            shipping orders and complete pending
            payments.
          </p>

        </div>

      </div>


      {/* =====================================
          SUMMARY
      ====================================== */}

      <div className="customer-invoices-summary">


        <div>

          <span>
            TOTAL INVOICES
          </span>

          <strong>
            {invoices.length}
          </strong>

        </div>


        <div>

          <span>
            PENDING
          </span>

          <strong>
            {pendingCount}
          </strong>

        </div>


        <div>

          <span>
            PAID
          </span>

          <strong>
            {paidCount}
          </strong>

        </div>


        <div>

          <span>
            PENDING VALUE
          </span>

          <strong>
            {
              pendingAmount
                .toLocaleString(
                  'en-US',
                  {
                    maximumFractionDigits: 2
                  }
                )
            }
          </strong>

        </div>

      </div>


      {/* =====================================
          MESSAGES
      ====================================== */}

      {error && (

        <div className="customer-invoices-message error">
          {error}
        </div>

      )}


      {success && (

        <div className="customer-invoices-message success">
          {success}
        </div>

      )}


      {/* =====================================
          CONTENT
      ====================================== */}

      {isLoading ? (

        <div className="customer-invoices-loading">
          Loading invoices...
        </div>

      ) : invoices.length === 0 ? (

        <div className="customer-invoices-empty">

          <span>
            INVOICES
          </span>


          <h3>
            No invoices yet
          </h3>


          <p>
            An invoice will appear here after
            your quotation has been accepted
            and processed by SeaTrack.
          </p>

        </div>

      ) : (

        <div className="customer-invoices-list">


          {invoices.map(
            (invoice) => (

              <article
                className="customer-invoice-card"
                key={invoice.id}
              >


                {/* TOP */}

                <div className="customer-invoice-top">


                  <div>

                    <span>
                      INVOICE
                    </span>

                    <h3>
                      {
                        invoice
                          .invoiceNumber
                      }
                    </h3>

                    <small>
                      Order #{invoice.orderId}
                    </small>

                  </div>


                  <div
                    className={
                      `customer-invoice-status ${
                        getStatusClass(
                          invoice.status
                        )
                      }`
                    }
                  >

                    <i></i>

                    {
                      getInvoiceStatus(
                        invoice.status
                      )
                    }

                  </div>

                </div>


                {/* ROUTE */}

                <div className="customer-invoice-route">


                  <div>

                    <span>
                      ORIGIN
                    </span>

                    <strong>
                      {invoice.originPort}
                    </strong>

                  </div>


                  <div className="customer-invoice-route-line">

                    <i></i>

                    <span>
                      →
                    </span>

                  </div>


                  <div className="customer-invoice-destination">

                    <span>
                      DESTINATION
                    </span>

                    <strong>
                      {
                        invoice
                          .destinationPort
                      }
                    </strong>

                  </div>

                </div>


                {/* AMOUNT */}

                <div className="customer-invoice-amount">


                  <div>

                    <span>
                      INVOICE AMOUNT
                    </span>

                    <strong>
                      {
                        formatAmount(
                          invoice.amount,
                          invoice.currency
                        )
                      }
                    </strong>

                  </div>


                  <div className="customer-invoice-amount-line"></div>


                  <div>

                    <span>
                      STATUS
                    </span>

                    <strong
                      className={
                        `invoice-amount-status ${
                          getStatusClass(
                            invoice.status
                          )
                        }`
                      }
                    >
                      {
                        getInvoiceStatus(
                          invoice.status
                        )
                      }
                    </strong>

                  </div>

                </div>


                {/* DETAILS */}

                <div className="customer-invoice-info">


                  <div>

                    <span>
                      INVOICE ID
                    </span>

                    <strong>
                      #{invoice.id}
                    </strong>

                  </div>


                  <div>

                    <span>
                      QUOTE ID
                    </span>

                    <strong>
                      #{invoice.quoteId}
                    </strong>

                  </div>


                  <div>

                    <span>
                      CARGO
                    </span>

                    <strong>
                      {invoice.cargoType}
                    </strong>

                  </div>


                  <div>

                    <span>
                      ISSUED
                    </span>

                    <strong>
                      {
                        formatDate(
                          invoice.issuedAtUtc
                        )
                      }
                    </strong>

                  </div>


                  <div>

                    <span>
                      DUE DATE
                    </span>

                    <strong>
                      {
                        formatDate(
                          invoice.dueDateUtc
                        )
                      }
                    </strong>

                  </div>

                </div>


                {/* FOOTER */}

                <div className="customer-invoice-footer">


                  <div>

                    <span>
                      SeaTrack billing
                    </span>

                    <p>
                      Invoice for shipping
                      order #{invoice.orderId}
                    </p>

                  </div>


                  {invoice.status === 1 ? (

                    <button
                      type="button"
                      className="customer-invoice-pay"
                      disabled={
                        payingInvoiceId ===
                        invoice.id
                      }
                      onClick={() =>
                        handlePayInvoice(
                          invoice
                        )
                      }
                    >
                      {
                        payingInvoiceId ===
                        invoice.id
                          ? 'Processing Payment...'
                          : 'Pay Invoice'
                      }

                      {
                        payingInvoiceId !==
                          invoice.id &&
                        <span>→</span>
                      }
                    </button>

                  ) : (

                    <strong
                      className={
                        `customer-invoice-final-status ${
                          getStatusClass(
                            invoice.status
                          )
                        }`
                      }
                    >
                      {
                        getInvoiceStatus(
                          invoice.status
                        )
                      }
                    </strong>

                  )}

                </div>

              </article>

            )
          )}

        </div>

      )}


      {/* Hidden for now, useful later */}
      {cancelledCount < 0 && (
        <span>{cancelledCount}</span>
      )}

    </section>
  )
}


export default CustomerInvoices