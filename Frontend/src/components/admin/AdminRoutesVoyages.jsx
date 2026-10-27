import './AdminRoutesVoyages.css'

import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

const API_URL = 'https://localhost:44328'

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

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function AdminRoutesVoyages() {
  const [routes, setRoutes] = useState([])
  const [voyages, setVoyages] = useState([])
  const [vessels, setVessels] = useState([])
  const [ports, setPorts] = useState([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [filter, setFilter] =
    useState('all')

  const loadData = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setError(
        'Authorization token was not found. Please log in again.'
      )

      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    const headers = {
      Authorization: `Bearer ${token}`
    }

    try {
      const [
        routesResponse,
        voyagesResponse,
        vesselsResponse,
        portsResponse
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/admin/routes`,
          { headers }
        ),

        fetch(
          `${API_URL}/api/admin/voyages`,
          { headers }
        ),

        fetch(
          `${API_URL}/api/admin/vessels`,
          { headers }
        ),

        fetch(
          `${API_URL}/api/admin/ports`,
          { headers }
        )
      ])

      const responses = [
        routesResponse,
        voyagesResponse,
        vesselsResponse,
        portsResponse
      ]

      if (
        responses.some(
          (response) =>
            response.status === 401
        )
      ) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      if (
        responses.some(
          (response) =>
            response.status === 403
        )
      ) {
        throw new Error(
          'You do not have permission to view routes and voyages.'
        )
      }

      if (!routesResponse.ok) {
        throw new Error(
          `Unable to load routes. Status: ${routesResponse.status}`
        )
      }

      if (!voyagesResponse.ok) {
        throw new Error(
          `Unable to load voyages. Status: ${voyagesResponse.status}`
        )
      }

      if (!vesselsResponse.ok) {
        throw new Error(
          `Unable to load vessels. Status: ${vesselsResponse.status}`
        )
      }

      if (!portsResponse.ok) {
        throw new Error(
          `Unable to load ports. Status: ${portsResponse.status}`
        )
      }

      const [
        routesData,
        voyagesData,
        vesselsData,
        portsData
      ] = await Promise.all([
        routesResponse.json(),
        voyagesResponse.json(),
        vesselsResponse.json(),
        portsResponse.json()
      ])

      setRoutes(
        Array.isArray(routesData)
          ? routesData
          : []
      )

      setVoyages(
        Array.isArray(voyagesData)
          ? voyagesData
          : []
      )

      setVessels(
        Array.isArray(vesselsData)
          ? vesselsData
          : []
      )

      setPorts(
        Array.isArray(portsData)
          ? portsData
          : []
      )
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
          'Unable to load routes and voyages.'
      )

      setRoutes([])
      setVoyages([])
      setVessels([])
      setPorts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const routeItems = useMemo(() => {
    return routes.map((route) => {
      const originPort =
        ports.find(
          (port) =>
            Number(port.id) ===
            Number(route.originPortId)
        ) || null

      const destinationPort =
        ports.find(
          (port) =>
            Number(port.id) ===
            Number(route.destinationPortId)
        ) || null

      const routeVoyages =
        voyages
          .filter(
            (voyage) =>
              Number(voyage.routeId) ===
              Number(route.id)
          )
          .map((voyage) => {
            const vessel =
              vessels.find(
                (item) =>
                  Number(item.id) ===
                  Number(voyage.vesselId)
              ) || null

            return {
              ...voyage,
              vessel
            }
          })

      return {
        ...route,
        originPort,
        destinationPort,
        voyages: routeVoyages
      }
    })
  }, [
    routes,
    voyages,
    vessels,
    ports
  ])

  const filteredRoutes = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase()

    return routeItems.filter((route) => {
      const matchesSearch =
        !normalizedSearch ||
        String(route.id ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(route.name ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(route.code ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(route.originPort?.name ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(
          route.destinationPort?.name ?? ''
        )
          .toLowerCase()
          .includes(normalizedSearch) ||
        route.voyages.some(
          (voyage) =>
            String(
              voyage.voyageNumber ?? ''
            )
              .toLowerCase()
              .includes(normalizedSearch) ||
            String(
              voyage.vessel?.name ?? ''
            )
              .toLowerCase()
              .includes(normalizedSearch)
        )

      if (!matchesSearch) {
        return false
      }

      if (filter === 'active') {
        return route.isActive !== false
      }

      if (filter === 'inactive') {
        return route.isActive === false
      }

      if (filter === 'voyages') {
        return route.voyages.length > 0
      }

      return true
    })
  }, [
    routeItems,
    search,
    filter
  ])

  const stats = useMemo(() => {
    const activeRoutes =
      routes.filter(
        (route) =>
          route.isActive !== false
      ).length

    const activeVoyages =
      voyages.filter(
        (voyage) =>
          voyage.isActive !== false
      ).length

    return {
      routes: routes.length,
      activeRoutes,
      voyages: voyages.length,
      activeVoyages
    }
  }, [
    routes,
    voyages
  ])

  if (isLoading) {
    return (
      <section className="admin-routes-voyages">
        <div className="admin-routes-loading">
          Loading routes and voyages...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-routes-voyages">
        <div className="admin-routes-error">
          <strong>
            Unable to load routes
          </strong>

          <span>{error}</span>

          <button
            type="button"
            onClick={loadData}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-routes-voyages">
      <div className="admin-routes-heading">
        <div>
          <span className="admin-routes-eyebrow">
            Maritime Network
          </span>

          <h2>
            Routes & Voyages
          </h2>

          <p>
            Monitor maritime routes, scheduled
            voyages, assigned vessels and port
            connections.
          </p>
        </div>

        <button
          type="button"
          className="admin-routes-refresh"
          onClick={loadData}
        >
          Refresh Network
          <span>↻</span>
        </button>
      </div>

      <div className="admin-routes-stats">
        <article>
          <span>
            Total Routes
          </span>

          <strong>
            {stats.routes}
          </strong>

          <small>
            Registered maritime routes
          </small>
        </article>

        <article>
          <span>
            Active Routes
          </span>

          <strong>
            {stats.activeRoutes}
          </strong>

          <small>
            Available for operations
          </small>
        </article>

        <article>
          <span>
            Total Voyages
          </span>

          <strong>
            {stats.voyages}
          </strong>

          <small>
            Registered voyages
          </small>
        </article>

        <article>
          <span>
            Active Voyages
          </span>

          <strong>
            {stats.activeVoyages}
          </strong>

          <small>
            Current maritime operations
          </small>
        </article>
      </div>

      <div className="admin-routes-filters">
        <div className="admin-routes-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by route, voyage, port, vessel or code..."
          />
        </div>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value
            )
          }
        >
          <option value="all">
            All Routes
          </option>

          <option value="active">
            Active Routes
          </option>

          <option value="inactive">
            Inactive Routes
          </option>

          <option value="voyages">
            Routes With Voyages
          </option>
        </select>
      </div>

      <div className="admin-routes-panel">
        <div className="admin-routes-panel-heading">
          <div>
            <span>
              Maritime Network
            </span>

            <h3>
              Route Management
            </h3>
          </div>

          <small>
            Showing {filteredRoutes.length} of{' '}
            {routes.length}
          </small>
        </div>

        {filteredRoutes.length === 0 ? (
          <div className="admin-routes-empty">
            <strong>
              No routes found
            </strong>

            <span>
              There are no routes matching
              the selected filters.
            </span>
          </div>
        ) : (
          <div className="admin-routes-list">
            {filteredRoutes.map((route) => (
              <article
                className="admin-route-card"
                key={route.id}
              >
                <div className="admin-route-card-top">
                  <div>
                    <span>
                      Maritime Route
                    </span>

                    <h3>
                      {route.name ||
                        `Route #${route.id}`}
                    </h3>
                  </div>

                  <span
                    className={
                      route.isActive !== false
                        ? 'admin-route-status active'
                        : 'admin-route-status inactive'
                    }
                  >
                    {route.isActive !== false
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </div>

                <div className="admin-route-code">
                  <span>
                    Route Code
                  </span>

                  <strong>
                    {route.code || '—'}
                  </strong>
                </div>

                <div className="admin-route-direction">
                  <div>
                    <span>
                      Origin
                    </span>

                    <strong>
                      {route.originPort?.name ||
                        `Port #${route.originPortId}`}
                    </strong>

                    <small>
                      {route.originPort?.code ||
                        '—'}
                    </small>
                  </div>

                  <div className="admin-route-arrow">
                    →
                  </div>

                  <div>
                    <span>
                      Destination
                    </span>

                    <strong>
                      {route.destinationPort
                        ?.name ||
                        `Port #${route.destinationPortId}`}
                    </strong>

                    <small>
                      {route.destinationPort
                        ?.code || '—'}
                    </small>
                  </div>
                </div>

                <div className="admin-route-details">
                  <div>
                    <span>
                      Distance
                    </span>

                    <strong>
                      {route.distanceNauticalMiles !=
                      null
                        ? `${route.distanceNauticalMiles} nm`
                        : '—'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Estimated Duration
                    </span>

                    <strong>
                      {route.estimatedDurationDays !=
                      null
                        ? `${route.estimatedDurationDays} days`
                        : '—'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Voyages
                    </span>

                    <strong>
                      {route.voyages.length}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Route ID
                    </span>

                    <strong>
                      #{route.id}
                    </strong>
                  </div>
                </div>

                <div className="admin-route-voyages">
                  <div className="admin-route-voyages-heading">
                    <span>
                      Assigned Voyages
                    </span>

                    <strong>
                      {route.voyages.length}
                    </strong>
                  </div>

                  {route.voyages.length === 0 ? (
                    <div className="admin-route-no-voyages">
                      No voyages assigned to
                      this route.
                    </div>
                  ) : (
                    <div className="admin-voyage-list">
                      {route.voyages.map(
                        (voyage) => (
                          <div
                            className="admin-voyage-card"
                            key={voyage.id}
                          >
                            <div className="admin-voyage-top">
                              <div>
                                <span>
                                  Voyage
                                </span>

                                <strong>
                                  {voyage.voyageNumber ||
                                    `Voyage #${voyage.id}`}
                                </strong>
                              </div>

                              <span
                                className={
                                  voyage.isActive !==
                                  false
                                    ? 'admin-voyage-status active'
                                    : 'admin-voyage-status inactive'
                                }
                              >
                                {voyage.isActive !==
                                false
                                  ? 'Active'
                                  : 'Inactive'}
                              </span>
                            </div>

                            <div className="admin-voyage-info">
                              <div>
                                <span>
                                  Vessel
                                </span>

                                <strong>
                                  {voyage.vessel
                                    ?.name || '—'}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Departure
                                </span>

                                <strong>
                                  {formatDate(
                                    voyage.estimatedDepartureUtc
                                  )}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Arrival
                                </span>

                                <strong>
                                  {formatDate(
                                    voyage.estimatedArrivalUtc
                                  )}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Voyage ID
                                </span>

                                <strong>
                                  #{voyage.id}
                                </strong>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminRoutesVoyages