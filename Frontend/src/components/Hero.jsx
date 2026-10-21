import "./Hero.css";
import heroPort from "../assets/images/hero-port.jpg";

const API_URL = "http://localhost:5080";

function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return heroPort;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl}`;
}

function Hero({
  content = null,
  imageUrl = null,
}) {
  const data = content || {};

  const label =
    data.label || "GLOBAL MARITIME LOGISTICS";

  const title =
    data.title || "Connecting cargo.";

  const highlightedTitle =
    data.highlightedTitle || "Moving the world.";

  const description =
    data.description ||
    "Manage your sea freight from quotation to final delivery. Track shipments, containers and voyages through one powerful maritime logistics platform.";

  const primaryButtonText =
    data.primaryButtonText || "Start Shipping";

  const primaryButtonUrl =
    data.primaryButtonUrl || "/register";

  const secondaryButtonText =
    data.secondaryButtonText || "Track Shipment";

  const secondaryButtonUrl =
    data.secondaryButtonUrl || "/tracking";

  const stats =
    Array.isArray(data.stats) && data.stats.length > 0
      ? data.stats
      : [
          {
            value: "120+",
            label: "Global Ports",
          },
          {
            value: "35+",
            label: "Shipping Routes",
          },
          {
            value: "24/7",
            label: "Shipment Tracking",
          },
        ];

  const demoShipment = data.demoShipment || {
    label: "LIVE SHIPMENT",
    route: "Baku → Aktau",
    voyage: "Voyage ST-2026-001",
    origin: "Baku",
    destination: "Aktau",
    status: "In Transit",
  };

  const backgroundImage =
    resolveImageUrl(imageUrl);

  return (
    <section
      className="hero"
      style={{
        "--hero-background": `url(${backgroundImage})`,
      }}
    >
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-label">
            <span></span>
            {label}
          </div>

          <h1>
            {title}
            <br />
            <strong>{highlightedTitle}</strong>
          </h1>

          <p className="hero-description">
            {description}
          </p>

          <div className="hero-actions">
            <a
              href={primaryButtonUrl}
              className="hero-primary-button"
            >
              {primaryButtonText}
              <span>→</span>
            </a>

            <a
              href={secondaryButtonUrl}
              className="hero-secondary-button"
            >
              {secondaryButtonText}
              <span>→</span>
            </a>
          </div>

          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={`${stat.label}-${index}`}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="shipment-card">
            <span className="shipment-label">
              {demoShipment.label ||
                "LIVE SHIPMENT"}
            </span>

            <h3>
              {demoShipment.route ||
                "Baku → Aktau"}
            </h3>

            <p>
              {demoShipment.voyage ||
                "Voyage ST-2026-001"}
            </p>

            <div className="route-line">
              <span className="route-point"></span>

              <span className="route-progress"></span>

              <span className="route-point"></span>
            </div>

            <div className="route-cities">
              <strong>
                {demoShipment.origin || "Baku"}
              </strong>

              <strong>
                {demoShipment.destination ||
                  "Aktau"}
              </strong>
            </div>

            <span className="shipment-status">
              {demoShipment.status ||
                "In Transit"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;