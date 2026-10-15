import './Services.css'

import seaFreightImage from '../assets/images/services-sea-freight.jpg'
import containerShippingImage from '../assets/images/services-container-shipping.jpg'
import routeVoyageImage from '../assets/images/services-route-voyage.jpg'
import realTimeTrackingImage from '../assets/images/services-real-time-tracking.jpg'
import CallToAction from '../components/CallToAction'

function Services() {
  return (
    <div className="services-page">

      {/* =====================================
          SERVICES HERO
      ====================================== */}

      <section className="services-page-hero">

        <div className="services-hero-bg">
          <span className="services-hero-circle circle-one"></span>
          <span className="services-hero-circle circle-two"></span>
          <span className="services-hero-circle circle-three"></span>
        </div>


        <div className="services-hero-container">

          <div className="services-hero-content">

            <span className="services-page-label">
              OUR SERVICES
            </span>

            <h1>
              Maritime logistics
              <br />
              <span>built for global trade.</span>
            </h1>

            <p className="services-hero-description">
              From sea freight and container shipping to route planning
              and real-time tracking, SeaTrack connects every stage of
              your cargo journey through one digital logistics platform.
            </p>


            <div className="services-hero-stats">

              <div className="services-hero-stat">
                <strong>120+</strong>
                <span>Global Ports</span>
              </div>

              <div className="services-hero-stat">
                <strong>35+</strong>
                <span>Shipping Routes</span>
              </div>

              <div className="services-hero-stat">
                <strong>24/7</strong>
                <span>Cargo Visibility</span>
              </div>

            </div>

          </div>


          <div className="services-hero-index">

            <span className="services-index-title">
              OUR CAPABILITIES
            </span>


            <div className="services-index-item">
              <span>01</span>
              <p>Sea Freight</p>
            </div>


            <div className="services-index-item">
              <span>02</span>
              <p>Container Shipping</p>
            </div>


            <div className="services-index-item">
              <span>03</span>
              <p>Route &amp; Voyage Planning</p>
            </div>


            <div className="services-index-item">
              <span>04</span>
              <p>Real-Time Tracking</p>
            </div>

          </div>

        </div>


        <div className="services-scroll-indicator">
          <span></span>
          Explore Services
        </div>

      </section>


      {/* =====================================
          01 — SEA FREIGHT
      ====================================== */}

      <section className="service-detail service-detail-sea">

        <div className="service-detail-container">

          <div className="service-detail-image">

            <img
              src={seaFreightImage}
              alt="Sea freight container ship"
            />

            <div className="service-image-number">
              01
            </div>

            <div className="service-image-badge">
              <span></span>
              GLOBAL SEA FREIGHT
            </div>

          </div>


          <div className="service-detail-content">

            <span className="service-detail-label">
              01 / SEA FREIGHT
            </span>

            <h2>
              Reliable cargo transport
              <span> across global waters.</span>
            </h2>

            <p className="service-detail-description">
              SeaTrack connects your cargo with reliable maritime
              routes, vessels and ports while keeping every stage
              of the shipping process transparent and organized.
            </p>


            <div className="service-benefits">

              <div className="service-benefit">

                <span>01</span>

                <div>
                  <h3>Port-to-Port Shipping</h3>

                  <p>
                    Reliable maritime transportation between
                    international ports and major trade hubs.
                  </p>
                </div>

              </div>


              <div className="service-benefit">

                <span>02</span>

                <div>
                  <h3>Flexible Cargo Solutions</h3>

                  <p>
                    Shipping solutions adapted to cargo type,
                    weight, volume and required container.
                  </p>
                </div>

              </div>


              <div className="service-benefit">

                <span>03</span>

                <div>
                  <h3>Transparent Operations</h3>

                  <p>
                    Follow quotations, shipment status and logistics
                    progress through one connected platform.
                  </p>
                </div>

              </div>

            </div>


            <a
              href="/register"
              className="service-detail-button"
            >
              Request a Quote
              <span>→</span>
            </a>

          </div>

        </div>

      </section>


      {/* =====================================
          02 — CONTAINER SHIPPING
      ====================================== */}

      <section className="service-detail service-detail-container-shipping">

        <div className="service-detail-container service-detail-reverse">

          <div className="service-detail-content">

            <span className="service-detail-label">
              02 / CONTAINER SHIPPING
            </span>

            <h2>
              The right container
              <span> for every cargo.</span>
            </h2>

            <p className="service-detail-description">
              SeaTrack simplifies container planning and assignment,
              helping your cargo move efficiently from port to port
              with the right equipment for every shipment.
            </p>


            <div className="service-benefits">

              <div className="service-benefit">

                <span>01</span>

                <div>
                  <h3>Container Selection</h3>

                  <p>
                    Choose the appropriate container type based on
                    cargo weight, volume and transportation requirements.
                  </p>
                </div>

              </div>


              <div className="service-benefit">

                <span>02</span>

                <div>
                  <h3>Smart Assignment</h3>

                  <p>
                    Containers are assigned to confirmed shipping
                    orders and connected with the appropriate voyage.
                  </p>
                </div>

              </div>


              <div className="service-benefit">

                <span>03</span>

                <div>
                  <h3>Capacity Management</h3>

                  <p>
                    Keep container availability, status and cargo
                    capacity organized throughout maritime operations.
                  </p>
                </div>

              </div>

            </div>


            <a
              href="/register"
              className="service-detail-button"
            >
              Start Shipping
              <span>→</span>
            </a>

          </div>


          <div className="service-detail-image">

            <img
              src={containerShippingImage}
              alt="Container shipping terminal"
            />

            <div className="service-image-number">
              02
            </div>

            <div className="service-image-badge">
              <span></span>
              CONTAINER OPERATIONS
            </div>

          </div>

        </div>

      </section>
          {
          /* =====================================
           03 — ROUTE & VOYAGE PLANNING
              ====================================== */}

<section className="service-detail service-detail-route">

  <div className="service-detail-container">

    <div className="service-detail-image">

      <img
        src={routeVoyageImage}
        alt="Maritime route and voyage planning"
      />

      <div className="service-image-number">
        03
      </div>

      <div className="service-image-badge">
        <span></span>
        ROUTE &amp; VOYAGE PLANNING
      </div>

    </div>


    <div className="service-detail-content">

      <span className="service-detail-label">
        03 / ROUTE &amp; VOYAGE PLANNING
      </span>

      <h2>
        Smarter routes for
        <span> every voyage.</span>
      </h2>

      <p className="service-detail-description">
        SeaTrack connects ports, vessels and shipping routes
        to help organize every voyage from departure to arrival
        through one coordinated maritime logistics platform.
      </p>


      <div className="service-benefits">

        <div className="service-benefit">

          <span>01</span>

          <div>
            <h3>Optimized Shipping Routes</h3>

            <p>
              Plan maritime routes between origin and destination
              ports using organized voyage information.
            </p>
          </div>

        </div>


        <div className="service-benefit">

          <span>02</span>

          <div>
            <h3>Vessel &amp; Voyage Coordination</h3>

            <p>
              Connect vessels, routes and voyage schedules with
              confirmed cargo shipments.
            </p>
          </div>

        </div>


        <div className="service-benefit">

          <span>03</span>

          <div>
            <h3>Port Call Planning</h3>

            <p>
              Coordinate terminals, berths, arrival times and
              departure schedules throughout the voyage.
            </p>
          </div>

        </div>

      </div>


      <a
        href="/register"
        className="service-detail-button"
      >
        Plan Your Shipment
        <span>→</span>
      </a>

    </div>

  </div>

</section>
{/* =====================================
    04 — REAL-TIME TRACKING
====================================== */}

<section className="service-detail service-detail-tracking">

  <div className="service-detail-container service-detail-reverse">

    <div className="service-detail-content">

      <span className="service-detail-label">
        04 / REAL-TIME TRACKING
      </span>

      <h2>
        Your shipment.
        <span> Always in sight.</span>
      </h2>

      <p className="service-detail-description">
        SeaTrack gives customers clear visibility into every stage
        of the maritime journey, from cargo preparation and departure
        to arrival and final delivery.
      </p>


      <div className="service-benefits">

        <div className="service-benefit">

          <span>01</span>

          <div>
            <h3>Live Shipment Status</h3>

            <p>
              Check the current status of your shipment using
              a unique SeaTrack tracking number.
            </p>
          </div>

        </div>


        <div className="service-benefit">

          <span>02</span>

          <div>
            <h3>Complete Cargo Timeline</h3>

            <p>
              Follow every logistics stage including loaded,
              departed, in transit, arrived, unloaded and delivered.
            </p>
          </div>

        </div>


        <div className="service-benefit">

          <span>03</span>

          <div>
            <h3>Transparent Journey</h3>

            <p>
              View shipment progress, origin and destination
              information through one connected tracking platform.
            </p>
          </div>

        </div>

      </div>


      <a
        href="/tracking"
        className="service-detail-button"
      >
        Track Shipment
        <span>→</span>
      </a>

    </div>


    <div className="service-detail-image">

      <img
        src={realTimeTrackingImage}
        alt="Real-time maritime shipment tracking"
      />

      <div className="service-image-number">
        04
      </div>

      <div className="service-image-badge">
        <span></span>
        REAL-TIME TRACKING
      </div>

    </div>

  </div>

</section>

<CallToAction />
    </div>
  )
}

export default Services