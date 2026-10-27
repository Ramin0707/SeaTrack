import './WhySeaTrack.css'
import whySeaTrackPort from '../assets/images/why-seatrack-port.jpg'


const API_URL = 'https://localhost:44328'


function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return whySeaTrackPort
  }

  if (
    imageUrl.startsWith('http://') ||
    imageUrl.startsWith('https://')
  ) {
    return imageUrl
  }

  if (imageUrl.startsWith('/')) {
    return `${API_URL}${imageUrl}`
  }

  return imageUrl
}


function WhySeaTrack({
  content = null,
  imageUrl = null,
}) {

  const defaultAdvantages = [
    {
      number: '01',
      title: 'Complete Visibility',
      text: 'Track every stage of your shipment from loading and departure to arrival and final delivery.',
    },
    {
      number: '02',
      title: 'Smart Operations',
      text: 'Manage shipping orders, containers, vessels, routes and voyages through one connected platform.',
    },
    {
      number: '03',
      title: 'Reliable Network',
      text: 'Connect cargo with trusted maritime routes and strategic ports across international trade corridors.',
    },
    {
      number: '04',
      title: 'Secure & Transparent',
      text: 'Keep quotes, invoices, payments and shipment information organized with clear status updates.',
    },
  ]


  const label =
    content?.label ||
    'WHY SEATRACK'


  const title =
    content?.title ||
    'Logistics made'


  const highlightedTitle =
    content?.highlightedTitle ||
    content?.subtitle ||
    'clear and simple.'


  const description =
    content?.description ||
    'SeaTrack brings customers and logistics operations together in one maritime platform — from the first shipping request to final cargo delivery.'


  const imageLabel =
    content?.imageLabel ||
    content?.overlayLabel ||
    'GLOBAL LOGISTICS'


  const imageTitle =
    content?.imageTitle ||
    content?.overlayTitle ||
    'One connected maritime platform.'


  const linkText =
    content?.linkText ||
    content?.buttonText ||
    'Discover SeaTrack'


  const linkUrl =
    content?.linkUrl ||
    content?.buttonUrl ||
    '#services'


  const cmsAdvantages =
    Array.isArray(content?.advantages) &&
    content.advantages.length > 0
      ? content.advantages
      : Array.isArray(content?.items) &&
          content.items.length > 0
        ? content.items
        : defaultAdvantages


  const advantages = cmsAdvantages.map(
    (advantage, index) => {

      const fallback =
        defaultAdvantages[index] || {
          number: String(index + 1).padStart(2, '0'),
          title: '',
          text: '',
        }


      return {
        number:
          advantage?.number ||
          advantage?.code ||
          fallback.number ||
          String(index + 1).padStart(2, '0'),

        title:
          advantage?.title ||
          fallback.title,

        text:
          advantage?.text ||
          advantage?.description ||
          fallback.text,
      }
    }
  )


  const sectionImage =
    resolveImageUrl(
      imageUrl ||
      content?.imageUrl
    )


  return (
    <section
      className="why-seatrack"
      id="why-seatrack"
    >

      <div className="why-seatrack-container">


        {/* LEFT SIDE */}

        <div className="why-seatrack-left">

          <span className="why-seatrack-label">
            {label}
          </span>


          <h2>
            {title}

            <br />

            <span>
              {highlightedTitle}
            </span>
          </h2>


          <p className="why-seatrack-description">
            {description}
          </p>


          <div className="why-seatrack-image">

            <img
              src={sectionImage}
              alt={
                content?.imageAlt ||
                'SeaTrack maritime container terminal'
              }
            />


            <div className="why-image-overlay">

              <span>
                {imageLabel}
              </span>


              <strong>
                {imageTitle}
              </strong>

            </div>

          </div>


          <a
            href={linkUrl}
            className="why-seatrack-link"
          >
            {linkText}

            <span>
              →
            </span>
          </a>

        </div>


        {/* RIGHT SIDE */}

        <div className="why-seatrack-right">

          {advantages.map((advantage, index) => (
            <article
              className="why-seatrack-item"
              key={`${advantage.number}-${index}`}
            >

              <span className="why-item-number">
                {advantage.number}
              </span>


              <div className="why-item-content">

                <h3>
                  {advantage.title}
                </h3>

                <p>
                  {advantage.text}
                </p>

              </div>


              <span className="why-item-arrow">
                →
              </span>

            </article>
          ))}

        </div>

      </div>

    </section>
  )
}


export default WhySeaTrack