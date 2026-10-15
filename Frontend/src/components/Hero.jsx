import './Hero.css'
import heroPort from '../assets/images/hero-port.jpg'

function Hero() {
  return (
    <section
      className="hero"
      style={{
        '--hero-background': `url(${heroPort})`,
      }}
    >
      <div className="container hero-container">

        <div className="hero-content">

          <div className="hero-label">
            <span></span>
            GLOBAL MARITIME LOGISTICS
          </div>

          <h1>
            Connecting cargo.
            <br />
            <strong>Moving the world.</strong>
          </h1>

          <p className="hero-description">
            Manage your sea freight from quotation to final delivery.
            Track shipments, containers and voyages through one powerful
            maritime logistics platform.
          </p>

          <div className="hero-actions">

            <a
              href="/register"
              className="hero-primary-button"
            >
              Start Shipping
              <span>→</span>
            </a>

            <a
              href="/tracking"
              className="hero-secondary-button"
            >
              Track Shipment
              <span>→</span>
            </a>

          </div>

          <div className="hero-stats">

            <div>
              <strong>120+</strong>
              <span>Global Ports</span>
            </div>

            <div>
              <strong>35+</strong>
              <span>Shipping Routes</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Shipment Tracking</span>
            </div>

          </div>

        </div>


        <div className="hero-visual">

          <div className="shipment-card">

            <span className="shipment-label">
              LIVE SHIPMENT
            </span>

            <h3>
              Baku → Aktau
            </h3>

            <p>
              Voyage ST-2026-001
            </p>

            <div className="route-line">

              <span className="route-point"></span>

              <span className="route-progress"></span>

              <span className="route-point"></span>

            </div>

            <div className="route-cities">

              <strong>Baku</strong>

              <strong>Aktau</strong>

            </div>

            <span className="shipment-status">
              In Transit
            </span>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Hero