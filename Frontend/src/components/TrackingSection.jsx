import './TrackingSection.css'
import trackingShip from '../assets/images/tracking-ship.jpg'


const API_URL = 'https://localhost:44328'


function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return trackingShip
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
  ) {
    return imageUrl
  }

  return `${API_URL}${imageUrl}`
}


function TrackingSection({
  content = null,
  imageUrl = null,
}) {

  const defaultStages = [
    {
      number: '01',
      title: 'Loaded',
      description: 'Cargo loaded into container',
      state: 'completed',
    },
    {
      number: '02',
      title: 'Departed',
      description: 'Departed from Baku Port',
      state: 'completed',
    },
    {
      number: '03',
      title: 'In Transit',
      description: 'Shipment is currently at sea',
      state: 'current',
    },
    {
      number: '04',
      title: 'Arrived',
      description: 'Arrival at destination port',
      state: 'pending',
    },
    {
      number: '05',
      title: 'Unloaded',
      description: 'Cargo unloaded from vessel',
      state: 'pending',
    },
    {
      number: '06',
      title: 'Delivered',
      description: 'Transportation completed',
      state: 'pending',
    },
  ]


  const defaultStats = [
    {
      value: '24/7',
      label: 'Live visibility',
    },
    {
      value: '6',
      label: 'Tracking stages',
    },
    {
      value: '100%',
      label: 'Transparent',
    },
  ]


  const label =
    content?.label ||
    'TRACK YOUR SHIPMENT'


  const title =
    content?.title ||
    'Real-Time'


  const secondTitle =
    content?.secondTitle ||
    content?.titleSecondLine ||
    'Tracking.'


  const highlightedTitle =
    content?.highlightedTitle ||
    'Total Transparency.'


  const description =
    content?.description ||
    'Track your cargo at every stage of the voyage. Enter your SeaTrack tracking number to see the latest shipment status, route and delivery progress.'


  const inputPlaceholder =
    content?.inputPlaceholder ||
    content?.placeholder ||
    'Enter tracking number'


  const buttonText =
    content?.buttonText ||
    'Track Shipment'


  const stats =
    Array.isArray(content?.stats) &&
    content.stats.length > 0
      ? content.stats
      : defaultStats


  const stages =
    Array.isArray(content?.stages) &&
    content.stages.length > 0
      ? content.stages
      : defaultStages


  const demoShipment =
    content?.demoShipment || {}


  const voyageLabel =
    demoShipment?.label ||
    content?.voyageLabel ||
    'LIVE VOYAGE'


  const trackingNumber =
    demoShipment?.trackingNumber ||
    content?.trackingNumber ||
    'ST-2026-001'


  const route =
    demoShipment?.route ||
    content?.route ||
    'Baku → Aktau'


  const shipmentStatus =
    demoShipment?.status ||
    content?.status ||
    'In Transit'


  const panelLabel =
    content?.panelLabel ||
    'SHIPMENT STATUS'


  const trackingNumberLabel =
    content?.trackingNumberLabel ||
    'Tracking number'


  const shipImage =
    resolveImageUrl(
      imageUrl ||
      content?.imageUrl
    )


  const handleSubmit = (event) => {
    event.preventDefault()
  }


  return (
    <section
      className="tracking-section"
      id="tracking"
    >

      <div className="tracking-container">


        {/* LEFT SIDE */}

        <div className="tracking-content">

          <div className="tracking-label">
            <span></span>

            {label}
          </div>


          <h2>
            {title}

            <br />

            {secondTitle}

            <br />

            <strong>
              {highlightedTitle}
            </strong>
          </h2>


          <p className="tracking-description">
            {description}
          </p>


          <form
            className="tracking-form"
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              placeholder={inputPlaceholder}
              aria-label="Tracking number"
            />


            <button type="submit">
              {buttonText}

              <span>
                →
              </span>
            </button>

          </form>


          <div className="tracking-stats">

            {stats.map((stat, index) => (
              <div
                key={`${stat?.label || 'stat'}-${index}`}
              >

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

        </div>


        {/* RIGHT SIDE */}

        <div className="tracking-panel">


          {/* IMAGE */}

          <div className="tracking-image">

            <img
              src={shipImage}
              alt={
                content?.imageAlt ||
                'SeaTrack container ship'
              }
            />


            <div className="tracking-image-overlay"></div>


            <div className="tracking-image-badge">

              <span>
                {voyageLabel}
              </span>

              <strong>
                {trackingNumber}
              </strong>

            </div>

          </div>


          {/* SHIPMENT HEADER */}

          <div className="tracking-panel-header">

            <div>

              <span className="tracking-panel-label">
                {panelLabel}
              </span>

              <h3>
                {route}
              </h3>

            </div>


            <span className="tracking-status">
              {shipmentStatus}
            </span>

          </div>


          {/* TRACKING NUMBER */}

          <div className="tracking-number">

            <span>
              {trackingNumberLabel}
            </span>

            <strong>
              {trackingNumber}
            </strong>

          </div>


          {/* TIMELINE */}

          <div className="tracking-timeline">

            {stages.map((stage, index) => {

              const fallback =
                defaultStages[index] || {}


              const stageNumber =
                stage?.number ||
                fallback.number ||
                String(index + 1).padStart(2, '0')


              const stageTitle =
                stage?.title ||
                fallback.title ||
                ''


              const stageDescription =
                stage?.description ||
                stage?.text ||
                fallback.description ||
                ''


              const stageState =
                stage?.state ||
                fallback.state ||
                'pending'


              return (
                <div
                  className={`tracking-stage ${stageState}`}
                  key={`${stageNumber}-${index}`}
                >

                  <div className="tracking-stage-marker">
                    <span></span>
                  </div>


                  <span className="tracking-stage-number">
                    {stageNumber}
                  </span>


                  <div className="tracking-stage-content">

                    <h4>
                      {stageTitle}
                    </h4>

                    <p>
                      {stageDescription}
                    </p>

                  </div>

                </div>
              )
            })}

          </div>

        </div>

      </div>

    </section>
  )
}


export default TrackingSection