import './CallToAction.css'


function CallToAction({
  content = null,
}) {

  const defaultFeatures = [
    'Global Network',
    'Secure Shipping',
    'Real-Time Tracking',
  ]


  const label =
    content?.label ||
    'READY TO SHIP?'


  const title =
    content?.title ||
    'Ready to move'


  const highlightedTitle =
    content?.highlightedTitle ||
    content?.subtitle ||
    'your cargo?'


  const description =
    content?.description ||
    'Start your shipment with SeaTrack and manage your cargo, quotes, payments and tracking through one connected maritime logistics platform.'


  const primaryButtonText =
    content?.primaryButtonText ||
    content?.buttonText ||
    'Start Shipping'


  const primaryButtonUrl =
    content?.primaryButtonUrl ||
    content?.buttonUrl ||
    '/register'


  const secondaryButtonText =
    content?.secondaryButtonText ||
    'Track Shipment'


  const secondaryButtonUrl =
    content?.secondaryButtonUrl ||
    '#tracking'


  const features =
    Array.isArray(content?.features) &&
    content.features.length > 0
      ? content.features
      : defaultFeatures


  const networkLabel =
    content?.networkLabel ||
    'SEATRACK GLOBAL NETWORK'


  const originLabel =
    content?.originLabel ||
    'ORIGIN'


  const origin =
    content?.origin ||
    content?.originName ||
    'Baku'


  const destinationLabel =
    content?.destinationLabel ||
    'DESTINATION'


  const destination =
    content?.destination ||
    content?.destinationName ||
    'Global Ports'


  const miniCardLabel =
    content?.miniCardLabel ||
    content?.miniLabel ||
    'GLOBAL MARITIME LOGISTICS'


  const miniCardTitle =
    content?.miniCardTitle ||
    content?.miniTitle ||
    'Connected across international trade routes.'


  const miniCardDescription =
    content?.miniCardDescription ||
    content?.miniDescription ||
    'Reliable shipping. Transparent operations.'


  const statusText =
    content?.statusText ||
    content?.status ||
    'Network Online'


  return (
    <section
      className="cta-section"
      id="call-to-action"
    >

      <div className="cta-glow cta-glow-left"></div>

      <div className="cta-glow cta-glow-right"></div>


      <div className="cta-container">


        {/* LEFT SIDE */}

        <div className="cta-content">

          <span className="cta-label">
            {label}
          </span>


          <h2>
            {title}

            <br />

            <span>
              {highlightedTitle}
            </span>
          </h2>


          <p className="cta-description">
            {description}
          </p>


          <div className="cta-actions">

            <a
              href={primaryButtonUrl}
              className="cta-primary"
            >
              {primaryButtonText}

              <span>
                →
              </span>
            </a>


            <a
              href={secondaryButtonUrl}
              className="cta-secondary"
            >
              {secondaryButtonText}

              <span>
                →
              </span>
            </a>

          </div>


          <div className="cta-features">

            {features.map((feature, index) => {

              const featureText =
                typeof feature === 'string'
                  ? feature
                  : feature?.text ||
                    feature?.title ||
                    feature?.label ||
                    ''


              return (
                <div
                  key={`${featureText}-${index}`}
                >
                  <span className="cta-check">
                    ✓
                  </span>

                  <p>
                    {featureText}
                  </p>
                </div>
              )
            })}

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="cta-visual">

          <div className="cta-circle cta-circle-one"></div>

          <div className="cta-circle cta-circle-two"></div>

          <div className="cta-circle cta-circle-three"></div>


          <div className="cta-network-label">
            {networkLabel}
          </div>


          <div className="cta-route">


            {/* ORIGIN */}

            <div className="cta-port">

              <span className="cta-port-dot"></span>

              <div>

                <small>
                  {originLabel}
                </small>

                <strong>
                  {origin}
                </strong>

              </div>

            </div>


            {/* ROUTE */}

            <div className="cta-route-line">

              <span className="cta-ship">
                ◆
              </span>

            </div>


            {/* DESTINATION */}

            <div className="cta-port cta-port-destination">

              <span className="cta-port-dot"></span>

              <div>

                <small>
                  {destinationLabel}
                </small>

                <strong>
                  {destination}
                </strong>

              </div>

            </div>

          </div>


          {/* MINI CARD */}

          <div className="cta-mini-card">

            <span>
              {miniCardLabel}
            </span>

            <strong>
              {miniCardTitle}
            </strong>

            <p>
              {miniCardDescription}
            </p>

          </div>


          {/* STATUS */}

          <div className="cta-status">

            <span></span>

            {statusText}

          </div>

        </div>

      </div>

    </section>
  )
}


export default CallToAction