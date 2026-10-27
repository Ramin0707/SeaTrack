import { useEffect, useState } from "react";

import "./Services.css";

import seaFreightImage from "../assets/images/services-sea-freight.jpg";
import containerShippingImage from "../assets/images/services-container-shipping.jpg";
import routeVoyageImage from "../assets/images/services-route-voyage.jpg";
import realTimeTrackingImage from "../assets/images/services-real-time-tracking.jpg";

import CallToAction from "../components/CallToAction";

const API_URL = "https://localhost:44328";

const fallbackImages = {
  1: seaFreightImage,
  2: containerShippingImage,
  3: routeVoyageImage,
  4: realTimeTrackingImage,
};

function getImageUrl(service) {
  if (service.imageUrl) {
    if (
      service.imageUrl.startsWith("http://") ||
      service.imageUrl.startsWith("https://")
    ) {
      return service.imageUrl;
    }

    return `${API_URL}${service.imageUrl}`;
  }

  return fallbackImages[service.id] || null;
}

function Services() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadServicesPage() {
      try {
        setLoading(true);
        setLoadFailed(false);

        const response = await fetch(
          `${API_URL}/api/services`
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load Services Page (${response.status}).`
          );
        }

        const data = await response.json();

        if (cancelled) {
          return;
        }

        setPage(data);
      } catch (error) {
        console.error(
          "Unable to load SeaTrack Services Page:",
          error
        );

        if (!cancelled) {
          setLoadFailed(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadServicesPage();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return null;
  }

  if (loadFailed || !page) {
    return (
      <div className="services-page">
        <CallToAction />
      </div>
    );
  }

  const heroStats = Array.isArray(page.heroStats)
    ? page.heroStats
    : [];

  const capabilities = Array.isArray(
    page.capabilities
  )
    ? page.capabilities
    : [];

  const services = Array.isArray(page.services)
    ? [...page.services].sort(
        (first, second) =>
          first.sortOrder - second.sortOrder
      )
    : [];

  return (
    <div className="services-page">

      {/* =====================================
          SERVICES HERO
      ====================================== */}

      <section className="services-page-hero">

        <div className="services-hero-bg">
          <span className="services-hero-circle circle-one"></span>
          <span className="services-hero-circle circle-two"></span>
          <span className="services-hero-circle circle-three"></span>
        </div>

        <div className="services-hero-container">

          <div className="services-hero-content">

            <span className="services-page-label">
              {page.heroLabel}
            </span>

            <h1>
              {page.heroTitle}
              <br />
              <span>
                {page.heroHighlightedTitle}
              </span>
            </h1>

            <p className="services-hero-description">
              {page.heroDescription}
            </p>

            <div className="services-hero-stats">
              {heroStats.map((stat, index) => (
                <div
                  className="services-hero-stat"
                  key={`${stat.label}-${index}`}
                >
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

          </div>

          <div className="services-hero-index">

            <span className="services-index-title">
              {page.capabilitiesTitle}
            </span>

            {capabilities.map(
              (capability, index) => (
                <div
                  className="services-index-item"
                  key={`${capability.title}-${index}`}
                >
                  <span>
                    {capability.number}
                  </span>

                  <p>
                    {capability.title}
                  </p>
                </div>
              )
            )}

          </div>

        </div>

        <div className="services-scroll-indicator">
          <span></span>
          {page.scrollText}
        </div>

      </section>

      {/* =====================================
          DYNAMIC SERVICES
      ====================================== */}

      {services.map((service, index) => {
        const imageUrl = getImageUrl(service);

        const imageBlock = (
          <div className="service-detail-image">

            {imageUrl && (
              <img
                src={imageUrl}
                alt={
                  service.imageAlt ||
                  service.name
                }
              />
            )}

            <div className="service-image-number">
              {service.number}
            </div>

            <div className="service-image-badge">
              <span></span>
              {service.imageBadge}
            </div>

          </div>
        );

        const contentBlock = (
          <div className="service-detail-content">

            <span className="service-detail-label">
              {service.label}
            </span>

            <h2>
              {service.title}
              <span>
                {" "}
                {service.highlightedTitle}
              </span>
            </h2>

            <p className="service-detail-description">
              {service.description}
            </p>

            <div className="service-benefits">

              {Array.isArray(service.benefits) &&
                service.benefits.map(
                  (benefit, benefitIndex) => (
                    <div
                      className="service-benefit"
                      key={`${service.id}-${benefitIndex}`}
                    >
                      <span>
                        {benefit.number ||
                          String(
                            benefitIndex + 1
                          ).padStart(2, "0")}
                      </span>

                      <div>
                        <h3>
                          {benefit.title}
                        </h3>

                        <p>
                          {
                            benefit.description
                          }
                        </p>
                      </div>
                    </div>
                  )
                )}

            </div>

            {service.buttonText &&
              service.buttonUrl && (
                <a
                  href={service.buttonUrl}
                  className="service-detail-button"
                >
                  {service.buttonText}
                  <span>→</span>
                </a>
              )}

          </div>
        );

        const isReverse =
          index % 2 === 1;

        return (
          <section
            className="service-detail"
            key={service.id}
          >
            <div
              className={
                isReverse
                  ? "service-detail-container service-detail-reverse"
                  : "service-detail-container"
              }
            >
              {isReverse ? (
                <>
                  {contentBlock}
                  {imageBlock}
                </>
              ) : (
                <>
                  {imageBlock}
                  {contentBlock}
                </>
              )}
            </div>
          </section>
        );
      })}

      <CallToAction />

    </div>
  );
}

export default Services;