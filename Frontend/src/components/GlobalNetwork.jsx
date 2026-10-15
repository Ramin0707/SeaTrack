import './GlobalNetwork.css'
import networkMap from '../assets/images/global-network-map.png'

function GlobalNetwork() {
  return (
    <section className="global-network" id="network">

      <div className="global-network-container">

        {/* LEFT SIDE */}

        <div className="global-network-content">

          <span className="global-network-label">
            OUR GLOBAL NETWORK
          </span>

          <h2>
            Connecting ports
            <br />
            across the world.
          </h2>

          <p>
            SeaTrack connects major maritime routes, ports and logistics
            operations through one powerful platform built for modern
            global trade.
          </p>

          <a href="#routes" className="global-network-link">
            Explore our network
            <span>→</span>
          </a>

        </div>


        {/* RIGHT SIDE — WORLD MAP */}

        <div className="global-network-visual">

          {/* STATS */}

          <div className="network-stats">

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
              <span>Global Tracking</span>
            </div>

          </div>


          {/* MAP */}

          <div className="network-map">

            <img
              src={networkMap}
              alt="SeaTrack global maritime network"
              className="network-map-image"
            />

            <div className="network-map-overlay"></div>


            {/* BAKU */}

            <div className="network-location location-baku">

              <span className="network-dot"></span>

              <div className="network-location-info">
                <strong>Baku</strong>
                <small>Azerbaijan</small>
              </div>

            </div>


            {/* ISTANBUL */}

            <div className="network-location location-istanbul">

              <span className="network-dot"></span>

              <div className="network-location-info">
                <strong>Istanbul</strong>
                <small>Türkiye</small>
              </div>

            </div>


            {/* DUBAI */}

            <div className="network-location location-dubai">

              <span className="network-dot orange"></span>

              <div className="network-location-info">
                <strong>Dubai</strong>
                <small>UAE</small>
              </div>

            </div>


            {/* SINGAPORE */}

            <div className="network-location location-singapore">

              <span className="network-dot orange"></span>

              <div className="network-location-info">
                <strong>Singapore</strong>
                <small>Asia</small>
              </div>

            </div>

          </div>


          {/* BOTTOM INFO */}

          <div className="network-bottom">

            <span>GLOBAL MARITIME NETWORK</span>

            <strong>
              Any Port. Any Route.
            </strong>

          </div>

        </div>

      </div>

    </section>
  )
}

export default GlobalNetwork