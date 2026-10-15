import './Tracking.css'

function Tracking() {
  return (
    <div className="tracking-page">

      <section className="tracking-hero">

        <div className="tracking-grid"></div>

        <div className="tracking-circle tracking-circle-one"></div>
        <div className="tracking-circle tracking-circle-two"></div>

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


            <div className="tracking-search">

              <div className="tracking-input-wrapper">

                <span className="tracking-input-icon">
                  ◎
                </span>

                <input
                  type="text"
                  placeholder="Enter tracking number"
                />

              </div>

              <button type="button">
                Track Shipment
                <span>→</span>
              </button>

            </div>


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


          <div className="tracking-preview">

            <div className="tracking-preview-top">

              <div>
                <span>LIVE SHIPMENT</span>
                <strong>ST-2026-001</strong>
              </div>

              <div className="tracking-live-status">
                <i></i>
                IN TRANSIT
              </div>

            </div>


            <div className="tracking-route">

              <div className="tracking-port">
                <span>ORIGIN</span>
                <strong>Baku</strong>
                <small>Azerbaijan</small>
              </div>

              <div className="tracking-route-line">
                <span></span>
                <i>→</i>
              </div>

              <div className="tracking-port tracking-port-right">
                <span>DESTINATION</span>
                <strong>Aktau</strong>
                <small>Kazakhstan</small>
              </div>

            </div>


            <div className="tracking-progress">

              <div className="tracking-progress-line">
                <span></span>
              </div>

              <div className="tracking-progress-items">

                <div className="tracking-step completed">
                  <i></i>
                  <span>Loaded</span>
                </div>

                <div className="tracking-step completed">
                  <i></i>
                  <span>Departed</span>
                </div>

                <div className="tracking-step active">
                  <i></i>
                  <span>In Transit</span>
                </div>

                <div className="tracking-step">
                  <i></i>
                  <span>Arrived</span>
                </div>

                <div className="tracking-step">
                  <i></i>
                  <span>Unloaded</span>
                </div>

                <div className="tracking-step">
                  <i></i>
                  <span>Delivered</span>
                </div>

              </div>

            </div>


            <div className="tracking-preview-bottom">

              <div>
                <span>CURRENT STATUS</span>
                <strong>In Transit</strong>
              </div>

              <div>
                <span>VOYAGE</span>
                <strong>ST-2026-001</strong>
              </div>

            </div>

          </div>

        </div>

      </section>
        {/* =====================================
    HOW TRACKING WORKS
====================================== */}

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

      <div className="tracking-timeline-line"></div>


      <div className="tracking-timeline-item">

        <div className="tracking-timeline-marker">
          <span>01</span>
        </div>

        <h3>Loaded</h3>

        <p>
          Cargo is loaded and prepared
          for maritime transportation.
        </p>

      </div>


      <div className="tracking-timeline-item">

        <div className="tracking-timeline-marker">
          <span>02</span>
        </div>

        <h3>Departed</h3>

        <p>
          The vessel leaves the origin
          port and begins its voyage.
        </p>

      </div>


      <div className="tracking-timeline-item">

        <div className="tracking-timeline-marker">
          <span>03</span>
        </div>

        <h3>In Transit</h3>

        <p>
          Your shipment is moving
          toward the destination port.
        </p>

      </div>


      <div className="tracking-timeline-item">

        <div className="tracking-timeline-marker">
          <span>04</span>
        </div>

        <h3>Arrived</h3>

        <p>
          The vessel reaches its
          scheduled destination port.
        </p>

      </div>


      <div className="tracking-timeline-item">

        <div className="tracking-timeline-marker">
          <span>05</span>
        </div>

        <h3>Unloaded</h3>

        <p>
          Cargo is unloaded from
          the vessel at the terminal.
        </p>

      </div>


      <div className="tracking-timeline-item">

        <div className="tracking-timeline-marker">
          <span>06</span>
        </div>

        <h3>Delivered</h3>

        <p>
          The shipment journey is
          successfully completed.
        </p>

      </div>

    </div>

  </div>

</section>
    </div>
  )
}

export default Tracking