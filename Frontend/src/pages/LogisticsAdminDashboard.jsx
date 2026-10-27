import './LogisticsAdminDashboard.css'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminShippingOrders
  from '../components/admin/AdminShippingOrders'

import AdminShippingOrderDetails
  from '../components/admin/AdminShippingOrderDetails'

import AdminQuotes
  from '../components/admin/AdminQuotes'

import AdminShipments
  from '../components/admin/AdminShipments'

import AdminVessels
  from '../components/admin/AdminVessels'

import AdminContainers
  from '../components/admin/AdminContainers'

import AdminPorts
  from '../components/admin/AdminPorts'

import AdminRoutesVoyages
  from '../components/admin/AdminRoutesVoyages'

import AdminCustomers
  from '../components/admin/AdminCustomers'

import AdminInvoices
  from '../components/admin/AdminInvoices'

import AdminPayments
  from '../components/admin/AdminPayments'

const API_URL = 'https://localhost:44328'

function getToken() {
  return (
    localStorage.getItem('seatrack_access_token') ||
    sessionStorage.getItem('seatrack_access_token')
  )
}

function clearAuth() {
  localStorage.removeItem('seatrack_access_token')
  localStorage.removeItem('seatrack_token_expires_at')

  sessionStorage.removeItem('seatrack_access_token')
  sessionStorage.removeItem('seatrack_token_expires_at')
}

function LogisticsAdminDashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [activeSection, setActiveSection] =
    useState('overview')

  const [selectedOrderId, setSelectedOrderId] =
    useState(null)

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken()

      if (!token) {
        navigate('/login', {
          replace: true
        })

        return
      }

      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error(
            'Unable to load user.'
          )
        }

        const data = await response.json()

        const roles = Array.isArray(data.roles)
          ? data.roles
          : []

        const isAdmin =
          roles.includes('Admin') ||
          roles.includes('Operator')

        if (!isAdmin) {
          navigate('/dashboard', {
            replace: true
          })

          return
        }

        setUser(data)
      } catch (error) {
        console.error(error)

        clearAuth()

        navigate('/login', {
          replace: true
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [navigate])

  const sections = [
    {
      id: 'overview',
      number: '01',
      label: 'Overview'
    },
    {
      id: 'orders',
      number: '02',
      label: 'Shipping Orders'
    },
    {
      id: 'quotes',
      number: '03',
      label: 'Quotes'
    },
    {
      id: 'shipments',
      number: '04',
      label: 'Shipments'
    },
    {
      id: 'fleet',
      number: '05',
      label: 'Fleet & Vessels'
    },
    {
      id: 'containers',
      number: '06',
      label: 'Containers'
    },
    {
      id: 'ports',
      number: '07',
      label: 'Ports'
    },
    {
      id: 'routes',
      number: '08',
      label: 'Routes & Voyages'
    },
    {
      id: 'customers',
      number: '09',
      label: 'Customers'
    },
    {
      id: 'invoices',
      number: '10',
      label: 'Invoices'
    },
    {
      id: 'payments',
      number: '11',
      label: 'Payments'
    }
  ]

  const handleSectionChange = (sectionId) => {
    setSelectedOrderId(null)
    setActiveSection(sectionId)
  }

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId)
    setActiveSection('orders')

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleBackToOrders = () => {
    setSelectedOrderId(null)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleLogout = () => {
    clearAuth()

    navigate('/login', {
      replace: true
    })
  }

  const getCurrentTitle = () => {
    if (
      activeSection === 'orders' &&
      selectedOrderId
    ) {
      return `Shipping Order #${selectedOrderId}`
    }

    const section = sections.find(
      (item) =>
        item.id === activeSection
    )

    return section?.label || 'Overview'
  }

  if (isLoading) {
    return (
      <div className="logistics-admin-loading">
        Loading Logistics Admin Panel...
      </div>
    )
  }

  if (!user) {
    return null
  }

  const primaryRole =
    user.roles?.includes('Admin')
      ? 'Admin'
      : 'Operator'

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'SO'

  return (
    <div className="logistics-admin">
      <aside className="logistics-admin-sidebar">
        <div className="logistics-admin-logo">
          <span>Sea</span>
          <strong>Track</strong>
        </div>

        <div className="logistics-admin-sidebar-label">
          Logistics Operations
        </div>

        <nav className="logistics-admin-nav">
          {sections.map((section) => (
            <button
              type="button"
              key={section.id}
              className={
                activeSection === section.id
                  ? 'logistics-admin-nav-item active'
                  : 'logistics-admin-nav-item'
              }
              onClick={() =>
                handleSectionChange(section.id)
              }
            >
              <span className="logistics-admin-nav-number">
                {section.number}
              </span>

              <span className="logistics-admin-nav-label">
                {section.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="logistics-admin-sidebar-bottom">
          <div className="logistics-admin-system">
            <span className="logistics-admin-system-dot" />

            <div>
              <strong>
                Operations System
              </strong>

              <span>
                Online
              </span>
            </div>
          </div>

          <button
            type="button"
            className="logistics-admin-logout"
            onClick={handleLogout}
          >
            <span>
              Log Out
            </span>

            <strong>
              →
            </strong>
          </button>
        </div>
      </aside>

      <div className="logistics-admin-main">
        <header className="logistics-admin-topbar">
          <div>
            <span className="logistics-admin-topbar-label">
              Logistics Admin Panel
            </span>

            <h1>
              {getCurrentTitle()}
            </h1>
          </div>

          <div className="logistics-admin-user">
            <div className="logistics-admin-avatar">
              {initials}
            </div>

            <div>
              <strong>
                {user.fullName ||
                  'SeaTrack Operator'}
              </strong>

              <span>
                {primaryRole}
              </span>
            </div>
          </div>
        </header>

        <main className="logistics-admin-content">
          {activeSection === 'overview' && (
            <section className="logistics-admin-overview">
              <div className="logistics-admin-section-heading">
                <span>
                  Logistics Operations
                </span>

                <h2>
                  Operations Overview
                </h2>

                <p>
                  Monitor SeaTrack logistics
                  operations and manage maritime
                  transportation resources.
                </p>
              </div>

              <div className="logistics-admin-stats">
                <article>
                  <span>
                    Shipping Orders
                  </span>

                  <strong>
                    —
                  </strong>

                  <small>
                    Customer cargo orders
                  </small>
                </article>

                <article>
                  <span>
                    Active Shipments
                  </span>

                  <strong>
                    —
                  </strong>

                  <small>
                    Current transportation
                  </small>
                </article>

                <article>
                  <span>
                    Available Containers
                  </span>

                  <strong>
                    —
                  </strong>

                  <small>
                    Ready for assignment
                  </small>
                </article>

                <article>
                  <span>
                    Active Voyages
                  </span>

                  <strong>
                    —
                  </strong>

                  <small>
                    Maritime operations
                  </small>
                </article>
              </div>

              <div className="logistics-admin-overview-grid">
                <article className="logistics-admin-overview-card">
                  <span>
                    01
                  </span>

                  <div>
                    <small>
                      Order Operations
                    </small>

                    <h3>
                      Shipping Management
                    </h3>

                    <p>
                      Review customer orders,
                      quotations, assignments and
                      shipment progress.
                    </p>
                  </div>
                </article>

                <article className="logistics-admin-overview-card">
                  <span>
                    02
                  </span>

                  <div>
                    <small>
                      Maritime Resources
                    </small>

                    <h3>
                      Fleet & Containers
                    </h3>

                    <p>
                      Manage vessels, containers
                      and operational logistics
                      resources.
                    </p>
                  </div>
                </article>

                <article className="logistics-admin-overview-card">
                  <span>
                    03
                  </span>

                  <div>
                    <small>
                      Network
                    </small>

                    <h3>
                      Ports & Routes
                    </h3>

                    <p>
                      Manage ports, terminals,
                      berths, routes and voyages.
                    </p>
                  </div>
                </article>
              </div>
            </section>
          )}

          {activeSection === 'orders' &&
            !selectedOrderId && (
              <AdminShippingOrders
                onViewOrder={
                  handleViewOrder
                }
              />
            )}

          {activeSection === 'orders' &&
            selectedOrderId && (
              <AdminShippingOrderDetails
                orderId={selectedOrderId}
                onBack={
                  handleBackToOrders
                }
              />
            )}

          {activeSection === 'quotes' && (
            <AdminQuotes />
          )}

          {activeSection === 'shipments' && (
            <AdminShipments />
          )}

          {activeSection === 'fleet' && (
            <AdminVessels />
          )}

          {activeSection === 'containers' && (
            <AdminContainers />
          )}

          {activeSection === 'ports' && (
            <AdminPorts />
          )}

          {activeSection === 'routes' && (
            <AdminRoutesVoyages />
          )}

          {activeSection === 'customers' && (
            <AdminCustomers />
          )}

          {activeSection === 'invoices' && (
            <AdminInvoices />
          )}

          {activeSection === 'payments' && (
            <AdminPayments />
          )}
        </main>
      </div>
    </div>
  )
}

export default LogisticsAdminDashboard