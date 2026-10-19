import './AdminVessels.css'

import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'

const API_URL = 'http://localhost:5080'

function getToken() {
  return (
    localStorage.getItem('seatrack_access_token') ||
    sessionStorage.getItem('seatrack_access_token')
  )
}

function AdminVessels() {
  const [vessels, setVessels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const loadVessels = useCallback(async () => {
    const token = getToken()

    if (!token) {
      setError(
        'Authorization token was not found. Please log in again.'
      )
      setVessels([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${API_URL}/api/admin/vessels`,
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
          'You do not have permission to view vessels.'
        )
      }

      if (!response.ok) {
        throw new Error(
          `Unable to load vessels. Status: ${response.status}`
        )
      }

      const data = await response.json()

      setVessels(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (requestError) {
      console.error(requestError)

      setError(
        requestError.message ||
          'Unable to load vessels.'
      )

      setVessels([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadVessels()
  }, [loadVessels])

  const stats = useMemo(() => {
    const total = vessels.length

    const active = vessels.filter(
      (vessel) =>
        vessel.isActive === true
    ).length

    const inactive = vessels.filter(
      (vessel) =>
        vessel.isActive === false
    ).length

    const totalDeadweight = vessels.reduce(
      (sum, vessel) => {
        const value = Number(
          vessel.deadweightTonnage ??
            vessel.deadweight ??
            vessel.dwt ??
            0
        )

        return sum + (
          Number.isNaN(value)
            ? 0
            : value
        )
      },
      0
    )

    return {
      total,
      active,
      inactive,
      totalDeadweight
    }
  }, [vessels])

  const filteredVessels = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase()

    return vessels.filter((vessel) => {
      const matchesSearch =
        !normalizedSearch ||
        String(vessel.id ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(vessel.name ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(vessel.imoNumber ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(vessel.callSign ?? '')
          .toLowerCase()
          .includes(normalizedSearch) ||
        String(vessel.flagCountry ?? '')
          .toLowerCase()
          .includes(normalizedSearch)

      if (!matchesSearch) {
        return false
      }

      if (statusFilter === 'active') {
        return vessel.isActive === true
      }

      if (statusFilter === 'inactive') {
        return vessel.isActive === false
      }

      return true
    })
  }, [
    vessels,
    search,
    statusFilter
  ])

  if (isLoading) {
    return (
      <section className="admin-vessels">
        <div className="admin-vessels-loading">
          Loading vessels...
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="admin-vessels">
        <div className="admin-vessels-error">
          <strong>
            Unable to load vessels
          </strong>

          <span>{error}</span>

          <button
            type="button"
            onClick={loadVessels}
          >
            Try Again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="admin-vessels">
      <div className="admin-vessels-heading">
        <div>
          <span className="admin-vessels-eyebrow">
            Maritime Resources
          </span>

          <h2>Fleet & Vessels</h2>

          <p>
            Monitor and manage vessels used in
            SeaTrack maritime logistics operations.
          </p>
        </div>

        <button
          type="button"
          className="admin-vessels-refresh"
          onClick={loadVessels}
        >
          Refresh Fleet
          <span>↻</span>
        </button>
      </div>

      <div className="admin-vessels-stats">
        <article>
          <span>
            Total Vessels
          </span>

          <strong>
            {stats.total}
          </strong>

          <small>
            Registered fleet
          </small>
        </article>

        <article>
          <span>
            Active Vessels
          </span>

          <strong>
            {stats.active}
          </strong>

          <small>
            Available for operations
          </small>
        </article>

        <article>
          <span>
            Inactive Vessels
          </span>

          <strong>
            {stats.inactive}
          </strong>

          <small>
            Currently unavailable
          </small>
        </article>

        <article>
          <span>
            Total DWT
          </span>

          <strong>
            {stats.totalDeadweight.toLocaleString(
              'en-US'
            )}
          </strong>

          <small>
            Fleet deadweight capacity
          </small>
        </article>
      </div>

      <div className="admin-vessels-filters">
        <div className="admin-vessels-search">
          <span>⌕</span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by vessel, IMO number, call sign or flag..."
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
            All Vessel Statuses
          </option>

          <option value="active">
            Active
          </option>

          <option value="inactive">
            Inactive
          </option>
        </select>
      </div>

      <div className="admin-vessels-panel">
        <div className="admin-vessels-panel-heading">
          <div>
            <span>
              Maritime Fleet
            </span>

            <h3>
              Vessel Management
            </h3>
          </div>

          <small>
            Showing {filteredVessels.length} of{' '}
            {vessels.length}
          </small>
        </div>

        {filteredVessels.length === 0 ? (
          <div className="admin-vessels-empty">
            <strong>
              No vessels found
            </strong>

            <span>
              There are no vessels matching the
              selected filters.
            </span>
          </div>
        ) : (
          <div className="admin-vessels-list">
            {filteredVessels.map(
              (vessel) => {
                const deadweight =
                  vessel.deadweightTonnage ??
                  vessel.deadweight ??
                  vessel.dwt

                const maxDraft =
                  vessel.maxDraft ??
                  vessel.maximumDraft

                return (
                  <article
                    className="admin-vessel-card"
                    key={vessel.id}
                  >
                    <div className="admin-vessel-card-top">
                      <div>
                        <span>
                          Vessel
                        </span>

                        <h3>
                          {vessel.name ||
                            `Vessel #${vessel.id}`}
                        </h3>
                      </div>

                      <span
                        className={
                          vessel.isActive
                            ? 'admin-vessel-state admin-vessel-state-active'
                            : 'admin-vessel-state admin-vessel-state-inactive'
                        }
                      >
                        {vessel.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </div>

                    <div className="admin-vessel-identity">
                      <div>
                        <span>
                          IMO Number
                        </span>

                        <strong>
                          {vessel.imoNumber ||
                            '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Call Sign
                        </span>

                        <strong>
                          {vessel.callSign ||
                            '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Flag
                        </span>

                        <strong>
                          {vessel.flagCountry ||
                            '—'}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-vessel-specifications">
                      <div>
                        <span>
                          Length
                        </span>

                        <strong>
                          {vessel.length != null
                            ? `${vessel.length} m`
                            : '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Width
                        </span>

                        <strong>
                          {vessel.width != null
                            ? `${vessel.width} m`
                            : '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Max Draft
                        </span>

                        <strong>
                          {maxDraft != null
                            ? `${maxDraft} m`
                            : '—'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Deadweight
                        </span>

                        <strong>
                          {deadweight != null
                            ? `${Number(
                                deadweight
                              ).toLocaleString(
                                'en-US'
                              )} t`
                            : '—'}
                        </strong>
                      </div>
                    </div>

                    <div className="admin-vessel-footer">
                      <span>
                        Vessel ID
                      </span>

                      <strong>
                        #{vessel.id}
                      </strong>
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

export default AdminVessels