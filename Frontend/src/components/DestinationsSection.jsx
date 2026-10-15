import './DestinationsSection.css'

import bakuAktauImage from '../assets/images/baku-aktau-route.jpg'
import bakuIstanbulImage from '../assets/images/baku-istanbul-route.jpg'
import bakuDubaiImage from '../assets/images/baku-dubai-route.jpg'
import bakuSingaporeImage from '../assets/images/baku-singapore-route.jpg'

function DestinationsSection() {
  const destinations = [
    {
      code: '01',
      region: 'CASPIAN SEA',
      title: 'Baku → Aktau',
      description:
        'Fast and reliable maritime connection between Azerbaijan and Kazakhstan across the Caspian Sea.',
      ports: 'Baku Port • Aktau Port',
      image: bakuAktauImage,
    },
    {
      code: '02',
      region: 'BLACK SEA',
      title: 'Baku → Istanbul',
      description:
        'Integrated maritime logistics connecting the Caspian region with one of Europe’s major trade gateways.',
      ports: 'Azerbaijan • Türkiye',
      image: bakuIstanbulImage,
    },
    {
      code: '03',
      region: 'MIDDLE EAST',
      title: 'Baku → Dubai',
      description:
        'Flexible cargo solutions connecting regional businesses with major Middle Eastern logistics hubs.',
      ports: 'Azerbaijan • UAE',
      image: bakuDubaiImage,
    },
    {
      code: '04',
      region: 'ASIA',
      title: 'Baku → Singapore',
      description:
        'Long-distance international freight solutions connecting the Caspian region with Asian trade networks.',
      ports: 'Azerbaijan • Singapore',
      image: bakuSingaporeImage,
    },
  ]

  return (
    <section className="destinations-section" id="destinations">
      <div className="destinations-container">

        <div className="destinations-heading">
          <div className="destinations-heading-left">
            <span className="destinations-label">
              OUR DESTINATIONS
            </span>

            <h2>
              Trade Without
              <br />
              <span>Borders.</span>
            </h2>
          </div>

          <div className="destinations-intro">
            <p>
              SeaTrack connects strategic ports and maritime trade routes,
              helping businesses move cargo efficiently across regions and
              international markets.
            </p>

            <a href="#destinations">
              Explore all routes
              <span>→</span>
            </a>
          </div>
        </div>

        <div className="destinations-grid">

          {destinations.map((destination) => (
            <article
              className="destination-card"
              key={destination.code}
            >

              {/* IMAGE */}
              <div className="destination-image">
                <img
                  src={destination.image}
                  alt={`${destination.title} maritime shipping route`}
                />

                <div className="destination-image-overlay"></div>
              </div>

              {/* CARD CONTENT */}
              <div className="destination-card-content">

                <div className="destination-card-top">
                  <span className="destination-code">
                    {destination.code}
                  </span>

                  <span className="destination-region">
                    {destination.region}
                  </span>
                </div>

                <div className="destination-route-icon">
                  <span></span>
                  <i></i>
                  <span></span>
                </div>

                <h3>
                  {destination.title}
                </h3>

                <p>
                  {destination.description}
                </p>

                <div className="destination-footer">

                  <span>
                    {destination.ports}
                  </span>

                  <a
                    href="#destinations"
                    aria-label={`View ${destination.title}`}
                  >
                    →
                  </a>

                </div>

              </div>

            </article>
          ))}

        </div>

      </div>
    </section>
  )
}

export default DestinationsSection