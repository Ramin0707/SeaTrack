
import './AdminRoutesVoyages.css'
import './AdminPortCalls.css'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const API_URL = 'https://localhost:44328'

function getToken() {
  return (
    localStorage.getItem('seatrack_access_token') ||
    sessionStorage.getItem('seatrack_access_token')
  )
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Port Call dates are stored as UTC in the API. ASP.NET may return them without "Z".
function formatUtc(value) {
  if (!value) return 'Not reported'
  const normalized = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`
  const date = new Date(normalized)
  if (Number.isNaN(date.getTime())) return '—'
  return `${date.toLocaleString('en-GB', {
    timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  })} UTC`
}

function toDateTimeInput(value) {
  if (!value) return ''
  // Preserve the UTC clock time in <input type="datetime-local">.
  const normalized = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 16)
}

function toUtcPayload(value) {
  return value ? `${value}:00Z` : null
}

function normalizeUtc(value) {
  if (!value) return null
  return /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`
}

function asArray(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.data)) return value.data
  return []
}

async function apiRequest(path, options = {}) {
  const token = getToken()
  if (!token) throw new Error('Authorization token was not found. Please log in again.')

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  })

  if (response.status === 401) throw new Error('Your session has expired. Please log in again.')
  if (response.status === 403) throw new Error('You do not have permission to manage this resource.')

  if (!response.ok) {
    let details = ''
    try {
      const data = await response.json()
      details = data.detail || data.title ||
        (data.errors ? Object.values(data.errors).flat().join(' ') : '') || ''
    } catch { /* Some error responses have no JSON body. */ }
    throw new Error(details || `Request failed (${response.status}).`)
  }

  if (response.status === 204) return null
  const text = await response.text()
  if (!text) return null
  try { return JSON.parse(text) } catch { return text }
}

const EMPTY_PORT_CALL = {
  voyageId: '', portId: '', terminalId: '', berthId: '',
  estimatedArrivalUtc: '', estimatedDepartureUtc: '',
  actualArrivalUtc: '', actualDepartureUtc: '', isActive: true
}

function PortCallsPanel({ voyages, ports }) {
  const [portCalls, setPortCalls] = useState([])
  const [terminals, setTerminals] = useState([])
  const [berths, setBerths] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [voyageFilter, setVoyageFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_PORT_CALL)
  const formRef = useRef(null)

  const loadPortCalls = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiRequest('/api/admin/port-calls')
      setPortCalls(asArray(data))
    } catch (err) {
      setError(err.message || 'Unable to load port calls.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPortCalls() }, [loadPortCalls])

  useEffect(() => {
    let active = true
    // These two lists are optional: if the API does not expose them,
    // the form still works with numeric terminal and berth IDs.
    Promise.allSettled([
      apiRequest('/api/admin/terminals'),
      apiRequest('/api/admin/berths')
    ]).then(([terminalResult, berthResult]) => {
      if (!active) return
      if (terminalResult.status === 'fulfilled') setTerminals(asArray(terminalResult.value))
      if (berthResult.status === 'fulfilled') setBerths(asArray(berthResult.value))
    })
    return () => { active = false }
  }, [])

  const availableTerminals = useMemo(() => {
    const nested = ports.flatMap(port =>
      asArray(port.terminals).map(terminal => ({ ...terminal, portId: terminal.portId ?? port.id }))
    )
    const all = terminals.length ? terminals : nested
    return all.filter(item => !form.portId || !item.portId || Number(item.portId) === Number(form.portId))
  }, [ports, terminals, form.portId])

  const availableBerths = useMemo(() => {
    const nested = ports.flatMap(port => asArray(port.terminals).flatMap(terminal =>
      asArray(terminal.berths).map(berth => ({ ...berth, terminalId: berth.terminalId ?? terminal.id }))
    ))
    const all = berths.length ? berths : nested
    return all.filter(item => !form.terminalId || !item.terminalId || Number(item.terminalId) === Number(form.terminalId))
  }, [ports, berths, form.terminalId])

  const filteredCalls = useMemo(() => {
    const query = search.trim().toLowerCase()
    return portCalls.filter(call => {
      if (voyageFilter !== 'all' && String(call.voyageId) !== voyageFilter) return false
      if (!query) return true
      return [call.id, call.voyageNumber, call.portName, call.terminalName, call.berthName]
        .some(value => String(value ?? '').toLowerCase().includes(query))
    }).sort((a, b) => {
      const dateA = new Date(normalizeUtc(a.estimatedArrivalUtc) || 0).getTime()
      const dateB = new Date(normalizeUtc(b.estimatedArrivalUtc) || 0).getTime()
      return dateA - dateB
    })
  }, [portCalls, search, voyageFilter])

  function changeForm(field, value) {
    setForm(current => ({
      ...current,
      [field]: value,
      ...(field === 'portId' ? { terminalId: '', berthId: '' } : {}),
      ...(field === 'terminalId' ? { berthId: '' } : {})
    }))
  }

  function startCreate() {
    setEditingId(null)
    setForm({ ...EMPTY_PORT_CALL })
    setError('')
    setNotice('')
    setShowForm(true)
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  function startEdit(call) {
    setEditingId(call.id)
    setForm({
      voyageId: String(call.voyageId ?? ''),
      portId: String(call.portId ?? ''),
      terminalId: String(call.terminalId ?? ''),
      berthId: String(call.berthId ?? ''),
      estimatedArrivalUtc: toDateTimeInput(call.estimatedArrivalUtc),
      estimatedDepartureUtc: toDateTimeInput(call.estimatedDepartureUtc),
      actualArrivalUtc: toDateTimeInput(call.actualArrivalUtc),
      actualDepartureUtc: toDateTimeInput(call.actualDepartureUtc),
      isActive: call.isActive !== false
    })
    setError('')
    setNotice('')
    setShowForm(true)
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  function validateForm() {
    if (![form.voyageId, form.portId, form.terminalId, form.berthId]
      .every(value => Number.isInteger(Number(value)) && Number(value) > 0)) {
      return 'Select a voyage and port, then provide valid terminal and berth IDs.'
    }
    if (!form.estimatedArrivalUtc || !form.estimatedDepartureUtc) {
      return 'Estimated arrival and departure are required.'
    }
    if (form.estimatedDepartureUtc < form.estimatedArrivalUtc) {
      return 'Estimated departure cannot be before estimated arrival.'
    }
    if (form.actualDepartureUtc && !form.actualArrivalUtc) {
      return 'Enter actual arrival before actual departure.'
    }
    if (form.actualArrivalUtc && form.actualDepartureUtc &&
      form.actualDepartureUtc < form.actualArrivalUtc) {
      return 'Actual departure cannot be before actual arrival.'
    }
    return ''
  }

  async function savePortCall(event) {
    event.preventDefault()
    const validationError = validateForm()
    if (validationError) { setError(validationError); return }

    const basePayload = {
      voyageId: Number(form.voyageId),
      portId: Number(form.portId),
      terminalId: Number(form.terminalId),
      berthId: Number(form.berthId),
      estimatedArrivalUtc: toUtcPayload(form.estimatedArrivalUtc),
      estimatedDepartureUtc: toUtcPayload(form.estimatedDepartureUtc)
    }

    const payload = editingId === null ? basePayload : {
      ...basePayload,
      actualArrivalUtc: toUtcPayload(form.actualArrivalUtc),
      actualDepartureUtc: toUtcPayload(form.actualDepartureUtc),
      isActive: form.isActive
    }

    setSaving(true)
    setError('')
    setNotice('')
    try {
      await apiRequest(
        editingId === null ? '/api/admin/port-calls' : `/api/admin/port-calls/${editingId}`,
        { method: editingId === null ? 'POST' : 'PUT', body: JSON.stringify(payload) }
      )
      setNotice(editingId === null ? 'Port call created successfully.' : 'Port call updated successfully.')
      setShowForm(false)
      setEditingId(null)
      await loadPortCalls()
    } catch (err) {
      setError(err.message || 'Unable to save port call.')
    } finally {
      setSaving(false)
    }
  }

  function buildUpdatePayload(call, active) {
    return {
      voyageId: Number(call.voyageId),
      portId: Number(call.portId),
      terminalId: Number(call.terminalId),
      berthId: Number(call.berthId),
      estimatedArrivalUtc: normalizeUtc(call.estimatedArrivalUtc),
      estimatedDepartureUtc: normalizeUtc(call.estimatedDepartureUtc),
      actualArrivalUtc: normalizeUtc(call.actualArrivalUtc),
      actualDepartureUtc: normalizeUtc(call.actualDepartureUtc),
      isActive: active
    }
  }

  async function toggleActive(call) {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await apiRequest(`/api/admin/port-calls/${call.id}`, {
        method: 'PUT', body: JSON.stringify(buildUpdatePayload(call, call.isActive === false))
      })
      setNotice(call.isActive === false ? 'Port call activated.' : 'Port call deactivated. It will no longer appear in public tracking.')
      await loadPortCalls()
    } catch (err) {
      setError(err.message || 'Unable to change port call status.')
    } finally {
      setSaving(false)
    }
  }

  async function deletePortCall(call) {
    if (!window.confirm(`Delete Port Call #${call.id} (${call.portName || 'port'})? This cannot be undone.`)) return
    setSaving(true)
    setError('')
    setNotice('')
    try {
      await apiRequest(`/api/admin/port-calls/${call.id}`, { method: 'DELETE' })
      setNotice('Port call deleted.')
      if (editingId === call.id) { setEditingId(null); setShowForm(false) }
      await loadPortCalls()
    } catch (err) {
      setError(err.message || 'Unable to delete port call.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-portcalls" ref={formRef}>
      <div className="admin-portcalls-heading">
        <div>
          <span className="admin-portcalls-eyebrow">Port Operations</span>
          <h2>Port Calls Management</h2>
          <p>Manage voyage stops, scheduled times and actual vessel movements.</p>
        </div>
        <div className="admin-portcalls-heading-actions">
          <button type="button" className="admin-portcalls-secondary" onClick={loadPortCalls} disabled={loading || saving}>↻ Refresh</button>
          <button type="button" className="admin-portcalls-primary" onClick={startCreate} disabled={saving}>+ Add Port Call</button>
        </div>
      </div>

      <div className="admin-portcalls-stats">
        <div><span>Total Port Calls</span><strong>{portCalls.length}</strong></div>
        <div><span>Active</span><strong>{portCalls.filter(call => call.isActive !== false).length}</strong></div>
        <div><span>Arrived</span><strong>{portCalls.filter(call => call.actualArrivalUtc).length}</strong></div>
        <div><span>Departed</span><strong>{portCalls.filter(call => call.actualDepartureUtc).length}</strong></div>
      </div>

      {notice && <div className="admin-portcalls-notice" role="status">{notice}</div>}
      {error && <div className="admin-portcalls-error" role="alert">{error}</div>}

      {showForm && (
        <form className="admin-portcalls-form" onSubmit={savePortCall}>
          <div className="admin-portcalls-form-title">
            <h3>{editingId === null ? 'Create Port Call' : `Edit Port Call #${editingId}`}</h3>
            <button type="button" className="admin-portcalls-close" onClick={() => setShowForm(false)}>✕ Close</button>
          </div>
          <div className="admin-portcalls-form-grid">
            <label>Voyage *
              <select required value={form.voyageId} onChange={event => changeForm('voyageId', event.target.value)}>
                <option value="">Select voyage</option>
                {voyages.map(voyage => <option key={voyage.id} value={voyage.id}>{voyage.voyageNumber || `Voyage #${voyage.id}`} (#{voyage.id})</option>)}
              </select>
            </label>
            <label>Port *
              <select required value={form.portId} onChange={event => changeForm('portId', event.target.value)}>
                <option value="">Select port</option>
                {ports.map(port => <option key={port.id} value={port.id}>{port.name} (#{port.id})</option>)}
              </select>
            </label>
            <label>Terminal *
              {availableTerminals.length ? (
                <select required value={form.terminalId} onChange={event => changeForm('terminalId', event.target.value)}>
                  <option value="">Select terminal</option>
                  {availableTerminals.map(terminal => <option key={terminal.id} value={terminal.id}>{terminal.name || `Terminal #${terminal.id}`}</option>)}
                </select>
              ) : (
                <input type="number" min="1" step="1" required placeholder="Terminal ID (e.g. 1)" value={form.terminalId} onChange={event => changeForm('terminalId', event.target.value)} />
              )}
            </label>
            <label>Berth *
              {availableBerths.length ? (
                <select required value={form.berthId} onChange={event => changeForm('berthId', event.target.value)}>
                  <option value="">Select berth</option>
                  {availableBerths.map(berth => <option key={berth.id} value={berth.id}>{berth.name || `Berth #${berth.id}`}</option>)}
                </select>
              ) : (
                <input type="number" min="1" step="1" required placeholder="Berth ID (e.g. 1)" value={form.berthId} onChange={event => changeForm('berthId', event.target.value)} />
              )}
            </label>
            <label>Estimated Arrival (UTC) *
              <input type="datetime-local" required value={form.estimatedArrivalUtc} onChange={event => changeForm('estimatedArrivalUtc', event.target.value)} />
            </label>
            <label>Estimated Departure (UTC) *
              <input type="datetime-local" required value={form.estimatedDepartureUtc} onChange={event => changeForm('estimatedDepartureUtc', event.target.value)} />
            </label>
            {editingId !== null && (
              <>
                <label>Actual Arrival (UTC)
                  <input type="datetime-local" value={form.actualArrivalUtc} onChange={event => changeForm('actualArrivalUtc', event.target.value)} />
                </label>
                <label>Actual Departure (UTC)
                  <input type="datetime-local" value={form.actualDepartureUtc} onChange={event => changeForm('actualDepartureUtc', event.target.value)} />
                </label>
                <label className="admin-portcalls-checkbox">
                  <input type="checkbox" checked={form.isActive} onChange={event => changeForm('isActive', event.target.checked)} />
                  Active (visible in public tracking)
                </label>
              </>
            )}
          </div>
          <p className="admin-portcalls-help">Times are entered in UTC. Terminal and berth IDs can be found in the Ports section if dropdown data is unavailable.</p>
          <div className="admin-portcalls-form-actions">
            <button type="button" className="admin-portcalls-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="admin-portcalls-primary" disabled={saving}>{saving ? 'Saving...' : editingId === null ? 'Create Port Call' : 'Save Changes'}</button>
          </div>
        </form>
      )}

      <div className="admin-portcalls-filters">
        <input type="search" placeholder="Search by port, voyage, terminal or berth..." value={search} onChange={event => setSearch(event.target.value)} />
        <select value={voyageFilter} onChange={event => setVoyageFilter(event.target.value)}>
          <option value="all">All Voyages</option>
          {voyages.map(voyage => <option key={voyage.id} value={String(voyage.id)}>{voyage.voyageNumber || `Voyage #${voyage.id}`}</option>)}
        </select>
      </div>

      {loading ? <div className="admin-portcalls-empty">Loading port calls...</div> :
        filteredCalls.length === 0 ? <div className="admin-portcalls-empty">No port calls found.</div> : (
          <div className="admin-portcalls-list">
            {filteredCalls.map((call, index) => {
              const status = call.isActive === false ? 'Inactive' : call.actualDepartureUtc ? 'Departed' : call.actualArrivalUtc ? 'Arrived' : 'Scheduled'
              return (
                <article className="admin-portcalls-card" key={call.id}>
                  <div className="admin-portcalls-card-top">
                    <div className="admin-portcalls-card-identity">
                      <span className="admin-portcalls-number">{String(index + 1).padStart(2, '0')}</span>
                      <div><small>PORT CALL #{call.id} · {call.voyageNumber || `Voyage #${call.voyageId}`}</small><h3>{call.portName || `Port #${call.portId}`}</h3></div>
                    </div>
                    <span className={`admin-portcalls-status ${status.toLowerCase()}`}>{status}</span>
                  </div>
                  <div className="admin-portcalls-location">
                    <div><span>Terminal</span><strong>{call.terminalName || `Terminal #${call.terminalId}`}</strong></div>
                    <div><span>Berth</span><strong>{call.berthName || `Berth #${call.berthId}`}</strong></div>
                  </div>
                  <div className="admin-portcalls-dates">
                    <div><span>Estimated Arrival</span><strong>{formatUtc(call.estimatedArrivalUtc)}</strong></div>
                    <div><span>Estimated Departure</span><strong>{formatUtc(call.estimatedDepartureUtc)}</strong></div>
                    <div><span>Actual Arrival</span><strong className={call.actualArrivalUtc ? 'reported' : 'unreported'}>{formatUtc(call.actualArrivalUtc)}</strong></div>
                    <div><span>Actual Departure</span><strong className={call.actualDepartureUtc ? 'reported' : 'unreported'}>{formatUtc(call.actualDepartureUtc)}</strong></div>
                  </div>
                  <div className="admin-portcalls-card-actions">
                    <button type="button" onClick={() => startEdit(call)} disabled={saving}>Edit / Update Times</button>
                    <button type="button" onClick={() => toggleActive(call)} disabled={saving}>{call.isActive === false ? 'Activate' : 'Deactivate'}</button>
                    <button type="button" className="danger" onClick={() => deletePortCall(call)} disabled={saving}>Delete</button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
    </div>
  )
}

function AdminRoutesVoyages() {
  const [routes, setRoutes] = useState([])
  const [voyages, setVoyages] = useState([])
  const [vessels, setVessels] = useState([])
  const [ports, setPorts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [routesData, voyagesData, vesselsData, portsData] = await Promise.all([
        apiRequest('/api/admin/routes'),
        apiRequest('/api/admin/voyages'),
        apiRequest('/api/admin/vessels'),
        apiRequest('/api/admin/ports')
      ])
      setRoutes(asArray(routesData))
      setVoyages(asArray(voyagesData))
      setVessels(asArray(vesselsData))
      setPorts(asArray(portsData))
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to load routes and voyages.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const routeItems = useMemo(() => routes.map(route => ({
    ...route,
    originPort: ports.find(port => Number(port.id) === Number(route.originPortId)) || null,
    destinationPort: ports.find(port => Number(port.id) === Number(route.destinationPortId)) || null,
    voyages: voyages.filter(voyage => Number(voyage.routeId) === Number(route.id)).map(voyage => ({
      ...voyage,
      vessel: vessels.find(item => Number(item.id) === Number(voyage.vesselId)) || null
    }))
  })), [routes, voyages, vessels, ports])

  const filteredRoutes = useMemo(() => {
    const query = search.trim().toLowerCase()
    return routeItems.filter(route => {
      const matches = !query || [route.id, route.name, route.code, route.originPort?.name, route.destinationPort?.name]
        .some(value => String(value ?? '').toLowerCase().includes(query)) ||
        route.voyages.some(voyage => [voyage.voyageNumber, voyage.vessel?.name]
          .some(value => String(value ?? '').toLowerCase().includes(query)))
      if (!matches) return false
      if (filter === 'active') return route.isActive !== false
      if (filter === 'inactive') return route.isActive === false
      if (filter === 'voyages') return route.voyages.length > 0
      return true
    })
  }, [routeItems, search, filter])

  const stats = useMemo(() => ({
    routes: routes.length,
    activeRoutes: routes.filter(route => route.isActive !== false).length,
    voyages: voyages.length,
    activeVoyages: voyages.filter(voyage => voyage.isActive !== false).length
  }), [routes, voyages])

  if (isLoading) return (
    <section className="admin-routes-voyages"><div className="admin-routes-loading">Loading routes and voyages...</div></section>
  )

  if (error) return (
    <section className="admin-routes-voyages">
      <div className="admin-routes-error">
        <strong>Unable to load routes</strong><span>{error}</span>
        <button type="button" onClick={loadData}>Try Again</button>
      </div>
    </section>
  )

  return (
    <section className="admin-routes-voyages">
      <div className="admin-routes-heading">
        <div>
          <span className="admin-routes-eyebrow">Maritime Network</span>
          <h2>Routes & Voyages</h2>
          <p>Monitor maritime routes, scheduled voyages, assigned vessels and port connections.</p>
        </div>
        <button type="button" className="admin-routes-refresh" onClick={loadData}>Refresh Network <span>↻</span></button>
      </div>

      <div className="admin-routes-stats">
        <article><span>Total Routes</span><strong>{stats.routes}</strong><small>Registered maritime routes</small></article>
        <article><span>Active Routes</span><strong>{stats.activeRoutes}</strong><small>Available for operations</small></article>
        <article><span>Total Voyages</span><strong>{stats.voyages}</strong><small>Registered voyages</small></article>
        <article><span>Active Voyages</span><strong>{stats.activeVoyages}</strong><small>Current maritime operations</small></article>
      </div>

      <div className="admin-routes-filters">
        <div className="admin-routes-search">
          <span>⌕</span>
          <input type="text" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search by route, voyage, port, vessel or code..." />
        </div>
        <select value={filter} onChange={event => setFilter(event.target.value)}>
          <option value="all">All Routes</option>
          <option value="active">Active Routes</option>
          <option value="inactive">Inactive Routes</option>
          <option value="voyages">Routes With Voyages</option>
        </select>
      </div>

      <div className="admin-routes-panel">
        <div className="admin-routes-panel-heading">
          <div><span>Maritime Network</span><h3>Route Management</h3></div>
          <small>Showing {filteredRoutes.length} of {routes.length}</small>
        </div>
        {filteredRoutes.length === 0 ? (
          <div className="admin-routes-empty"><strong>No routes found</strong><span>There are no routes matching the selected filters.</span></div>
        ) : (
          <div className="admin-routes-list">
            {filteredRoutes.map(route => (
              <article className="admin-route-card" key={route.id}>
                <div className="admin-route-card-top">
                  <div><span>Maritime Route</span><h3>{route.name || `Route #${route.id}`}</h3></div>
                  <span className={`admin-route-status ${route.isActive !== false ? 'active' : 'inactive'}`}>
                    {route.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="admin-route-code"><span>Route Code</span><strong>{route.code || '—'}</strong></div>
                <div className="admin-route-direction">
                  <div><span>Origin</span><strong>{route.originPort?.name || `Port #${route.originPortId}`}</strong><small>{route.originPort?.code || '—'}</small></div>
                  <div className="admin-route-arrow">→</div>
                  <div><span>Destination</span><strong>{route.destinationPort?.name || `Port #${route.destinationPortId}`}</strong><small>{route.destinationPort?.code || '—'}</small></div>
                </div>
                <div className="admin-route-details">
                  <div><span>Distance</span><strong>{route.distanceNauticalMiles != null ? `${route.distanceNauticalMiles} nm` : '—'}</strong></div>
                  <div><span>Estimated Duration</span><strong>{route.estimatedDurationDays != null ? `${route.estimatedDurationDays} days` : '—'}</strong></div>
                  <div><span>Voyages</span><strong>{route.voyages.length}</strong></div>
                  <div><span>Route ID</span><strong>#{route.id}</strong></div>
                </div>
                <div className="admin-route-voyages">
                  <div className="admin-route-voyages-heading"><span>Assigned Voyages</span><strong>{route.voyages.length}</strong></div>
                  {route.voyages.length === 0 ? (
                    <div className="admin-route-no-voyages">No voyages assigned to this route.</div>
                  ) : (
                    <div className="admin-voyage-list">
                      {route.voyages.map(voyage => (
                        <div className="admin-voyage-card" key={voyage.id}>
                          <div className="admin-voyage-top">
                            <div><span>Voyage</span><strong>{voyage.voyageNumber || `Voyage #${voyage.id}`}</strong></div>
                            <span className={`admin-voyage-status ${voyage.isActive !== false ? 'active' : 'inactive'}`}>
                              {voyage.isActive !== false ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="admin-voyage-info">
                            <div><span>Vessel</span><strong>{voyage.vessel?.name || '—'}</strong></div>
                            <div><span>Departure</span><strong>{formatDate(voyage.estimatedDepartureUtc)}</strong></div>
                            <div><span>Arrival</span><strong>{formatDate(voyage.estimatedArrivalUtc)}</strong></div>
                            <div><span>Voyage ID</span><strong>#{voyage.id}</strong></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <PortCallsPanel voyages={voyages} ports={ports} />
    </section>
  )
}

export default AdminRoutesVoyages
