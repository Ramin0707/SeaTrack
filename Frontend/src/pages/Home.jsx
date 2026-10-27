import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import ServicesSection from "../components/ServicesSection";
import GlobalNetwork from "../components/GlobalNetwork";
import TrackingSection from "../components/TrackingSection";
import DestinationsSection from "../components/DestinationsSection";
import WhySeaTrack from "../components/WhySeaTrack";
import CallToAction from "../components/CallToAction";

const API_URL = "https://localhost:44328";

function parseContentJson(contentJson) {
  if (!contentJson) {
    return {};
  }

  if (typeof contentJson === "object") {
    return contentJson;
  }

  try {
    return JSON.parse(contentJson);
  } catch {
    return {};
  }
}

function renderFallbackHome() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <GlobalNetwork />
      <TrackingSection />
      <DestinationsSection />
      <WhySeaTrack />
      <CallToAction />
    </>
  );
}

function renderSection(section) {
  const content = parseContentJson(
    section.contentJson
  );

  switch (section.sectionType) {
    case "Hero":
      return (
        <Hero
          key={section.id}
          content={content}
          imageUrl={section.imageUrl}
        />
      );

    case "Services":
      return (
        <ServicesSection
          key={section.id}
          content={content}
          imageUrl={section.imageUrl}
        />
      );

    case "GlobalNetwork":
      return (
        <GlobalNetwork
          key={section.id}
          content={content}
          imageUrl={section.imageUrl}
        />
      );

    case "Tracking":
      return (
        <TrackingSection
          key={section.id}
          content={content}
          imageUrl={section.imageUrl}
        />
      );

    case "Destinations":
      return (
        <DestinationsSection
          key={section.id}
          content={content}
          imageUrl={section.imageUrl}
        />
      );

    case "WhySeaTrack":
      return (
        <WhySeaTrack
          key={section.id}
          content={content}
          imageUrl={section.imageUrl}
        />
      );

    case "CallToAction":
      return (
        <CallToAction
          key={section.id}
          content={content}
          imageUrl={section.imageUrl}
        />
      );

    default:
      return null;
  }
}

function Home() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadHomePage() {
      try {
        setLoading(true);
        setLoadFailed(false);

        const response = await fetch(
          `${API_URL}/api/home`
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load Home Page (${response.status}).`
          );
        }

        const data = await response.json();

        if (cancelled) {
          return;
        }

        const loadedSections = Array.isArray(
          data.sections
        )
          ? data.sections
          : [];

        const visibleSections =
          loadedSections
            .filter(
              (section) =>
                section.isVisible !== false
            )
            .sort(
              (first, second) =>
                first.sortOrder -
                second.sortOrder
            );

        setSections(visibleSections);
      } catch (error) {
        console.error(
          "Unable to load SeaTrack Home Page:",
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

    loadHomePage();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return renderFallbackHome();
  }

  if (loadFailed) {
    return renderFallbackHome();
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) =>
        renderSection(section)
      )}
    </>
  );
}

export default Home;