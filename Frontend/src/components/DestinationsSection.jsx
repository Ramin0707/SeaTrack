import './DestinationsSection.css'

import bakuAktauImage from '../assets/images/baku-aktau-route.jpg'
import bakuIstanbulImage from '../assets/images/baku-istanbul-route.jpg'
import bakuDubaiImage from '../assets/images/baku-dubai-route.jpg'
import bakuSingaporeImage from '../assets/images/baku-singapore-route.jpg'


const API_URL = 'https://localhost:44328'


function resolveImageUrl(imageUrl, fallbackImage) {
  if (!imageUrl) {
    return fallbackImage
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
  ) {
    return imageUrl
  }

  if (imageUrl.startsWith('/uploads/')) {
    return `${API_URL}${imageUrl}`
  }

  return imageUrl
}


function DestinationsSection({
  content = null,
}) {

  const defaultDestinations = [
    {
      code: '01',
      region: 'CASPIAN SEA',
      title: 'Baku → Aktau',
      description:
        'Fast and reliable maritime connection between Azerbaijan and Kazakhstan across the Caspian Sea.',
      ports: 'Baku Port • Aktau Port',
      image: bakuAktauImage,
      linkUrl: '#destinations',
    },
    {
      code: '02',
      region: 'BLACK SEA',
      title: 'Baku → Istanbul',
      description:
        'Integrated maritime logistics connecting the Caspian region with one of Europe’s major trade gateways.',
      ports: 'Azerbaijan • Türkiye',
      image: bakuIstanbulImage,
      linkUrl: '#destinations',
    },
    {
      code: '03',
      region: 'MIDDLE EAST',
      title: 'Baku → Dubai',
      description:
        'Flexible cargo solutions connecting regional businesses with major Middle Eastern logistics hubs.',
      ports: 'Azerbaijan • UAE',
      image: bakuDubaiImage,
      linkUrl: '#destinations',
    },
    {
      code: '04',
      region: 'ASIA',
      title: 'Baku → Singapore',
      description:
        'Long-distance international freight solutions connecting the Caspian region with Asian trade networks.',
      ports: 'Azerbaijan • Singapore',
      image: bakuSingaporeImage,
      linkUrl: '#destinations',
    },
  ]


  const label =
    content?.label ||
    'OUR DESTINATIONS'


  const title =
    content?.title ||
    'Trade Without'


  const highlightedTitle =
    content?.highlightedTitle ||
    content?.subtitle ||
    'Borders.'


  const description =
    content?.description ||
    'SeaTrack connects strategic ports and maritime trade routes, helping businesses move cargo efficiently across regions and international markets.'


  const linkText =
    content?.linkText ||
    content?.buttonText ||
    'Explore all routes'


  const linkUrl =
    content?.linkUrl ||
    content?.buttonUrl ||
    '#destinations'


  const cmsDestinations =
    Array.isArray(content?.destinations) &&
    content.destinations.length > 0
      ? content.destinations
      : Array.isArray(content?.routes) &&
          content.routes.length > 0
        ? content.routes
        : defaultDestinations


  const destinations = cmsDestinations.map(
    (destination, index) => {

      const fallback =
        defaultDestinations[index] || {
          code: String(index + 1).padStart(2, '0'),
          region: '',
          title: '',
          description: '',
          ports: '',
          image: bakuAktauImage,
          linkUrl: '#destinations',
        }


      return {
        code:
          destination?.code ||
          destination?.number ||
          fallback.code ||
          String(index + 1).padStart(2, '0'),

        region:
          destination?.region ||
          fallback.region,

        title:
          destination?.title ||
          destination?.route ||
          fallback.title,

        description:
          destination?.description ||
          destination?.text ||
          fallback.description,

        ports:
          destination?.ports ||
          destination?.portNames ||
          fallback.ports,

        image: resolveImageUrl(
          destination?.imageUrl ||
          destination?.image,
          fallback.image
        ),

        linkUrl:
          destination?.linkUrl ||
          destination?.url ||
          fallback.linkUrl ||
          '#destinations',
      }
    }
  )


  return (
    <section
      className="destinations-section"
      id="destinations"
    >
      <div className="destinations-container">

        <div className="destinations-heading">

          <div className="destinations-heading-left">

            <span className="destinations-label">
              {label}
            </span>


            <h2>
              {title}

              <br />

              <span>
                {highlightedTitle}
              </span>
            </h2>

          </div>


          <div className="destinations-intro">

            <p>
              {description}
            </p>


            <a href={linkUrl}>
              {linkText}

              <span>
                →
              </span>
            </a>

          </div>

        </div>


        <div className="destinations-grid">

          {destinations.map((destination, index) => (
            <article
              className="destination-card"
              key={`${destination.code}-${index}`}
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
                    href={destination.linkUrl}
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