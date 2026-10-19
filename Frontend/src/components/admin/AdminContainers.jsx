import './AdminContainers.css'

import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

const API_URL = 'http://localhost:5080'

const containerStatusMap = {
  1: 'Available',
  2: 'Reserved',
  3: 'In Use',
  4: 'Maintenance',
  5: 'Unavailable'
}

const containerTypeMap = {
  1: 'Dry Container',
  2: 'Reefer Container',
  3: 'Open Top',
  4: 'Flat Rack',
  5: 'Tank Container'
}

function getToken() {
  return (
    localStorage.getItem('seatrack_access_token') ||
    sessionStorage.getItem('seatrack_access_token')
  )
}

function getStatusClass(status) {
  switch (Number(status)) {
    case 1:
      return 'available'

    case 2:
      return 'reserved'

    case 3:
      return 'in-use'

    case 4:
      return 'maintenance'

    case 5:
      return 'unavailable'

    default:
      return 'unknown'
  }
}

function formatNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '—'
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return value
  }

  return number.toLocaleString('en-US')
}

function AdminContainers() {
  const [containers, setContainers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const loadContainers = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setError(
        'Authorization token was not found. Please log in again.'
      )

      setContainers([])
      setIsLoading(false)

      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/admin/containers`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.status === 401) {
        throw new Error(
          'Your session has expired. Please log in again.'
        )
      }

      if (response.status === 403) {
        throw new Error(
          'You do not have permission to view containers.'
        )
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load containers. Status: ${response.status}`
        )
      }

      const data = await response.json()

      setContainers(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
          'Unable to load containers.'
      )

      setContainers([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContainers()
  }, [loadContainers])

  const stats = useMemo(() => {
    const total = containers.length

    const available = containers.filter(
      (container) =>
        Number(container.status) === 1
    ).length

    const reserved = containers.filter(
      (container) =>
        Number(container.status) === 2
    ).length

    const inUse = containers.filter(
      (container) =>
        Number(container.status) === 3
    ).length

    const maintenance = containers.filter(
      (container) =>
        Number(container.status) === 4
    ).length

    const unavailable = containers.filter(
      (container) =>
        Number(container.status) === 5
    ).length

    return {
      total,
      available,
      reserved,
      inUse,
      maintenance,
      unavailable
    }
  }, [containers])

  const filteredContainers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase()

    return containers.filter((container) => {
      const status = Number(container.status)

      const matchesSearch =
        !normalizedSearch ||
        String(container.id ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(container.containerNumber ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(container.number ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(container.containerType ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(
          containerTypeMap[
            Number(container.containerType)
          ] ?? ''
        )
          .toLowerCase()
          .includes(normalizedSearch)

      if (!matchesSearch) {
        return false
      }

      if (statusFilter === 'all') {
        return true
      }

      return status === Number(statusFilter)
    })
  }, [
    containers,
    search,
    statusFilter
  ])

  if (isLoading) {
    return (
      <section className="admin-containers">
        <div className="admin-containers-loading">
          Loading containers...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-containers">
        <div className="admin-containers-error">
          <strong>
            Unable to load containers
          </strong>

          <span>{error}</span>

          <button
            type="button"
            onClick={loadContainers}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-containers">
      <div className="admin-containers-heading">
        <div>
          <span className="admin-containers-eyebrow">
            Maritime Resources
          </span>

          <h2>Containers</h2>

          <p>
            Monitor container availability,
            capacity and operational status across
            SeaTrack logistics.
          </p>
        </div>

        <button
          type="button"
          className="admin-containers-refresh"
          onClick={loadContainers}
        >
          Refresh Containers
          <span>↻</span>
        </button>
      </div>

      <div className="admin-containers-stats">
        <article>
          <span>Total Containers</span>

          <strong>
            {stats.total}
          </strong>

          <small>
            Registered containers
          </small>
        </article>

        <article>
          <span>Available</span>

          <strong>
            {stats.available}
          </strong>

          <small>
            Ready for assignment
          </small>
        </article>

        <article>
          <span>Reserved</span>

          <strong>
            {stats.reserved}
          </strong>

          <small>
            Assigned to operations
          </small>
        </article>

        <article>
          <span>In Use</span>

          <strong>
            {stats.inUse}
          </strong>

          <small>
            Currently transporting cargo
          </small>
        </article>
      </div>

      <div className="admin-containers-filters">
        <div className="admin-containers-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by container number, type or ID..."
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >
          <option value="all">
            All Container Statuses
          </option>

          <option value="1">
            Available
          </option>

          <option value="2">
            Reserved
          </option>

          <option value="3">
            In Use
          </option>

          <option value="4">
            Maintenance
          </option>

          <option value="5">
            Unavailable
          </option>
        </select>
      </div>

      <div className="admin-containers-panel">
        <div className="admin-containers-panel-heading">
          <div>
            <span>
              Container Fleet
            </span>

            <h3>
              Container Management
            </h3>
          </div>

          <small>
            Showing {filteredContainers.length} of{' '}
            {containers.length}
          </small>
        </div>

        {filteredContainers.length === 0 ? (
          <div className="admin-containers-empty">
            <strong>
              No containers found
            </strong>

            <span>
              There are no containers matching
              the selected filters.
            </span>
          </div>
        ) : (
          <div className="admin-containers-list">
            {filteredContainers.map(
              (container) => {
                const status =
                  Number(container.status)

                const type =
                  Number(
                    container.containerType
                  )

                const number =
                  container.containerNumber ||
                  container.number ||
                  `Container #${container.id}`

                const maxWeight =
                  container.maxWeight ??
                  container.maximumWeight

                const maxVolume =
                  container.maxVolume ??
                  container.maximumVolume

                return (
                  <article
                    className="admin-container-card"
                    key={container.id}
                  >
                    <div className="admin-container-card-top">
                      <div>
                        <span>
                          Container
                        </span>

                        <h3>
                          {number}
                        </h3>
                      </div>

                      <span
                        className={`admin-container-state admin-container-state-${getStatusClass(
                          status
                        )}`}
                      >
                        {containerStatusMap[
                          status
                        ] || 'Unknown'}
                      </span>
                    </div>

                    <div className="admin-container-main-info">
                      <div>
                        <span>
                          Container Type
                        </span>

                        <strong>
                          {containerTypeMap[
                            type
                          ] ||
                            container.containerType ||
                            '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Active
                        </span>

                        <strong>
                          {container.isActive ===
                          false
                            ? 'No'
                            : 'Yes'}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-container-capacity">
                      <div>
                        <span>
                          Maximum Weight
                        </span>

                        <strong>
                          {maxWeight != null
                            ? `${formatNumber(
                                maxWeight
                              )} kg`
                            : '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Maximum Volume
                        </span>

                        <strong>
                          {maxVolume != null
                            ? `${formatNumber(
                                maxVolume
                              )} m³`
                            : '—'}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-container-footer">
                      <div>
                        <span>
                          Container ID
                        </span>

                        <strong>
                          #{container.id}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Operational Status
                        </span>

                        <strong>
                          {containerStatusMap[
                            status
                          ] || 'Unknown'}
                        </strong>
                      </div>
                    </div>
                  </article>
                )
              }
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminContainers