import './ServicesSection.css'


function SeaFreightIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 39H52L47 48H18L9 39Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M18 39V29H45V39"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <path
        d="M24 29V21H39V29"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M31.5 21V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M14 52C17 54 20 54 23 52C26 54 29 54 32 52C35 54 38 54 41 52C44 54 47 54 50 52"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}


function ContainerIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="17"
        width="44"
        height="32"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M18 18V48"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M27 18V48"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M37 18V48"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M46 18V48"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M13 54H51"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}


function TrackingIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M32 55C32 55 48 40 48 25C48 16.2 40.8 9 32 9C23.2 9 16 16.2 16 25C16 40 32 55 32 55Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <circle
        cx="32"
        cy="25"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M8 51H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M46 51H56"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}


function getServiceIcon(index) {
  switch (index) {
    case 0:
      return <SeaFreightIcon />

    case 1:
      return <ContainerIcon />

    case 2:
      return <TrackingIcon />

    default:
      return <SeaFreightIcon />
  }
}


function ServicesSection({ content = null }) {
  const defaultServices = [
    {
      number: '01',
      title: 'Sea Freight',
      text: 'Reliable international maritime cargo transportation with transparent management from port to port.',
      link: 'Explore service',
      url: '#',
    },
    {
      number: '02',
      title: 'Container Shipping',
      text: 'Container planning and assignment with efficient cargo capacity management throughout the voyage.',
      link: 'Explore service',
      url: '#',
    },
    {
      number: '03',
      title: 'Real-Time Tracking',
      text: 'Track shipment status, voyage progress and port calls with your unique SeaTrack tracking number.',
      link: 'Track shipment',
      url: '#',
    },
  ]


  const label =
    content?.label ||
    'OUR SERVICES'


  const title =
    content?.title ||
    'End-to-End Logistics'


  const highlightedTitle =
    content?.highlightedTitle ||
    'for Global Trade'


  const description =
    content?.description ||
    'From quotation to final delivery, SeaTrack brings your maritime logistics operations together in one powerful platform.'


  const cmsServices =
    Array.isArray(content?.services) && content.services.length > 0
      ? content.services
      : defaultServices


  const services = cmsServices.map((service, index) => {
    const fallback =
      defaultServices[index] ||
      {
        number: String(index + 1).padStart(2, '0'),
        title: 'SeaTrack Service',
        text: '',
        link: 'Explore service',
        url: '#',
      }

    return {
      number:
        service?.number ||
        fallback.number ||
        String(index + 1).padStart(2, '0'),

      title:
        service?.title ||
        fallback.title,

      text:
        service?.text ||
        service?.description ||
        fallback.text,

      link:
        service?.link ||
        service?.linkText ||
        fallback.link,

      url:
        service?.url ||
        service?.linkUrl ||
        fallback.url ||
        '#',

      icon: getServiceIcon(index),
    }
  })


  return (
    <section
      className="services-section"
      id="services"
    >
      <div className="services-container">

        <div className="services-heading">

          <span className="services-label">
            {label}
          </span>


          <h2>
            {title}

            <br />

            <strong>
              {highlightedTitle}
            </strong>
          </h2>


          <p>
            {description}
          </p>

        </div>


        <div className="services-grid">

          {services.map((service, index) => (
            <article
              className="service-card"
              key={`${service.number}-${index}`}
            >

              <div className="service-card-top">

                <div className="service-icon">
                  {service.icon}
                </div>


                <span className="service-card-number">
                  {service.number}
                </span>

              </div>


              <h3>
                {service.title}
              </h3>


              <p>
                {service.text}
              </p>


              <a href={service.url}>
                {service.link}

                <span>
                  →
                </span>
              </a>

            </article>
          ))}

        </div>

      </div>
    </section>
  )
}


export default ServicesSection