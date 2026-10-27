import './CustomerOrders.css'


function CustomerOrders({
  orders = [],
  onViewDetails,
  onCreateOrder
}) {

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

    return new Date(date).toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
  }


  return (
    <section className="customer-orders">

      <div className="customer-orders-header">

        <div>

          <span className="customer-orders-label">
            SHIPPING ORDERS
          </span>

          <h2>My Orders</h2>

          <p>
            View and manage all of your maritime
            shipping requests from one place.
          </p>

        </div>


        <button
          type="button"
          className="customer-orders-create"
          onClick={onCreateOrder}
        >
          New Shipping Order
          <span>→</span>
        </button>

      </div>


      <div className="customer-orders-summary">

        <div>
          <span>TOTAL ORDERS</span>
          <strong>{orders.length}</strong>
        </div>


        <div>
          <span>IN TRANSIT</span>

          <strong>
            {
              orders.filter(
                (order) => order.status === 6
              ).length
            }
          </strong>
        </div>


        <div>
          <span>DELIVERED</span>

          <strong>
            {
              orders.filter(
                (order) => order.status === 7
              ).length
            }
          </strong>
        </div>


        <div>
          <span>AWAITING QUOTE</span>

          <strong>
            {
              orders.filter(
                (order) => order.status === 1
              ).length
            }
          </strong>
        </div>

      </div>


      <div className="customer-orders-panel">

        <div className="customer-orders-panel-header">

          <div>
            <span>ORDER HISTORY</span>
            <h3>All Shipping Orders</h3>
          </div>

          <span className="customer-orders-count">
            {orders.length} Orders
          </span>

        </div>


        {orders.length === 0 ? (

          <div className="customer-orders-empty">

            <span>01</span>

            <h3>No shipping orders yet</h3>

            <p>
              Create your first shipping request
              to start moving cargo with SeaTrack.
            </p>

          </div>

        ) : (

          <div className="customer-orders-list">

            {orders.map((order) => (

              <article
                className="customer-order-card"
                key={order.id}
              >

                <div className="customer-order-top">

                  <div className="customer-order-id">

                    <span>ORDER</span>

                    <strong>
                      #{order.customerOrderNumber}
                    </strong>

                  </div>


                  <div
                    className={
                      `customer-order-status ${
                        getStatusClass(order.status)
                      }`
                    }
                  >
                    <i></i>

                    {getOrderStatus(order.status)}
                  </div>

                </div>


                <div className="customer-order-route">

                  <div>

                    <span>ORIGIN</span>

                    <strong>
                      {order.originPort}
                    </strong>

                  </div>


                  <div className="customer-order-route-line">

                    <i></i>

                    <span>→</span>

                  </div>


                  <div className="customer-order-destination">

                    <span>DESTINATION</span>

                    <strong>
                      {order.destinationPort}
                    </strong>

                  </div>

                </div>


                <div className="customer-order-information">

                  <div>
                    <span>CARGO</span>
                    <strong>
                      {order.cargoType}
                    </strong>
                  </div>


                  <div>
                    <span>WEIGHT</span>
                    <strong>
                      {order.weight} kg
                    </strong>
                  </div>


                  <div>
                    <span>VOLUME</span>
                    <strong>
                      {order.volume} m³
                    </strong>
                  </div>


                  <div>
                    <span>CONTAINER</span>

                    <strong>
                      {
                        getContainerType(
                          order.containerType
                        )
                      }
                    </strong>
                  </div>


                  <div>
                    <span>SHIPPING DATE</span>

                    <strong>
                      {
                        formatDate(
                          order.desiredShippingDate
                        )
                      }
                    </strong>
                  </div>

                </div>


                <div className="customer-order-footer">

                  <span>
                    Created {
                      formatDate(
                        order.createdAtUtc
                      )
                    }
                  </span>


                  <button
                    type="button"
                    onClick={() =>
                      onViewDetails(order.id)
                    }
                  >
                    View Details
                    <span>→</span>
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>

    </section>
  )
}


export default CustomerOrders