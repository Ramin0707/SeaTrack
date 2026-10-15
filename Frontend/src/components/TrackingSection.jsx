import './TrackingSection.css'
import trackingShip from '../assets/images/tracking-ship.jpg'

function TrackingSection() {
  const stages = [
    {
      number: '01',
      title: 'Loaded',
      description: 'Cargo loaded into container',
      state: 'completed',
    },
    {
      number: '02',
      title: 'Departed',
      description: 'Departed from Baku Port',
      state: 'completed',
    },
    {
      number: '03',
      title: 'In Transit',
      description: 'Shipment is currently at sea',
      state: 'current',
    },
    {
      number: '04',
      title: 'Arrived',
      description: 'Arrival at destination port',
      state: 'pending',
    },
    {
      number: '05',
      title: 'Unloaded',
      description: 'Cargo unloaded from vessel',
      state: 'pending',
    },
    {
      number: '06',
      title: 'Delivered',
      description: 'Transportation completed',
      state: 'pending',
    },
  ]

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <section className="tracking-section" id="tracking">
      <div className="tracking-container">

        {/* LEFT SIDE */}
        <div className="tracking-content">

          <div className="tracking-label">
            <span></span>
            TRACK YOUR SHIPMENT
          </div>

          <h2>
            Real-Time
            <br />
            Tracking.
            <br />
            <strong>Total Transparency.</strong>
          </h2>

          <p className="tracking-description">
            Track your cargo at every stage of the voyage.
            Enter your SeaTrack tracking number to see the latest
            shipment status, route and delivery progress.
          </p>

          <form
            className="tracking-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Enter tracking number"
              aria-label="Tracking number"
            />

            <button type="submit">
              Track Shipment
              <span>→</span>
            </button>
          </form>

          <div className="tracking-stats">

            <div>
              <strong>24/7</strong>
              <span>Live visibility</span>
            </div>

            <div>
              <strong>6</strong>
              <span>Tracking stages</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Transparent</span>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="tracking-panel">

          {/* IMAGE */}
          <div className="tracking-image">
            <img
              src={trackingShip}
              alt="SeaTrack container ship"
            />

            <div className="tracking-image-overlay"></div>

            <div className="tracking-image-badge">
              <span>LIVE VOYAGE</span>
              <strong>ST-2026-001</strong>
            </div>
          </div>


          {/* SHIPMENT HEADER */}
          <div className="tracking-panel-header">

            <div>
              <span className="tracking-panel-label">
                SHIPMENT STATUS
              </span>

              <h3>Baku → Aktau</h3>
            </div>

            <span className="tracking-status">
              In Transit
            </span>

          </div>


          {/* TRACKING NUMBER */}
          <div className="tracking-number">

            <span>Tracking number</span>

            <strong>
              ST-2026-001
            </strong>

          </div>


          {/* TIMELINE */}
          <div className="tracking-timeline">

            {stages.map((stage) => (
              <div
                className={`tracking-stage ${stage.state}`}
                key={stage.number}
              >

                <div className="tracking-stage-marker">
                  <span></span>
                </div>

                <span className="tracking-stage-number">
                  {stage.number}
                </span>

                <div className="tracking-stage-content">

                  <h4>
                    {stage.title}
                  </h4>

                  <p>
                    {stage.description}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  )
}

export default TrackingSection