import './GlobalNetwork.css'
import networkMap from '../assets/images/global-network-map.png'


const API_URL = 'https://localhost:44328'


function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return networkMap
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
  ) {
    return imageUrl
  }

  return `${API_URL}${imageUrl}`
}


function GlobalNetwork({
  content = null,
  imageUrl = null,
}) {

  const defaultStats = [
    {
      value: '120+',
      label: 'Global Ports',
    },
    {
      value: '35+',
      label: 'Shipping Routes',
    },
    {
      value: '24/7',
      label: 'Global Tracking',
    },
  ]


  const defaultLocations = [
    {
      name: 'Baku',
      country: 'Azerbaijan',
      className: 'location-baku',
      orange: false,
    },
    {
      name: 'Istanbul',
      country: 'Türkiye',
      className: 'location-istanbul',
      orange: false,
    },
    {
      name: 'Dubai',
      country: 'UAE',
      className: 'location-dubai',
      orange: true,
    },
    {
      name: 'Singapore',
      country: 'Asia',
      className: 'location-singapore',
      orange: true,
    },
  ]


  const label =
    content?.label ||
    'OUR GLOBAL NETWORK'


  const title =
    content?.title ||
    'Connecting ports'


  const highlightedTitle =
    content?.highlightedTitle ||
    content?.subtitle ||
    'across the world.'


  const description =
    content?.description ||
    'SeaTrack connects major maritime routes, ports and logistics operations through one powerful platform built for modern global trade.'


  const linkText =
    content?.linkText ||
    content?.buttonText ||
    'Explore our network'


  const linkUrl =
    content?.linkUrl ||
    content?.buttonUrl ||
    '#routes'


  const stats =
    Array.isArray(content?.stats) &&
    content.stats.length > 0
      ? content.stats
      : defaultStats


  const locations =
    Array.isArray(content?.locations) &&
    content.locations.length > 0
      ? content.locations
      : defaultLocations


  const bottomLabel =
    content?.bottomLabel ||
    'GLOBAL MARITIME NETWORK'


  const bottomTitle =
    content?.bottomTitle ||
    'Any Port. Any Route.'


  const mapImage =
    resolveImageUrl(imageUrl || content?.imageUrl)


  function getLocationClass(location, index) {
    if (location?.className) {
      return location.className
    }

    const fallbackLocation = defaultLocations[index]

    if (fallbackLocation) {
      return fallbackLocation.className
    }

    return ''
  }


  function isOrangeLocation(location, index) {
    if (typeof location?.orange === 'boolean') {
      return location.orange
    }

    const fallbackLocation = defaultLocations[index]

    return fallbackLocation?.orange || false
  }


  return (
    <section
      className="global-network"
      id="network"
    >

      <div className="global-network-container">


        {/* LEFT SIDE */}

        <div className="global-network-content">

          <span className="global-network-label">
            {label}
          </span>


          <h2>
            {title}

            <br />

            {highlightedTitle}
          </h2>


          <p>
            {description}
          </p>


          <a
            href={linkUrl}
            className="global-network-link"
          >
            {linkText}

            <span>
              →
            </span>
          </a>

        </div>


        {/* RIGHT SIDE — WORLD MAP */}

        <div className="global-network-visual">


          {/* STATS */}

          <div className="network-stats">

            {stats.map((stat, index) => (
              <div key={`${stat?.label || 'stat'}-${index}`}>

                <strong>
                  {stat?.value ||
                    defaultStats[index]?.value ||
                    ''}
                </strong>

                <span>
                  {stat?.label ||
                    defaultStats[index]?.label ||
                    ''}
                </span>

              </div>
            ))}

          </div>


          {/* MAP */}

          <div className="network-map">

            <img
              src={mapImage}
              alt={
                content?.imageAlt ||
                'SeaTrack global maritime network'
              }
              className="network-map-image"
            />


            <div className="network-map-overlay"></div>


            {locations.map((location, index) => {

              const fallback =
                defaultLocations[index] || {}

              const locationName =
                location?.name ||
                location?.city ||
                fallback.name ||
                ''


              const locationCountry =
                location?.country ||
                location?.region ||
                fallback.country ||
                ''


              const locationClass =
                getLocationClass(location, index)


              const orange =
                isOrangeLocation(location, index)


              return (
                <div
                  className={`network-location ${locationClass}`}
                  key={`${locationName}-${index}`}
                >

                  <span
                    className={
                      orange
                        ? 'network-dot orange'
                        : 'network-dot'
                    }
                  ></span>


                  <div className="network-location-info">

                    <strong>
                      {locationName}
                    </strong>

                    <small>
                      {locationCountry}
                    </small>

                  </div>

                </div>
              )
            })}

          </div>


          {/* BOTTOM INFO */}

          <div className="network-bottom">

            <span>
              {bottomLabel}
            </span>

            <strong>
              {bottomTitle}
            </strong>

          </div>

        </div>

      </div>

    </section>
  )
}


export default GlobalNetwork