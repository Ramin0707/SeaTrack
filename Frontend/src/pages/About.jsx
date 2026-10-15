import './About.css'
import whoWeAreImage from '../assets/images/about-who-we-are.jpg'
import CallToAction from '../components/CallToAction'
function About() {
  return (
    <div className="about-page">

      {/* =====================================
          ABOUT HERO
      ====================================== */}

      <section className="about-hero">

        <div className="about-grid"></div>

        <span className="about-circle about-circle-one"></span>
        <span className="about-circle about-circle-two"></span>

        <div className="about-hero-container">

          <div className="about-hero-content">

            <span className="about-label">
              ABOUT SEATRACK
            </span>

            <h1>
              Maritime logistics.
              <br />
              <span>Connected differently.</span>
            </h1>

            <p>
              SeaTrack brings customers, cargo, ports, vessels and
              voyages together through one connected digital maritime
              logistics platform.
            </p>

            <div className="about-hero-actions">

              <a href="/services" className="about-primary-button">
                Explore Services
                <span>→</span>
              </a>

              <a href="/tracking" className="about-secondary-button">
                Track Shipment
                <span>→</span>
              </a>

            </div>

          </div>


          <div className="about-hero-visual">

            <div className="about-visual-header">

              <span>SEATRACK NETWORK</span>

              <div className="about-network-status">
                <i></i>
                CONNECTED
              </div>

            </div>


            <div className="about-visual-center">

              <div className="about-port about-port-left">
                <small>ORIGIN</small>
                <strong>Baku</strong>
                <span>Azerbaijan</span>
              </div>


              <div className="about-route">

                <span className="about-route-dot"></span>

                <div className="about-route-line">
                  <i></i>
                </div>

                <span className="about-route-dot"></span>

              </div>


              <div className="about-port about-port-right">
                <small>DESTINATION</small>
                <strong>Global</strong>
                <span>Maritime Network</span>
              </div>

            </div>


            <div className="about-network-stats">

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
                <span>Cargo Visibility</span>
              </div>

            </div>


            <div className="about-visual-footer">

              <span>
                DIGITAL MARITIME LOGISTICS
              </span>

              <strong>
                One platform. Every journey.
              </strong>

            </div>

          </div>

        </div>

      </section>
            {/* =====================================
    WHO WE ARE
====================================== */}

<section className="about-story">

  <div className="about-story-container">

    <div className="about-story-image">

      <img
        src={whoWeAreImage}
        alt="SeaTrack maritime logistics operations"
      />

      <div className="about-story-number">
        01
      </div>

      <div className="about-story-badge">
        <span></span>
        CONNECTING GLOBAL TRADE
      </div>

    </div>


    <div className="about-story-content">

      <span className="about-section-label">
        WHO WE ARE
      </span>

      <h2>
        Built to simplify
        <span> maritime logistics.</span>
      </h2>

      <p className="about-story-description">
        SeaTrack is a digital maritime logistics platform designed
        to connect customers, shipping operations, ports, vessels,
        containers and voyages through one transparent system.
      </p>

      <p className="about-story-description">
        From the first shipping request to final delivery, every
        important stage of the cargo journey can be organized,
        managed and tracked from one connected platform.
      </p>


      <div className="about-values">

        <div className="about-value">

          <span>01</span>

          <div>
            <h3>Our Mission</h3>

            <p>
              Make maritime transportation simpler, more transparent
              and easier to manage for customers and logistics teams.
            </p>
          </div>

        </div>


        <div className="about-value">

          <span>02</span>

          <div>
            <h3>Our Vision</h3>

            <p>
              Build a connected digital environment where cargo,
              ports, vessels and shipping operations work together
              seamlessly.
            </p>
          </div>

        </div>

      </div>

    </div>

  </div>

</section>
{/* =====================================
    OUR VALUES
====================================== */}

<section className="about-values-section">

  <div className="about-values-container">

    <div className="about-values-heading">

      <div>
        <span className="about-section-label">
          WHAT DRIVES US
        </span>

        <h2>
          Built around clarity.
          <span> Designed for movement.</span>
        </h2>
      </div>

      <p>
        SeaTrack is built around the principles that modern maritime
        logistics needs most — transparency, connectivity, reliability
        and complete shipment visibility.
      </p>

    </div>


    <div className="about-values-grid">

      <article className="about-value-card">

        <div className="about-value-card-top">
          <span>01</span>
          <i>↗</i>
        </div>

        <h3>Transparency</h3>

        <p>
          Clear shipment information and logistics progress
          throughout every stage of the cargo journey.
        </p>

      </article>


      <article className="about-value-card">

        <div className="about-value-card-top">
          <span>02</span>
          <i>↗</i>
        </div>

        <h3>Connectivity</h3>

        <p>
          Customers, ports, vessels, containers and operations
          connected through one digital platform.
        </p>

      </article>


      <article className="about-value-card">

        <div className="about-value-card-top">
          <span>03</span>
          <i>↗</i>
        </div>

        <h3>Reliability</h3>

        <p>
          Structured logistics workflows that keep every shipment
          organized from request to final delivery.
        </p>

      </article>


      <article className="about-value-card">

        <div className="about-value-card-top">
          <span>04</span>
          <i>↗</i>
        </div>

        <h3>Visibility</h3>

        <p>
          Easy access to shipment status, milestones and tracking
          information whenever customers need it.
        </p>

      </article>

    </div>


    <div className="about-values-stats">

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

      <div>
        <strong>01</strong>
        <span>Connected Platform</span>
      </div>

    </div>

  </div>

</section>

<CallToAction />
    </div>
  )
}

export default About