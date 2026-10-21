import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CmsBlogManager from "../components/cms/CmsBlogManager";
import CmsHomeManager from "../components/cms/CmsHomeManager";

import "./WebsiteAdminDashboard.css";

const API_URL = "http://localhost:5080";

function getToken() {
  return (
    localStorage.getItem("seatrack_access_token") ||
    sessionStorage.getItem("seatrack_access_token")
  );
}

function clearAuth() {
  localStorage.removeItem("seatrack_access_token");
  localStorage.removeItem("seatrack_token_expires_at");

  sessionStorage.removeItem("seatrack_access_token");
  sessionStorage.removeItem("seatrack_token_expires_at");
}

const sections = [
  {
    id: "overview",
    number: "01",
    label: "Overview",
  },
  {
    id: "blog",
    number: "02",
    label: "Blog Posts",
  },
  {
    id: "home",
    number: "03",
    label: "Home Page",
  },
  {
    id: "services",
    number: "04",
    label: "Services",
  },
  {
    id: "about",
    number: "05",
    label: "About Page",
  },
];

export default function WebsiteAdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState("overview");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAdmin() {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load administrator (${response.status}).`
          );
        }

        const data = await response.json();

        const roles = Array.isArray(data.roles)
          ? data.roles
          : [];

        if (!roles.includes("Admin")) {
          navigate("/admin", {
            replace: true,
          });

          return;
        }

        setUser(data);
      } catch (err) {
        clearAuth();
        setError(err.message);

        setTimeout(() => {
          navigate("/login", {
            replace: true,
          });
        }, 1200);
      } finally {
        setLoading(false);
      }
    }

    loadAdmin();
  }, [navigate]);

  function handleLogout() {
    clearAuth();

    navigate("/login", {
      replace: true,
    });
  }

  function renderOverview() {
    return (
      <div className="website-admin__overview">
        <div className="website-admin__page-heading">
          <span>WEBSITE ADMINISTRATION</span>

          <h1>Content Management</h1>

          <p>
            Manage the content displayed across the public
            SeaTrack website.
          </p>
        </div>

        <div className="website-admin__overview-grid">
          <button
            type="button"
            className="website-admin__overview-card"
            onClick={() => setActiveSection("blog")}
          >
            <span className="website-admin__card-number">
              01
            </span>

            <h3>Blog</h3>

            <p>
              Create, edit, publish and remove SeaTrack
              news and articles.
            </p>

            <strong>Manage Blog →</strong>
          </button>

          <button
            type="button"
            className="website-admin__overview-card"
            onClick={() => setActiveSection("home")}
          >
            <span className="website-admin__card-number">
              02
            </span>

            <h3>Home Page</h3>

            <p>
              Manage the main content presented on the
              SeaTrack landing page.
            </p>

            <strong>Manage Home →</strong>
          </button>

          <button
            type="button"
            className="website-admin__overview-card"
            onClick={() => setActiveSection("services")}
          >
            <span className="website-admin__card-number">
              03
            </span>

            <h3>Services</h3>

            <p>
              Manage maritime logistics services displayed
              to website visitors.
            </p>

            <strong>Manage Services →</strong>
          </button>

          <button
            type="button"
            className="website-admin__overview-card"
            onClick={() => setActiveSection("about")}
          >
            <span className="website-admin__card-number">
              04
            </span>

            <h3>About SeaTrack</h3>

            <p>
              Manage company information and public
              About page content.
            </p>

            <strong>Manage About →</strong>
          </button>
        </div>
      </div>
    );
  }

  function renderComingSoon(title, description) {
    return (
      <div className="website-admin__placeholder">
        <span>CONTENT MANAGEMENT</span>

        <h2>{title}</h2>

        <p>{description}</p>

        <div className="website-admin__placeholder-box">
          <strong>
            CMS module is being connected.
          </strong>

          <p>
            This section will be connected to the SeaTrack
            backend and database next.
          </p>
        </div>
      </div>
    );
  }

  function renderContent() {
    switch (activeSection) {
      case "blog":
        return <CmsBlogManager />;

      case "home":
        return <CmsHomeManager />;

      case "services":
        return renderComingSoon(
          "Services",
          "Manage SeaTrack public maritime logistics services."
        );

      case "about":
        return renderComingSoon(
          "About Page",
          "Manage public company information and About page content."
        );

      default:
        return renderOverview();
    }
  }

  if (loading) {
    return (
      <div className="website-admin__loading">
        Loading Website Administration...
      </div>
    );
  }

  if (error) {
    return (
      <div className="website-admin__loading">
        {error}
      </div>
    );
  }

  return (
    <div className="website-admin">
      <aside className="website-admin__sidebar">
        <div className="website-admin__brand">
          <div className="website-admin__brand-mark">
            ST
          </div>

          <div>
            <strong>SEATRACK</strong>
            <span>WEBSITE ADMIN</span>
          </div>
        </div>

        <div className="website-admin__sidebar-label">
          CONTENT MANAGEMENT
        </div>

        <nav className="website-admin__nav">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={
                activeSection === section.id
                  ? "website-admin__nav-item website-admin__nav-item--active"
                  : "website-admin__nav-item"
              }
              onClick={() =>
                setActiveSection(section.id)
              }
            >
              <span>{section.number}</span>
              {section.label}
            </button>
          ))}
        </nav>

        <div className="website-admin__sidebar-bottom">
          <div className="website-admin__admin-card">
            <div className="website-admin__avatar">
              {user?.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div>
              <strong>
                {user?.fullName ||
                  "SeaTrack Administrator"}
              </strong>

              <span>Administrator</span>
            </div>
          </div>

          <button
            type="button"
            className="website-admin__logout"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <div className="website-admin__main">
        <header className="website-admin__topbar">
          <div>
            <span>SeaTrack</span>
            <strong>
              Website / CMS Administration
            </strong>
          </div>

          <div className="website-admin__topbar-right">
            <span className="website-admin__role">
              ADMIN
            </span>

            <span>
              {user?.email ||
                "admin@seatrack.com"}
            </span>
          </div>
        </header>

        <main className="website-admin__content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}