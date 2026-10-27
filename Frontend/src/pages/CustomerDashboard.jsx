import './CustomerDashboard.css'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CustomerOrders
  from '../components/dashboard/CustomerOrders'

import CustomerOrderDetails
  from '../components/dashboard/CustomerOrderDetails'

import CreateShippingOrder
  from '../components/dashboard/CreateShippingOrder'

import CustomerQuotes
  from '../components/dashboard/CustomerQuotes'

import CustomerShipments
  from '../components/dashboard/CustomerShipments'

import CustomerInvoices
  from '../components/dashboard/CustomerInvoices'

import CustomerPayments
  from '../components/dashboard/CustomerPayments'

import CustomerProfile
  from '../components/dashboard/CustomerProfile'


function CustomerDashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const [orders, setOrders] = useState([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [activeShipmentCount, setActiveShipmentCount] =
    useState(0)

  const [isShipmentsLoading, setIsShipmentsLoading] =
    useState(true)

  const [activeSection, setActiveSection] =
    useState('overview')

  const [selectedOrderId, setSelectedOrderId] =
    useState(null)


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
     CLEAR AUTH
  ====================================== */

  const clearAuth = () => {
    localStorage.removeItem(
      'seatrack_access_token'
    )

    localStorage.removeItem(
      'seatrack_token_expires_at'
    )

    sessionStorage.removeItem(
      'seatrack_access_token'
    )

    sessionStorage.removeItem(
      'seatrack_token_expires_at'
    )
  }


  /* =====================================
     LOAD ORDERS
  ====================================== */

  const loadOrders = async () => {
    const token = getToken()

    if (!token) {
      navigate('/login')
      return []
    }

    const response = await fetch(
      'https://localhost:44328/api/shipping-orders/my',
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    )

    if (response.status === 401) {
      clearAuth()

      navigate('/login')

      return []
    }

    if (!response.ok) {
      throw new Error(
        'Unable to load shipping orders.'
      )
    }

    const data =
      await response.json()

    const sortedOrders =
      [...data].sort(
        (a, b) =>
          new Date(b.createdAtUtc) -
          new Date(a.createdAtUtc)
      )

    setOrders(sortedOrders)

    return sortedOrders
  }


  /* =====================================
     LOAD ACTIVE SHIPMENT COUNT
  ====================================== */

  const loadActiveShipmentCount =
    async (ordersToCheck) => {

      const token = getToken()

      if (!token) {
        return
      }

      if (
        !ordersToCheck ||
        ordersToCheck.length === 0
      ) {
        setActiveShipmentCount(0)
        setIsShipmentsLoading(false)

        return
      }

      setIsShipmentsLoading(true)

      try {

        const results =
          await Promise.all(
            ordersToCheck.map(
              async (order) => {

                try {

                  const response =
                    await fetch(
                      `https://localhost:44328/api/shipping-orders/${order.id}/shipment`,
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

                  if (
                    response.status === 401
                  ) {
                    throw new Error(
                      'SESSION_EXPIRED'
                    )
                  }

                  if (!response.ok) {
                    return null
                  }

                  return await response.json()

                } catch (error) {

                  if (
                    error.message ===
                    'SESSION_EXPIRED'
                  ) {
                    throw error
                  }

                  return null
                }
              }
            )
          )


        /*
          ShipmentStatus:
          3 = Delivered
          4 = Cancelled
        */

        const active =
          results.filter(
            (shipment) =>
              shipment &&
              shipment.status !== 3 &&
              shipment.status !== 4
          ).length

        setActiveShipmentCount(
          active
        )

      } catch (error) {

        if (
          error.message ===
          'SESSION_EXPIRED'
        ) {
          clearAuth()

          navigate('/login')
        } else {
          console.error(error)
        }

      } finally {

        setIsShipmentsLoading(false)
      }
    }


  /* =====================================
     LOAD DASHBOARD
  ====================================== */

  useEffect(() => {

    const loadDashboard =
      async () => {

        const token = getToken()

        if (!token) {
          navigate('/login')
          return
        }

        try {

          const userResponse =
            await fetch(
              'https://localhost:44328/api/auth/me',
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            )

          if (
            userResponse.status === 401
          ) {
            clearAuth()

            navigate('/login')

            return
          }

          if (!userResponse.ok) {
            throw new Error(
              'Unable to load user.'
            )
          }

          const userData =
            await userResponse.json()

          setUser(userData)

          const loadedOrders =
            await loadOrders()

          await loadActiveShipmentCount(
            loadedOrders
          )

        } catch (error) {

          console.error(error)

        } finally {

          setIsLoading(false)
        }
      }

    loadDashboard()

  }, [navigate])


  /* =====================================
     REFRESH CUSTOMER DATA
  ====================================== */

  const refreshCustomerData =
    async () => {

      const loadedOrders =
        await loadOrders()

      await loadActiveShipmentCount(
        loadedOrders
      )
    }


  /* =====================================
     INITIALS
  ====================================== */

  const getInitials = (fullName) => {

    if (!fullName) {
      return 'CU'
    }

    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) => part[0]
      )
      .join('')
      .toUpperCase()
  }


  /* =====================================
     ORDER STATUS
  ====================================== */

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

    return (
      statuses[status] ||
      'Unknown'
    )
  }


  /* =====================================
     LOGOUT
  ====================================== */

  const handleLogout = () => {

    clearAuth()

    navigate('/login')
  }


  /* =====================================
     CREATE ORDER
  ====================================== */

  const handleOpenCreateOrder = () => {

    setSelectedOrderId(null)

    setActiveSection(
      'createOrder'
    )
  }


  const handleOrderCreated =
    async () => {

      try {

        await refreshCustomerData()

        setActiveSection(
          'orders'
        )

      } catch (error) {

        console.error(error)
      }
    }


  /* =====================================
     ORDER DETAILS
  ====================================== */

  const handleViewOrderDetails =
    (orderId) => {

      setSelectedOrderId(
        orderId
      )

      setActiveSection(
        'orderDetails'
      )
    }


  const handleBackToOrders = () => {

    setSelectedOrderId(null)

    setActiveSection(
      'orders'
    )
  }


  /* =====================================
     NAVIGATION
  ====================================== */

  const handleOpenQuotes = () => {

    setSelectedOrderId(null)

    setActiveSection(
      'quotes'
    )
  }


  const handleOpenShipments = () => {

    setSelectedOrderId(null)

    setActiveSection(
      'shipments'
    )
  }


  const handleOpenInvoices = () => {

    setSelectedOrderId(null)

    setActiveSection(
      'invoices'
    )
  }


  const handleOpenPayments = () => {

    setSelectedOrderId(null)

    setActiveSection(
      'payments'
    )
  }


  const handleOpenProfile = () => {

    setSelectedOrderId(null)

    setActiveSection(
      'profile'
    )
  }


  /* =====================================
     LATEST ORDER
  ====================================== */

  const latestOrder =
    orders.length > 0
      ? orders[0]
      : null


  /* =====================================
     QUOTE COUNT
  ====================================== */

  const awaitingDecisionCount =
    orders.filter(
      (order) =>
        order.status === 2
    ).length


  /* =====================================
     PAGE TITLE
  ====================================== */

  const getPageTitle = () => {

    if (
      activeSection === 'orders'
    ) {
      return 'My Orders'
    }

    if (
      activeSection ===
      'orderDetails'
    ) {
      return 'Order Details'
    }

    if (
      activeSection ===
      'createOrder'
    ) {
      return 'New Shipping Order'
    }

    if (
      activeSection === 'quotes'
    ) {
      return 'Quotes'
    }

    if (
      activeSection === 'shipments'
    ) {
      return 'Shipments'
    }

    if (
      activeSection === 'invoices'
    ) {
      return 'Invoices'
    }

    if (
      activeSection === 'payments'
    ) {
      return 'Payments'
    }

    if (
      activeSection === 'profile'
    ) {
      return 'Profile'
    }

    return 'Overview'
  }


  return (
    <div className="customer-dashboard">


      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="dashboard-sidebar">


        <div className="dashboard-logo">
          Sea<span>Track</span>
        </div>


        <div className="dashboard-sidebar-label">
          CUSTOMER PORTAL
        </div>


        <nav className="dashboard-nav">


          {/* OVERVIEW */}

          <button
            type="button"
            className={
              `dashboard-nav-item ${
                activeSection ===
                'overview'
                  ? 'active'
                  : ''
              }`
            }
            onClick={() => {

              setSelectedOrderId(null)

              setActiveSection(
                'overview'
              )

            }}
          >
            <span>01</span>
            Overview
          </button>


          {/* MY ORDERS */}

          <button
            type="button"
            className={
              `dashboard-nav-item ${
                (
                  activeSection ===
                    'orders' ||
                  activeSection ===
                    'orderDetails' ||
                  activeSection ===
                    'createOrder'
                )
                  ? 'active'
                  : ''
              }`
            }
            onClick={() => {

              setSelectedOrderId(null)

              setActiveSection(
                'orders'
              )

            }}
          >
            <span>02</span>
            My Orders
          </button>


          {/* QUOTES */}

          <button
            type="button"
            className={
              `dashboard-nav-item ${
                activeSection ===
                'quotes'
                  ? 'active'
                  : ''
              }`
            }
            onClick={
              handleOpenQuotes
            }
          >
            <span>03</span>
            Quotes
          </button>


          {/* SHIPMENTS */}

          <button
            type="button"
            className={
              `dashboard-nav-item ${
                activeSection ===
                'shipments'
                  ? 'active'
                  : ''
              }`
            }
            onClick={
              handleOpenShipments
            }
          >
            <span>04</span>
            Shipments
          </button>


          {/* INVOICES */}

          <button
            type="button"
            className={
              `dashboard-nav-item ${
                activeSection ===
                'invoices'
                  ? 'active'
                  : ''
              }`
            }
            onClick={
              handleOpenInvoices
            }
          >
            <span>05</span>
            Invoices
          </button>


          {/* PAYMENTS */}

          <button
            type="button"
            className={
              `dashboard-nav-item ${
                activeSection ===
                'payments'
                  ? 'active'
                  : ''
              }`
            }
            onClick={
              handleOpenPayments
            }
          >
            <span>06</span>
            Payments
          </button>


          {/* PROFILE */}

          <button
            type="button"
            className={
              `dashboard-nav-item ${
                activeSection ===
                'profile'
                  ? 'active'
                  : ''
              }`
            }
            onClick={
              handleOpenProfile
            }
          >
            <span>07</span>
            Profile
          </button>

        </nav>


        <div className="dashboard-sidebar-bottom">


          <div className="dashboard-network-status">

            <i></i>

            <div>

              <strong>
                SeaTrack Network
              </strong>

              <span>
                Online
              </span>

            </div>

          </div>


          <button
            type="button"
            className="dashboard-logout"
            onClick={
              handleLogout
            }
          >
            Log Out
            <span>→</span>
          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN
      ====================================== */}

      <div className="dashboard-main">


        {/* TOPBAR */}

        <header className="dashboard-topbar">


          <div>

            <span className="dashboard-topbar-label">
              CUSTOMER DASHBOARD
            </span>

            <h1>
              {getPageTitle()}
            </h1>

          </div>


          <div className="dashboard-topbar-actions">


            <button
              type="button"
              className="dashboard-track-button"
              onClick={() =>
                navigate('/tracking')
              }
            >
              Track Shipment
            </button>


            <div className="dashboard-user">


              <div className="dashboard-avatar">
                {
                  getInitials(
                    user?.fullName
                  )
                }
              </div>


              <div>

                <strong>
                  {
                    user?.fullName ||
                    'Customer'
                  }
                </strong>

                <span>
                  {
                    user?.roles?.[0] ||
                    'Customer'
                  }
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* =====================================
            CONTENT
        ====================================== */}

        <main className="dashboard-content">


          {/* =====================================
              OVERVIEW
          ====================================== */}

          {
            activeSection ===
            'overview' && (
              <>

                <section className="dashboard-welcome">


                  <div>

                    <span className="dashboard-section-label">
                      WELCOME BACK
                    </span>

                    <h2>
                      Your logistics.
                      <span>
                        {' '}
                        One clear view.
                      </span>
                    </h2>

                    <p>
                      Manage your maritime
                      shipping orders, quotes,
                      shipments and payments
                      from one connected
                      dashboard.
                    </p>

                  </div>


                  <button
                    type="button"
                    className="dashboard-new-order"
                    onClick={
                      handleOpenCreateOrder
                    }
                  >
                    New Shipping Order
                    <span>→</span>
                  </button>

                </section>


                {/* STATS */}

                <section className="dashboard-stats">


                  <article className="dashboard-stat-card">

                    <div className="dashboard-stat-top">

                      <span>01</span>

                      <small>
                        ORDERS
                      </small>

                    </div>


                    <strong>
                      {
                        isLoading
                          ? '—'
                          : orders.length
                      }
                    </strong>


                    <p>
                      Total Shipping Orders
                    </p>

                  </article>


                  <article className="dashboard-stat-card">

                    <div className="dashboard-stat-top">

                      <span>02</span>

                      <small>
                        QUOTES
                      </small>

                    </div>


                    <strong>
                      {
                        isLoading
                          ? '—'
                          : awaitingDecisionCount
                      }
                    </strong>


                    <p>
                      Awaiting Your Decision
                    </p>

                  </article>


                  <article className="dashboard-stat-card">

                    <div className="dashboard-stat-top">

                      <span>03</span>

                      <small>
                        SHIPMENTS
                      </small>

                    </div>


                    <strong>
                      {
                        isShipmentsLoading
                          ? '—'
                          : activeShipmentCount
                      }
                    </strong>


                    <p>
                      Active Shipments
                    </p>

                  </article>


                  <article className="dashboard-stat-card">

                    <div className="dashboard-stat-top">

                      <span>04</span>

                      <small>
                        PAYMENTS
                      </small>

                    </div>


                    <strong>
                      0
                    </strong>


                    <p>
                      Pending Payments
                    </p>

                  </article>

                </section>


                {/* LOWER GRID */}

                <section className="dashboard-overview-grid">


                  {/* LATEST ORDER */}

                  <div className="dashboard-panel">


                    <div className="dashboard-panel-header">

                      <div>

                        <span>
                          RECENT ACTIVITY
                        </span>

                        <h3>
                          Latest Shipping Order
                        </h3>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          setActiveSection(
                            'orders'
                          )
                        }
                      >
                        View All →
                      </button>

                    </div>


                    {latestOrder ? (
                      <>

                        <div className="dashboard-order-route">


                          <div>

                            <span>
                              ORIGIN
                            </span>

                            <strong>
                              {
                                latestOrder
                                  .originPort
                              }
                            </strong>

                          </div>


                          <div className="dashboard-route-line">

                            <i></i>

                            <span>
                              →
                            </span>

                          </div>


                          <div className="dashboard-route-destination">

                            <span>
                              DESTINATION
                            </span>

                            <strong>
                              {
                                latestOrder
                                  .destinationPort
                              }
                            </strong>

                          </div>

                        </div>


                        <div className="dashboard-order-details">


                          <div>

                            <span>
                              ORDER
                            </span>

                            <strong>
                              #{latestOrder.id}
                            </strong>

                          </div>


                          <div>

                            <span>
                              CARGO
                            </span>

                            <strong>
                              {
                                latestOrder
                                  .cargoType
                              }
                            </strong>

                          </div>


                          <div>

                            <span>
                              STATUS
                            </span>

                            <strong className="dashboard-status">
                              {
                                getOrderStatus(
                                  latestOrder
                                    .status
                                )
                              }
                            </strong>

                          </div>

                        </div>

                      </>
                    ) : (

                      <div
                        style={{
                          padding: '40px 0',
                          color: '#789aaa'
                        }}
                      >
                        No shipping orders yet.
                      </div>

                    )}

                  </div>


                  {/* QUICK ACTIONS */}

                  <div className="dashboard-panel dashboard-quick-panel">


                    <div className="dashboard-panel-header">

                      <div>

                        <span>
                          SHORTCUTS
                        </span>

                        <h3>
                          Quick Actions
                        </h3>

                      </div>

                    </div>


                    <div className="dashboard-quick-actions">


                      <button
                        type="button"
                        onClick={
                          handleOpenCreateOrder
                        }
                      >

                        <span>01</span>


                        <div>

                          <strong>
                            Create Shipping Order
                          </strong>

                          <p>
                            Start a new cargo request.
                          </p>

                        </div>

                        <i>→</i>

                      </button>


                      <button
                        type="button"
                        onClick={
                          handleOpenShipments
                        }
                      >

                        <span>02</span>


                        <div>

                          <strong>
                            View Shipments
                          </strong>

                          <p>
                            Follow your cargo journey.
                          </p>

                        </div>

                        <i>→</i>

                      </button>


                      <button
                        type="button"
                        onClick={
                          handleOpenQuotes
                        }
                      >

                        <span>03</span>


                        <div>

                          <strong>
                            Review Quotes
                          </strong>

                          <p>
                            View available quotations.
                          </p>

                        </div>

                        <i>→</i>

                      </button>

                    </div>

                  </div>

                </section>

              </>
            )
          }


          {/* =====================================
              MY ORDERS
          ====================================== */}

          {
            activeSection ===
            'orders' && (

              <CustomerOrders
                orders={orders}
                onViewDetails={
                  handleViewOrderDetails
                }
                onCreateOrder={
                  handleOpenCreateOrder
                }
              />

            )
          }


          {/* =====================================
              ORDER DETAILS
          ====================================== */}

          {
            activeSection ===
              'orderDetails' &&
            selectedOrderId && (

              <CustomerOrderDetails
                orderId={
                  selectedOrderId
                }
                onBack={
                  handleBackToOrders
                }
              />

            )
          }


          {/* =====================================
              CREATE ORDER
          ====================================== */}

          {
            activeSection ===
            'createOrder' && (

              <CreateShippingOrder
                onCancel={
                  handleBackToOrders
                }
                onCreated={
                  handleOrderCreated
                }
              />

            )
          }


          {/* =====================================
              QUOTES
          ====================================== */}

          {
            activeSection ===
            'quotes' && (

              <CustomerQuotes
                orders={orders}
                onOrdersChanged={
                  refreshCustomerData
                }
              />

            )
          }


          {/* =====================================
              SHIPMENTS
          ====================================== */}

          {
            activeSection ===
            'shipments' && (

              <CustomerShipments
                orders={orders}
              />

            )
          }


          {/* =====================================
              INVOICES
          ====================================== */}

          {
            activeSection ===
            'invoices' && (

              <CustomerInvoices
                orders={orders}
                onOrdersChanged={
                  refreshCustomerData
                }
              />

            )
          }


          {/* =====================================
              PAYMENTS
          ====================================== */}

          {
            activeSection ===
            'payments' && (

              <CustomerPayments />

            )
          }


          {/* =====================================
              PROFILE
          ====================================== */}

          {
            activeSection ===
            'profile' && (

              <CustomerProfile />

            )
          }


        </main>

      </div>

    </div>
  )
}


export default CustomerDashboard