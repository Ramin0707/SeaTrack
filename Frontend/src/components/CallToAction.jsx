import './CallToAction.css'

function CallToAction() {
  return (
    <section className="cta-section">
      <div className="cta-glow cta-glow-left"></div>
      <div className="cta-glow cta-glow-right"></div>

      <div className="cta-container">

        <div className="cta-content">
          <span className="cta-label">
            READY TO SHIP?
          </span>

          <h2>
            Ready to move
            <br />
            <span>your cargo?</span>
          </h2>

          <p className="cta-description">
            Start your shipment with SeaTrack and manage your cargo,
            quotes, payments and tracking through one connected
            maritime logistics platform.
          </p>

          <div className="cta-actions">
            <a href="/register" className="cta-primary">
              Start Shipping
              <span>→</span>
            </a>

            <a href="#tracking" className="cta-secondary">
              Track Shipment
              <span>→</span>
            </a>
          </div>

          <div className="cta-features">
            <div>
              <span className="cta-check">✓</span>
              <p>Global Network</p>
            </div>

            <div>
              <span className="cta-check">✓</span>
              <p>Secure Shipping</p>
            </div>

            <div>
              <span className="cta-check">✓</span>
              <p>Real-Time Tracking</p>
            </div>
          </div>
        </div>

        <div className="cta-visual">

          <div className="cta-circle cta-circle-one"></div>
          <div className="cta-circle cta-circle-two"></div>
          <div className="cta-circle cta-circle-three"></div>

          <div className="cta-network-label">
            SEATRACK GLOBAL NETWORK
          </div>

          <div className="cta-route">

            <div className="cta-port">
              <span className="cta-port-dot"></span>

              <div>
                <small>ORIGIN</small>
                <strong>Baku</strong>
              </div>
            </div>

            <div className="cta-route-line">
              <span className="cta-ship">◆</span>
            </div>

            <div className="cta-port cta-port-destination">
              <span className="cta-port-dot"></span>

              <div>
                <small>DESTINATION</small>
                <strong>Global Ports</strong>
              </div>
            </div>

          </div>

          <div className="cta-mini-card">
            <span>GLOBAL MARITIME LOGISTICS</span>

            <strong>
              Connected across
              <br />
              international trade routes.
            </strong>

            <p>
              Reliable shipping. Transparent operations.
            </p>
          </div>

          <div className="cta-status">
            <span></span>
            Network Online
          </div>

        </div>

      </div>
    </section>
  )
}

export default CallToAction