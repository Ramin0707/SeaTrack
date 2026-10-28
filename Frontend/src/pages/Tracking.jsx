
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './Tracking.css'

const API_URL = 'https://localhost:44328'

const STATUS_MAP = {
  1: 'Preparing',
  2: 'Loaded',
  3: 'Departed',
  6: 'In Transit',
  7: 'Arrived',
  8: 'Unloaded',
  9: 'Delivered',
}

const TRACKING_STAGES = [
  {
    title: 'Loaded',
    description: 'Cargo is loaded and prepared for maritime transportation.',
    dateField: 'loadedAtUtc',
  },
  {
    title: 'Departed',
    description: 'The vessel leaves the origin port and begins its voyage.',
    dateField: 'shippedAtUtc',
  },
  {
    title: 'In Transit',
    description: 'Your shipment is moving toward the destination port.',
    dateField: 'inTransitAtUtc',
  },
  {
    title: 'Arrived',
    description: 'The vessel reaches its scheduled destination port.',
    dateField: 'arrivedAtUtc',
  },
  {
    title: 'Unloaded',
    description: 'Cargo is unloaded from the vessel at the terminal.',
    dateField: 'unloadedAtUtc',
  },
  {
    title: 'Delivered',
    description: 'The shipment journey is successfully completed.',
    dateField: 'deliveredAtUtc',
  },
]

function hasValidDate(value) {
  return Boolean(value) && !Number.isNaN(new Date(value).getTime())
}

function getStatusLabel(status) {
  if (status === null || status === undefined) return 'Unknown'

  const numericStatus = Number(status)

  if (Number.isInteger(numericStatus) && STATUS_MAP[numericStatus]) {
    return STATUS_MAP[numericStatus]
  }

  const normalized = String(status)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .trim()
    .toLowerCase()

  const matchedStage = TRACKING_STAGES.find(
    (stage) => stage.title.toLowerCase() === normalized
  )

  if (matchedStage) return matchedStage.title
  if (normalized === 'intransit') return 'In Transit'

  return String(status)
}

function getCurrentStageIndex(shipment) {
  if (!shipment) return -1

  let latestMilestoneIndex = -1

  TRACKING_STAGES.forEach((stage, index) => {
    if (hasValidDate(shipment[stage.dateField])) {
      latestMilestoneIndex = index
    }
  })

  const statusLabel = getStatusLabel(shipment.status)

  const statusStageIndex = TRACKING_STAGES.findIndex(
    (stage) => stage.title === statusLabel
  )

  return Math.max(latestMilestoneIndex, statusStageIndex)
}

function getStageState(index, currentStageIndex, isDelivered) {
  if (index > currentStageIndex) return 'pending'
  if (isDelivered || index < currentStageIndex) return 'completed'
  return 'active'
}

function getPortName(port) {
  if (typeof port === 'string') return port
  return port?.name || port?.portName || '—'
}

function formatDate(value) {
  if (!hasValidDate(value)) return null

  return new Date(value).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPortCallStatus(portCall) {
  if (hasValidDate(portCall?.actualDepartureUtc)) return 'Departed'
  if (hasValidDate(portCall?.actualArrivalUtc)) return 'Arrived'
  return 'Schedule only'
}

function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlTrackingNumber =
    searchParams.get('trackingNumber')?.trim() || ''

  const [trackingInput, setTrackingInput] = useState(urlTrackingNumber)
  const [shipment, setShipment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    setTrackingInput(urlTrackingNumber)

    if (!urlTrackingNumber) {
      setShipment(null)
      setError('')
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function loadTracking() {
      setLoading(true)
      setError('')
      setShipment(null)

      try {
        const response = await fetch(
          `${API_URL}/api/tracking/${encodeURIComponent(urlTrackingNumber)}`,
          {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal: controller.signal,
          }
        )

        if (response.status === 404) {
          throw new Error(
            'No shipment was found with this tracking number.'
          )
        }

        if (!response.ok) {
          throw new Error(
            `Unable to retrieve tracking information (${response.status}).`
          )
        }

        const result = await response.json()
        const trackingData = result?.data ?? result

        if (!trackingData?.trackingNumber) {
          throw new Error(
            'The tracking response does not contain shipment information.'
          )
        }

        if (!controller.signal.aborted) {
          setShipment(trackingData)
        }
      } catch (requestError) {
        if (requestError.name === 'AbortError') return

        if (!controller.signal.aborted) {
          setError(
            requestError.message ||
            'Unable to load tracking information.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadTracking()

    return () => controller.abort()
  }, [urlTrackingNumber, refreshKey])

  const handleSearch = (event) => {
    event.preventDefault()

    const number = trackingInput.trim()

    if (!number) {
      setError('Please enter a tracking number.')
      return
    }

    setError('')
    setSearchParams({ trackingNumber: number })
    setRefreshKey((current) => current + 1)
  }

  const currentStageIndex = getCurrentStageIndex(shipment)

  const isDelivered =
    currentStageIndex === TRACKING_STAGES.length - 1

  const currentStatus = shipment
    ? currentStageIndex >= 0
      ? TRACKING_STAGES[currentStageIndex].title
      : getStatusLabel(shipment.status)
    : loading
      ? 'Loading'
      : error
        ? 'Not Found'
        : 'Ready to Track'

  const progressPercentage = currentStageIndex < 0
    ? 0
    : (currentStageIndex / (TRACKING_STAGES.length - 1)) * 100

  const originPort = shipment
    ? getPortName(shipment.originPort)
    : '—'

  const destinationPort = shipment
    ? getPortName(shipment.destinationPort)
    : '—'

  const voyageNumber =
    shipment?.voyageNumber ||
    shipment?.voyage?.voyageNumber ||
    shipment?.voyage?.number ||
    '—'

  const displayedTrackingNumber =
    shipment?.trackingNumber || urlTrackingNumber || '—'

  const portCalls = Array.isArray(shipment?.portCalls)
    ? shipment.portCalls
    : []

  return (
    <div className="tracking-page">

      {/* HERO */}

      <section className="tracking-hero">
        <div className="tracking-grid" />
        <div className="tracking-circle tracking-circle-one" />
        <div className="tracking-circle tracking-circle-two" />

        <div className="tracking-hero-container">

          <div className="tracking-hero-content">
            <span className="tracking-label">
              REAL-TIME TRACKING
            </span>

            <h1>
              Track your cargo.
              <br />
              <span>Follow every mile.</span>
            </h1>

            <p>
              Enter your SeaTrack tracking number to follow your
              shipment from departure to final delivery.
            </p>

            <form
              className="tracking-search"
              onSubmit={handleSearch}
            >
              <div className="tracking-input-wrapper">
                <span className="tracking-input-icon">
                  ◎
                </span>

                <input
                  type="text"
                  placeholder="Enter tracking number"
                  aria-label="Tracking number"
                  value={trackingInput}
                  onChange={(event) =>
                    setTrackingInput(event.target.value)
                  }
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Tracking...' : 'Track Shipment'}
                <span>→</span>
              </button>
            </form>

            {error && (
              <div className="tracking-error" role="alert">
                {error}
              </div>
            )}

            <div className="tracking-example">
              Example:
              <span> ST-20261012054740-000006</span>
            </div>

            <div className="tracking-features">
              <div>
                <strong>24/7</strong>
                <span>Shipment Visibility</span>
              </div>

              <div>
                <strong>6</strong>
                <span>Tracking Stages</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Transparent Journey</span>
              </div>
            </div>
          </div>

          {/* LIVE TRACKING PREVIEW */}

          <div className="tracking-preview">

            <div className="tracking-preview-top">
              <div>
                <span>
                  {shipment
                    ? 'TRACKED SHIPMENT'
                    : 'SHIPMENT TRACKING'}
                </span>

                <strong>{displayedTrackingNumber}</strong>
              </div>

              <div
                className={`tracking-live-status ${
                  isDelivered ? 'is-delivered' : ''
                }`}
                aria-live="polite"
              >
                <i />
                {currentStatus.toUpperCase()}
              </div>
            </div>

            <div className="tracking-route">

              <div className="tracking-port">
                <span>ORIGIN</span>
                <strong>{originPort}</strong>

                {shipment?.originCountry && (
                  <small>{shipment.originCountry}</small>
                )}
              </div>

              <div className="tracking-route-line">
                <span />
                <i>→</i>
              </div>

              <div className="tracking-port tracking-port-right">
                <span>DESTINATION</span>
                <strong>{destinationPort}</strong>

                {shipment?.destinationCountry && (
                  <small>{shipment.destinationCountry}</small>
                )}
              </div>
            </div>

            <div className="tracking-progress">
              <div className="tracking-progress-line">
                <span
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />
              </div>

              <div className="tracking-progress-items">
                {TRACKING_STAGES.map((stage, index) => {
                  const stageState = getStageState(
                    index,
                    currentStageIndex,
                    isDelivered
                  )

                  return (
                    <div
                      key={stage.title}
                      className={`tracking-step ${stageState}`}
                    >
                      <i />
                      <span>{stage.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="tracking-preview-bottom">
              <div>
                <span>CURRENT STATUS</span>
                <strong
                  className={
                    isDelivered
                      ? 'tracking-delivered-text'
                      : ''
                  }
                >
                  {currentStatus}
                </strong>
              </div>

              <div>
                <span>VOYAGE</span>
                <strong>{voyageNumber}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHIPMENT JOURNEY */}

      <section className="tracking-process">
        <div className="tracking-process-container">

          <div className="tracking-process-heading">
            <div>
              <span className="tracking-section-label">
                SHIPMENT JOURNEY
              </span>

              <h2>
                Follow every stage.
                <span> From port to delivery.</span>
              </h2>
            </div>

            <p>
              SeaTrack keeps every important shipment milestone
              organized in one clear timeline, giving you visibility
              throughout the entire maritime journey.
            </p>
          </div>

          <div className="tracking-timeline">
            {TRACKING_STAGES.map((stage, index) => {
              const dateValue = shipment
                ? shipment[stage.dateField]
                : null

              const formattedDate = formatDate(dateValue)

              const reached =
                Boolean(shipment) &&
                currentStageIndex >= index

              const stageState = getStageState(
                index,
                currentStageIndex,
                isDelivered
              )

              const connected = index < currentStageIndex

              return (
                <div
                  key={stage.title}
                  className={`tracking-timeline-item tracking-timeline-${stageState} ${
                    connected
                      ? 'tracking-timeline-connected'
                      : ''
                  }`}
                >
                  <div className="tracking-timeline-marker">
                    <span>
                      {stageState === 'completed'
                        ? '✓'
                        : String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3>{stage.title}</h3>
                  <p>{stage.description}</p>

                  {formattedDate && (
                    <p className="tracking-timeline-date">
                      {formattedDate}
                    </p>
                  )}

                  {reached && !formattedDate && (
                    <p className="tracking-timeline-date tracking-timeline-reached">
                      Stage reached
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PORT CALLS — BACKEND DATA */}

      {shipment && portCalls.length > 0 && (
        <section
          className="tracking-portcalls-section"
          aria-labelledby="tracking-portcalls-title"
        >
          <div className="tracking-process-container">

            <div className="tracking-process-heading">
              <div>
                <span className="tracking-section-label">
                  PORT OPERATIONS
                </span>

                <h2 id="tracking-portcalls-title">
                  Port calls.
                  <span> Every stop, clearly tracked.</span>
                </h2>
              </div>

              <p>
                View the ports, terminals and berths associated
                with this voyage, along with estimated and
                reported arrival and departure times.
              </p>
            </div>

            <div className="tracking-portcalls-grid">

              {portCalls.map((portCall, index) => {
                const portCallStatus =
                  getPortCallStatus(portCall)

                const statusClass = portCallStatus
                  .toLowerCase()
                  .replace(/\s+/g, '-')

                return (
                  <article
                    className="tracking-portcalls-card"
                    key={
                      portCall.portCallId ??
                      `port-call-${index}`
                    }
                  >
                    <div className="tracking-portcalls-card-header">

                      <div className="tracking-portcalls-title-group">
                        <span className="tracking-portcalls-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <div>
                          <span className="tracking-portcalls-eyebrow">
                            PORT CALL
                          </span>

                          <h3>
                            {portCall.portName ||
                              'Port not specified'}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`tracking-portcalls-status ${statusClass}`}
                      >
                        {portCallStatus}
                      </span>
                    </div>

                    <div className="tracking-portcalls-location">
                      <div>
                        <span>TERMINAL</span>
                        <strong>
                          {portCall.terminalName ||
                            'Not specified'}
                        </strong>
                      </div>

                      <div>
                        <span>BERTH</span>
                        <strong>
                          {portCall.berthName ||
                            'Not specified'}
                        </strong>
                      </div>
                    </div>

                    <div className="tracking-portcalls-times">
                      <div>
                        <span>ESTIMATED ARRIVAL</span>
                        <strong>
                          {formatDate(
                            portCall.estimatedArrivalUtc
                          ) || 'Not available'}
                        </strong>
                      </div>

                      <div>
                        <span>ESTIMATED DEPARTURE</span>
                        <strong>
                          {formatDate(
                            portCall.estimatedDepartureUtc
                          ) || 'Not available'}
                        </strong>
                      </div>

                      <div>
                        <span>ACTUAL ARRIVAL</span>
                        <strong
                          className={
                            hasValidDate(
                              portCall.actualArrivalUtc
                            )
                              ? 'is-reported'
                              : 'is-unreported'
                          }
                        >
                          {formatDate(
                            portCall.actualArrivalUtc
                          ) || 'Not reported'}
                        </strong>
                      </div>

                      <div>
                        <span>ACTUAL DEPARTURE</span>
                        <strong
                          className={
                            hasValidDate(
                              portCall.actualDepartureUtc
                            )
                              ? 'is-reported'
                              : 'is-unreported'
                          }
                        >
                          {formatDate(
                            portCall.actualDepartureUtc
                          ) || 'Not reported'}
                        </strong>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <p className="tracking-portcalls-note">
              Estimated times are planned schedules. Actual
              times appear when they are recorded by the
              port operations team.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

export default Tracking
