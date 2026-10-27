import './AdminPorts.css'

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

function AdminPorts() {
  const [ports, setPorts] = useState([])
  const [terminals, setTerminals] = useState([])
  const [berths, setBerths] = useState([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const [activeFilter, setActiveFilter] =
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
        portsResponse,
        terminalsResponse,
        berthsResponse
      ] = await Promise.all([
        fetch(
          `${API_URL}/api/admin/ports`,
          { headers }
        ),

        fetch(
          `${API_URL}/api/admin/terminals`,
          { headers }
        ),

        fetch(
          `${API_URL}/api/admin/berths`,
          { headers }
        )
      ])

      if (
        portsResponse.status === 401 ||
        terminalsResponse.status === 401 ||
        berthsResponse.status === 401
      ) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      if (
        portsResponse.status === 403 ||
        terminalsResponse.status === 403 ||
        berthsResponse.status === 403
      ) {
        throw new Error(
          'You do not have permission to view port infrastructure.'
        )
      }

      if (!portsResponse.ok) {
        throw new Error(
          `Unable to load ports. Status: ${portsResponse.status}`
        )
      }

      if (!terminalsResponse.ok) {
        throw new Error(
          `Unable to load terminals. Status: ${terminalsResponse.status}`
        )
      }

      if (!berthsResponse.ok) {
        throw new Error(
          `Unable to load berths. Status: ${berthsResponse.status}`
        )
      }

      const [
        portsData,
        terminalsData,
        berthsData
      ] = await Promise.all([
        portsResponse.json(),
        terminalsResponse.json(),
        berthsResponse.json()
      ])

      setPorts(
        Array.isArray(portsData)
          ? portsData
          : []
      )

      setTerminals(
        Array.isArray(terminalsData)
          ? terminalsData
          : []
      )

      setBerths(
        Array.isArray(berthsData)
          ? berthsData
          : []
      )
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
          'Unable to load port infrastructure.'
      )

      setPorts([])
      setTerminals([])
      setBerths([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const stats = useMemo(() => {
    const activePorts = ports.filter(
      (port) =>
        port.isActive !== false
    ).length

    const activeTerminals = terminals.filter(
      (terminal) =>
        terminal.isActive !== false
    ).length

    const activeBerths = berths.filter(
      (berth) =>
        berth.isActive !== false
    ).length

    return {
      ports: ports.length,
      terminals: terminals.length,
      berths: berths.length,
      active:
        activePorts +
        activeTerminals +
        activeBerths
    }
  }, [
    ports,
    terminals,
    berths
  ])

  const portCards = useMemo(() => {
    return ports.map((port) => {
      const portTerminals =
        terminals.filter(
          (terminal) =>
            Number(terminal.portId) ===
            Number(port.id)
        )

      const terminalIds = new Set(
        portTerminals.map(
          (terminal) =>
            Number(terminal.id)
        )
      )

      const portBerths =
        berths.filter((berth) => {
          if (
            berth.portId !== undefined &&
            berth.portId !== null
          ) {
            return (
              Number(berth.portId) ===
              Number(port.id)
            )
          }

          return terminalIds.has(
            Number(berth.terminalId)
          )
        })

      return {
        ...port,
        terminals: portTerminals,
        berths: portBerths
      }
    })
  }, [
    ports,
    terminals,
    berths
  ])

  const filteredPorts = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase()

    return portCards.filter((port) => {
      const matchesSearch =
        !normalizedSearch ||
        String(port.id ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(port.name ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(port.code ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(port.country ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(port.city ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        port.terminals.some(
          (terminal) =>
            String(terminal.name ?? '')
              .toLowerCase()
              .includes(normalizedSearch) ||
            String(terminal.code ?? '')
              .toLowerCase()
              .includes(normalizedSearch)
        ) ||
        port.berths.some(
          (berth) =>
            String(berth.name ?? '')
              .toLowerCase()
              .includes(normalizedSearch) ||
            String(berth.code ?? '')
              .toLowerCase()
              .includes(normalizedSearch)
        )

      if (!matchesSearch) {
        return false
      }

      if (activeFilter === 'active') {
        return port.isActive !== false
      }

      if (activeFilter === 'inactive') {
        return port.isActive === false
      }

      return true
    })
  }, [
    portCards,
    search,
    activeFilter
  ])

  if (isLoading) {
    return (
      <section className="admin-ports">
        <div className="admin-ports-loading">
          Loading port infrastructure...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-ports">
        <div className="admin-ports-error">
          <strong>
            Unable to load ports
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
    <section className="admin-ports">
      <div className="admin-ports-heading">
        <div>
          <span className="admin-ports-eyebrow">
            Maritime Network
          </span>

          <h2>
            Ports & Infrastructure
          </h2>

          <p>
            Monitor ports, terminals and berths
            used throughout SeaTrack maritime
            operations.
          </p>
        </div>

        <button
          type="button"
          className="admin-ports-refresh"
          onClick={loadData}
        >
          Refresh Ports
          <span>↻</span>
        </button>
      </div>

      <div className="admin-ports-stats">
        <article>
          <span>
            Total Ports
          </span>

          <strong>
            {stats.ports}
          </strong>

          <small>
            Registered sea ports
          </small>
        </article>

        <article>
          <span>
            Terminals
          </span>

          <strong>
            {stats.terminals}
          </strong>

          <small>
            Port terminals
          </small>
        </article>

        <article>
          <span>
            Berths
          </span>

          <strong>
            {stats.berths}
          </strong>

          <small>
            Vessel berthing positions
          </small>
        </article>

        <article>
          <span>
            Active Resources
          </span>

          <strong>
            {stats.active}
          </strong>

          <small>
            Operational infrastructure
          </small>
        </article>
      </div>

      <div className="admin-ports-filters">
        <div className="admin-ports-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search by port, code, country, city, terminal or berth..."
          />
        </div>

        <select
          value={activeFilter}
          onChange={(event) =>
            setActiveFilter(
              event.target.value
            )
          }
        >
          <option value="all">
            All Port Statuses
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>
      </div>

      <div className="admin-ports-panel">
        <div className="admin-ports-panel-heading">
          <div>
            <span>
              Port Network
            </span>

            <h3>
              Port Management
            </h3>
          </div>

          <small>
            Showing {filteredPorts.length} of{' '}
            {ports.length}
          </small>
        </div>

        {filteredPorts.length === 0 ? (
          <div className="admin-ports-empty">
            <strong>
              No ports found
            </strong>

            <span>
              There are no ports matching the
              selected filters.
            </span>
          </div>
        ) : (
          <div className="admin-ports-list">
            {filteredPorts.map((port) => (
              <article
                className="admin-port-card"
                key={port.id}
              >
                <div className="admin-port-card-top">
                  <div>
                    <span>
                      Sea Port
                    </span>

                    <h3>
                      {port.name ||
                        `Port #${port.id}`}
                    </h3>
                  </div>

                  <span
                    className={
                      port.isActive !== false
                        ? 'admin-port-state admin-port-state-active'
                        : 'admin-port-state admin-port-state-inactive'
                    }
                  >
                    {port.isActive !== false
                      ? 'Active'
                      : 'Inactive'}
                  </span>
                </div>

                <div className="admin-port-location">
                  <div>
                    <span>
                      Port Code
                    </span>

                    <strong>
                      {port.code || '—'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Country
                    </span>

                    <strong>
                      {port.country || '—'}
                    </strong>
                  </div>

                  <div>
                    <span>
                      City
                    </span>

                    <strong>
                      {port.city || '—'}
                    </strong>
                  </div>
                </div>

                <div className="admin-port-resource-counts">
                  <div>
                    <span>
                      Terminals
                    </span>

                    <strong>
                      {port.terminals.length}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Berths
                    </span>

                    <strong>
                      {port.berths.length}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Port ID
                    </span>

                    <strong>
                      #{port.id}
                    </strong>
                  </div>
                </div>

                <div className="admin-port-subsection">
                  <div className="admin-port-subsection-title">
                    <span>
                      Terminal Infrastructure
                    </span>

                    <strong>
                      {port.terminals.length}
                    </strong>
                  </div>

                  {port.terminals.length === 0 ? (
                    <div className="admin-port-no-resources">
                      No terminals registered.
                    </div>
                  ) : (
                    <div className="admin-port-terminals">
                      {port.terminals.map(
                        (terminal) => (
                          <div
                            className="admin-port-terminal"
                            key={terminal.id}
                          >
                            <div>
                              <span>
                                Terminal
                              </span>

                              <strong>
                                {terminal.name ||
                                  `Terminal #${terminal.id}`}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Code
                              </span>

                              <strong>
                                {terminal.code ||
                                  '—'}
                              </strong>
                            </div>

                            <span
                              className={
                                terminal.isActive !==
                                false
                                  ? 'admin-port-mini-state active'
                                  : 'admin-port-mini-state inactive'
                              }
                            >
                              {terminal.isActive !==
                              false
                                ? 'Active'
                                : 'Inactive'}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="admin-port-subsection">
                  <div className="admin-port-subsection-title">
                    <span>
                      Berthing Infrastructure
                    </span>

                    <strong>
                      {port.berths.length}
                    </strong>
                  </div>

                  {port.berths.length === 0 ? (
                    <div className="admin-port-no-resources">
                      No berths registered.
                    </div>
                  ) : (
                    <div className="admin-port-berths">
                      {port.berths.map(
                        (berth) => (
                          <div
                            className="admin-port-berth"
                            key={berth.id}
                          >
                            <div>
                              <span>
                                Berth
                              </span>

                              <strong>
                                {berth.name ||
                                  `Berth #${berth.id}`}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Code
                              </span>

                              <strong>
                                {berth.code ||
                                  '—'}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Max Depth
                              </span>

                              <strong>
                                {berth.maxDepth != null
                                  ? `${berth.maxDepth} m`
                                  : '—'}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Max Vessel
                              </span>

                              <strong>
                                {berth.maxVesselLength !=
                                null
                                  ? `${berth.maxVesselLength} m`
                                  : '—'}
                              </strong>
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

export default AdminPorts