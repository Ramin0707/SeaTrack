import './WhySeaTrack.css'
import whySeaTrackPort from '../assets/images/why-seatrack-port.jpg'

function WhySeaTrack() {
  const advantages = [
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

  return (
    <section className="why-seatrack">
      <div className="why-seatrack-container">

        <div className="why-seatrack-left">

          <span className="why-seatrack-label">
            WHY SEATRACK
          </span>

          <h2>
            Logistics made
            <br />
            <span>clear and simple.</span>
          </h2>

          <p className="why-seatrack-description">
            SeaTrack brings customers and logistics operations together in
            one maritime platform — from the first shipping request to final
            cargo delivery.
          </p>

          <div className="why-seatrack-image">
            <img
              src={whySeaTrackPort}
              alt="SeaTrack maritime container terminal"
            />

            <div className="why-image-overlay">
              <span>GLOBAL LOGISTICS</span>

              <strong>
                One connected
                <br />
                maritime platform.
              </strong>
            </div>
          </div>

          <a href="#services" className="why-seatrack-link">
            Discover SeaTrack
            <span>→</span>
          </a>

        </div>

        <div className="why-seatrack-right">

          {advantages.map((advantage) => (
            <article
              className="why-seatrack-item"
              key={advantage.number}
            >
              <span className="why-item-number">
                {advantage.number}
              </span>

              <div className="why-item-content">
                <h3>{advantage.title}</h3>

                <p>{advantage.text}</p>
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