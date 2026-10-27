import { useEffect, useState } from 'react'
import './About.css'

const API_URL = 'https://localhost:44328'

function About() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // =========================================================
  // LOAD ABOUT PAGE FROM CMS
  // =========================================================

  useEffect(() => {
    const loadAbout = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_URL}/api/about`)

        if (!response.ok) {
          throw new Error(
            `Failed to load About page: ${response.status}`
          )
        }

        const data = await response.json()
        setAboutData(data)
      } catch (error) {
        console.error('About page loading error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadAbout()
  }, [])

  // =========================================================
  // CMS HELPERS
  // =========================================================

  const getSection = (sectionType) => {
    const section = aboutData?.sections?.find(
      (item) => item.sectionType === sectionType
    )

    if (!section) {
      return null
    }

    try {
      return {
        ...section,
        content: JSON.parse(section.contentJson || '{}')
      }
    } catch (error) {
      console.error(
        `Failed to parse ${sectionType} contentJson:`,
        error
      )

      return {
        ...section,
        content: {}
      }
    }
  }

  const resolveImageUrl = (
    imageUrl,
    fallbackImage = null
  ) => {
    if (!imageUrl) {
      return fallbackImage
    }

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://')
    ) {
      return imageUrl
    }

    return `${API_URL}${imageUrl}`
  }

  // =========================================================
  // CMS SECTIONS
  // =========================================================

  const hero = getSection('Hero')
  const ourStory = getSection('OurStory')
  const mission = getSection('Mission')
  const values = getSection('Values')
  const globalNetwork = getSection('GlobalNetwork')
  const callToAction = getSection('CallToAction')

  // =========================================================
  // VALUES
  // =========================================================

  const defaultValues = [
    {
      number: '01',
      title: 'Transparency',
      description:
        'Clear information and real-time visibility across every stage of the shipping journey.'
    },
    {
      number: '02',
      title: 'Reliability',
      description:
        'Technology and workflows designed to support dependable maritime operations.'
    },
    {
      number: '03',
      title: 'Innovation',
      description:
        'Continuous improvement through smarter digital tools and connected logistics.'
    },
    {
      number: '04',
      title: 'Collaboration',
      description:
        'Bringing customers, operators and logistics partners together on one platform.'
    }
  ]

  const valuesItems =
    values?.content?.items?.length > 0
      ? values.content.items
      : defaultValues

  // =========================================================
  // GLOBAL NETWORK STATS
  // =========================================================

  const defaultStats = [
    {
      value: '120+',
      label: 'Global Ports'
    },
    {
      value: '35+',
      label: 'Shipping Routes'
    },
    {
      value: '24/7',
      label: 'Cargo Visibility'
    }
  ]

  const networkStats =
    globalNetwork?.content?.stats?.length > 0
      ? globalNetwork.content.stats
      : defaultStats

  // =========================================================
  // IMAGES
  // =========================================================

  const heroImage = resolveImageUrl(hero?.imageUrl)

  const storyImage = resolveImageUrl(
    ourStory?.imageUrl
  )

  const missionImage = resolveImageUrl(
    mission?.imageUrl
  )

  /*
    Global Network:
    1. If CMS has an image -> use CMS image.
    2. Otherwise -> use our default generated image.
  */
  const globalNetworkImage = resolveImageUrl(
    globalNetwork?.imageUrl,
    `${API_URL}/uploads/cms/default/about-global-network.png`
  )

  const ctaImage = resolveImageUrl(
    callToAction?.imageUrl
  )

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="about-page">
        <section className="about-loading">
          <span>SEATRACK</span>
          <h1>Loading About page...</h1>
        </section>
      </main>
    )
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <main className="about-page">
        <section className="about-loading">
          <span>SEATRACK</span>
          <h1>Unable to load About page.</h1>
          <p>{error}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="about-page">

      {/* =====================================================
          01 — HERO
      ====================================================== */}

      {hero && (
        <section
          className="about-hero"
          style={
            heroImage
              ? {
                  backgroundImage: `
                    linear-gradient(
                      rgba(2, 24, 35, 0.86),
                      rgba(2, 24, 35, 0.94)
                    ),
                    url("${heroImage}")
                  `
                }
              : undefined
          }
        >
          <div className="about-grid"></div>

          <span className="about-circle about-circle-one"></span>
          <span className="about-circle about-circle-two"></span>

          <div className="about-hero-container">

            <div className="about-hero-content">

              <span className="about-label">
                {hero.content?.label || 'ABOUT SEATRACK'}
              </span>

              <h1>
                {hero.content?.title || 'Moving global trade'}
                <br />

                <span>
                  {hero.content?.highlightedTitle ||
                    'with smarter maritime technology.'}
                </span>
              </h1>

              <p>
                {hero.content?.description ||
                  'SeaTrack connects maritime logistics, cargo operations and real-time visibility in one intelligent digital platform.'}
              </p>

              <div className="about-hero-actions">

                <a
                  href="/services"
                  className="about-primary-button"
                >
                  Explore Services
                  <span>→</span>
                </a>

                <a
                  href="/tracking"
                  className="about-secondary-button"
                >
                  Track Shipment
                  <span>→</span>
                </a>

              </div>

            </div>

            <div className="about-hero-visual">

              <div className="about-visual-header">

                <span>
                  SEATRACK NETWORK
                </span>

                <div className="about-network-status">
                  <i></i>
                  CONNECTED
                </div>

              </div>

              <div className="about-visual-center">

                <div className="about-port about-port-left">
                  <small>ORIGIN</small>
                  <strong>Port</strong>
                  <span>Global Network</span>
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

                {networkStats
                  .slice(0, 3)
                  .map((stat, index) => (
                    <div
                      key={`${stat.label}-${index}`}
                    >
                      <strong>
                        {stat.value}
                      </strong>

                      <span>
                        {stat.label}
                      </span>
                    </div>
                  ))}

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
      )}

      {/* =====================================================
          02 — OUR STORY
      ====================================================== */}

      {ourStory && (
        <section className="about-story">

          <div className="about-story-container">

            <div className="about-story-image">

              {storyImage ? (
                <img
                  src={storyImage}
                  alt="SeaTrack maritime logistics operations"
                />
              ) : (
                <div className="about-image-placeholder">
                  <span>SEATRACK</span>
                  <strong>
                    Maritime Logistics
                  </strong>
                </div>
              )}

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
                {ourStory.content?.label || 'OUR STORY'}
              </span>

              <h2>
                {ourStory.content?.title ||
                  'Built around the future'}

                {' '}

                <span>
                  {ourStory.content?.highlightedTitle ||
                    'of maritime logistics.'}
                </span>
              </h2>

              <p className="about-story-description">
                {ourStory.content?.description ||
                  'SeaTrack was created to simplify complex shipping operations by bringing cargo management, voyage coordination and real-time visibility into one connected digital platform.'}
              </p>

              <div className="about-story-feature">

                <span>01</span>

                <div>
                  <strong>
                    Connected Operations
                  </strong>

                  <p>
                    Cargo, routes, customers, ports and
                    logistics operations connected through
                    one digital environment.
                  </p>
                </div>

              </div>

              <div className="about-story-feature">

                <span>02</span>

                <div>
                  <strong>
                    Complete Visibility
                  </strong>

                  <p>
                    Important shipment information available
                    throughout every stage of the maritime
                    journey.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          03 — MISSION
      ====================================================== */}

      {mission && (
        <section className="about-mission">

          <div className="about-mission-container">

            <div className="about-mission-content">

              <span className="about-section-number">
                02
              </span>

              <span className="about-section-label">
                {mission.content?.label || 'OUR MISSION'}
              </span>

              <h2>
                {mission.content?.title ||
                  'Simplifying maritime logistics'}

                {' '}

                <span>
                  {mission.content?.highlightedTitle ||
                    'from port to destination.'}
                </span>
              </h2>

              <p>
                {mission.content?.description ||
                  'Our mission is to make global shipping simpler, more transparent and easier to manage by connecting cargo operations, voyage planning and real-time information in one digital platform.'}
              </p>

              <div className="about-mission-points">

                <div>
                  <span>01</span>

                  <strong>
                    Simplify Operations
                  </strong>

                  <p>
                    Bring complex maritime workflows together
                    in one organized platform.
                  </p>
                </div>

                <div>
                  <span>02</span>

                  <strong>
                    Improve Visibility
                  </strong>

                  <p>
                    Give customers and logistics teams clearer
                    information across every shipment.
                  </p>
                </div>

                <div>
                  <span>03</span>

                  <strong>
                    Connect Logistics
                  </strong>

                  <p>
                    Connect cargo, voyages, ports and
                    operations through modern digital
                    technology.
                  </p>
                </div>

              </div>

            </div>

            <div className="about-mission-visual">

              {missionImage ? (
                <img
                  src={missionImage}
                  alt="SeaTrack mission"
                />
              ) : (
                <div className="about-mission-panel">

                  <span>
                    OUR MISSION
                  </span>

                  <strong>
                    SMARTER
                  </strong>

                  <strong>
                    MARITIME
                  </strong>

                  <strong>
                    LOGISTICS
                  </strong>

                  <div>

                    <small>
                      CONNECT
                    </small>

                    <i></i>

                    <small>
                      MOVE
                    </small>

                    <i></i>

                    <small>
                      TRACK
                    </small>

                  </div>

                </div>
              )}

            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          04 — VALUES
      ====================================================== */}

      {values && (
        <section className="about-values-section">

          <div className="about-values-container">

            <div className="about-values-heading">

              <div>

                <span className="about-section-number">
                  03
                </span>

                <span className="about-section-label">
                  {values.content?.label || 'OUR VALUES'}
                </span>

                <h2>
                  {values.content?.title ||
                    'Built on clarity, reliability'}

                  {' '}

                  <span>
                    {values.content?.highlightedTitle ||
                      'and continuous innovation.'}
                  </span>
                </h2>

              </div>

              <p>
                {values.content?.description ||
                  'The principles behind SeaTrack guide how we build technology, support maritime operations and connect the people moving global trade.'}
              </p>

            </div>

            <div className="about-values-grid">

              {valuesItems.map((item, index) => (
                <article
                  className="about-value-card"
                  key={`${item.title}-${index}`}
                >

                  <div className="about-value-card-top">

                    <span>
                      {item.number ||
                        String(index + 1).padStart(2, '0')}
                    </span>

                    <i>↗</i>

                  </div>

                  <h3>
                    {item.title}
                  </h3>

                  <p>
                    {item.description}
                  </p>

                </article>
              ))}

            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          05 — GLOBAL NETWORK
      ====================================================== */}

      {globalNetwork && (
        <section className="about-global-network">

          <div className="about-global-network-container">

            <div className="about-global-network-heading">

              <div>

                <span className="about-section-number">
                  04
                </span>

                <span className="about-section-label">
                  {globalNetwork.content?.label ||
                    'GLOBAL NETWORK'}
                </span>

                <h2>
                  {globalNetwork.content?.title ||
                    'Connected across'}

                  {' '}

                  <span>
                    {globalNetwork.content?.highlightedTitle ||
                      "the world's major trade routes."}
                  </span>
                </h2>

              </div>

              <p>
                {globalNetwork.content?.description ||
                  'SeaTrack brings ports, routes and maritime operations into one connected logistics network built for global trade.'}
              </p>

            </div>

            {/* ===============================================
                GLOBAL NETWORK IMAGE
                CMS image has priority.
                If CMS has no image, use our generated map.
            ================================================ */}

            <div className="about-global-network-visual">

              <img
                src={globalNetworkImage}
                alt="SeaTrack Global Maritime Network"
                className="about-global-network-image"
              />

              <div className="about-global-network-image-overlay"></div>

              <div className="about-global-network-live">

                <span className="about-global-network-live-dot"></span>

                GLOBAL NETWORK ONLINE

              </div>

            </div>

            {/* ===============================================
                DYNAMIC CMS STATISTICS
            ================================================ */}

            <div className="about-global-stats">

              {networkStats
                .slice(0, 3)
                .map((stat, index) => (
                  <div
                    key={`${stat.label}-${index}`}
                  >

                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <strong>
                      {stat.value}
                    </strong>

                    <p>
                      {stat.label}
                    </p>

                  </div>
                ))}

              <div>

                <span>
                  04
                </span>

                <strong>
                  01
                </strong>

                <p>
                  Connected Platform
                </p>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          06 — CALL TO ACTION
      ====================================================== */}

      {callToAction && (
        <section
          className="about-cta"
          style={
            ctaImage
              ? {
                  backgroundImage: `
                    linear-gradient(
                      rgba(3, 29, 41, 0.9),
                      rgba(3, 29, 41, 0.96)
                    ),
                    url("${ctaImage}")
                  `
                }
              : undefined
          }
        >

          <div className="about-cta-grid"></div>

          <div className="about-cta-container">

            <span className="about-section-number">
              05
            </span>

            <span className="about-section-label">
              {callToAction.content?.label ||
                "LET'S MOVE FORWARD"}
            </span>

            <h2>
              {callToAction.content?.title ||
                'Ready to simplify'}

              {' '}

              <span>
                {callToAction.content?.highlightedTitle ||
                  'your maritime logistics?'}
              </span>
            </h2>

            <p>
              {callToAction.content?.description ||
                'Join SeaTrack and manage your shipping operations, cargo visibility and logistics workflows through one connected platform.'}
            </p>

            <div className="about-cta-actions">

              <a
                href={
                  callToAction.content?.primaryButtonUrl ||
                  '/register'
                }
                className="about-primary-button"
              >
                {callToAction.content?.primaryButtonText ||
                  'Get Started'}

                <span>→</span>
              </a>

              <a
                href={
                  callToAction.content?.secondaryButtonUrl ||
                  '/services'
                }
                className="about-secondary-button"
              >
                {callToAction.content?.secondaryButtonText ||
                  'Explore Services'}

                <span>→</span>
              </a>

            </div>

          </div>

        </section>
      )}

    </main>
  )
}

export default About