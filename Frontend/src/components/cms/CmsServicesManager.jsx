import { useEffect, useMemo, useState } from "react";

import "./CmsServicesManager.css";

const API_URL = "https://localhost:44328";

function getToken() {
  return (
    localStorage.getItem("seatrack_access_token") ||
    sessionStorage.getItem("seatrack_access_token")
  );
}

function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl}`;
}

const emptyService = {
  name: "",
  number: "",
  label: "",
  title: "",
  highlightedTitle: "",
  description: "",
  imageBadge: "",
  imageUrl: "",
  imageAlt: "",
  benefits: [],
  buttonText: "",
  buttonUrl: "",
  isVisible: true,
};

export default function CmsServicesManager() {
  const [page, setPage] = useState(null);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [savingPage, setSavingPage] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingPage, setEditingPage] = useState(false);
  const [editingServiceId, setEditingServiceId] =
    useState(null);

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const [serviceForm, setServiceForm] =
    useState(emptyService);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const token = useMemo(() => getToken(), []);

  /* =====================================
     API REQUEST
  ====================================== */

  async function apiRequest(
    url,
    options = {}
  ) {
    const currentToken = getToken();

    const headers = {
      ...(options.headers || {}),
    };

    if (currentToken) {
      headers.Authorization =
        `Bearer ${currentToken}`;
    }

    const response = await fetch(
      `${API_URL}${url}`,
      {
        ...options,
        headers,
      }
    );

    let data = null;

    const contentType =
      response.headers.get("content-type") || "";

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      data = await response.json();
    } else {
      const text = await response.text();

      if (text) {
        data = {
          message: text,
        };
      }
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Request failed (${response.status}).`
      );
    }

    return data;
  }

  /* =====================================
     LOAD SERVICES PAGE
  ====================================== */

  async function loadServicesPage() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await apiRequest(
        "/api/admin/cms/services"
      );

      setPage({
        ...data,
        heroStats:
          Array.isArray(data.heroStats)
            ? data.heroStats
            : [],
        capabilities:
          Array.isArray(data.capabilities)
            ? data.capabilities
            : [],
      });

      const serviceItems =
        data.services ||
        data.items ||
        [];

      setServices(
        [...serviceItems].sort(
          (a, b) =>
            (a.sortOrder || 0) -
            (b.sortOrder || 0)
        )
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServicesPage();
  }, []);

  /* =====================================
     PAGE FIELD
  ====================================== */

  function updatePageField(
    field,
    value
  ) {
    setPage((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /* =====================================
     HERO STATS
  ====================================== */

  function updateHeroStat(
    index,
    field,
    value
  ) {
    setPage((current) => {
      const heroStats = [
        ...(current.heroStats || []),
      ];

      heroStats[index] = {
        ...heroStats[index],
        [field]: value,
      };

      return {
        ...current,
        heroStats,
      };
    });
  }

  function addHeroStat() {
    setPage((current) => ({
      ...current,
      heroStats: [
        ...(current.heroStats || []),
        {
          value: "",
          label: "",
        },
      ],
    }));
  }

  function removeHeroStat(index) {
    setPage((current) => ({
      ...current,
      heroStats:
        current.heroStats.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  }

  /* =====================================
     CAPABILITIES
  ====================================== */

  function updateCapability(
    index,
    field,
    value
  ) {
    setPage((current) => {
      const capabilities = [
        ...(current.capabilities || []),
      ];

      capabilities[index] = {
        ...capabilities[index],
        [field]: value,
      };

      return {
        ...current,
        capabilities,
      };
    });
  }

  function addCapability() {
    setPage((current) => ({
      ...current,
      capabilities: [
        ...(current.capabilities || []),
        {
          number: "",
          title: "",
        },
      ],
    }));
  }

  function removeCapability(index) {
    setPage((current) => ({
      ...current,
      capabilities:
        current.capabilities.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  }

  /* =====================================
     SAVE PAGE
  ====================================== */

  async function savePage() {
    try {
      setSavingPage(true);
      setError("");
      setMessage("");

      await apiRequest(
        "/api/admin/cms/services",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name:
              page.name ||
              "Services Page",

            heroLabel:
              page.heroLabel || "",

            heroTitle:
              page.heroTitle || "",

            heroHighlightedTitle:
              page.heroHighlightedTitle ||
              "",

            heroDescription:
              page.heroDescription || "",

            heroStats:
              page.heroStats || [],

            capabilitiesTitle:
              page.capabilitiesTitle || "",

            capabilities:
              page.capabilities || [],

            scrollText:
              page.scrollText || "",
          }),
        }
      );

      setMessage(
        "Services page updated successfully."
      );

      setEditingPage(false);

      await loadServicesPage();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSavingPage(false);
    }
  }

  /* =====================================
     SERVICE FORM
  ====================================== */

  function updateServiceField(
    field,
    value
  ) {
    setServiceForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startCreateService() {
    setEditingServiceId(null);

    setServiceForm({
      ...emptyService,
      number: String(
        services.length + 1
      ).padStart(2, "0"),
    });

    setShowCreateForm(true);
    setError("");
    setMessage("");
  }

  function startEditService(service) {
    setShowCreateForm(false);

    setEditingServiceId(service.id);

    setServiceForm({
      name: service.name || "",
      number: service.number || "",
      label: service.label || "",
      title: service.title || "",
      highlightedTitle:
        service.highlightedTitle || "",
      description:
        service.description || "",
      imageBadge:
        service.imageBadge || "",
      imageUrl:
        service.imageUrl || "",
      imageAlt:
        service.imageAlt || "",
      benefits:
        Array.isArray(
          service.benefits
        )
          ? service.benefits
          : [],
      buttonText:
        service.buttonText || "",
      buttonUrl:
        service.buttonUrl || "",
      isVisible:
        service.isVisible !== false,
    });

    setError("");
    setMessage("");
  }

  function cancelServiceForm() {
    setShowCreateForm(false);
    setEditingServiceId(null);
    setServiceForm(emptyService);
  }

  /* =====================================
     BENEFITS
  ====================================== */

  function addBenefit() {
    setServiceForm((current) => ({
      ...current,
      benefits: [
        ...(current.benefits || []),
        {
          title: "",
          description: "",
        },
      ],
    }));
  }

  function updateBenefit(
    index,
    field,
    value
  ) {
    setServiceForm((current) => {
      const benefits = [
        ...(current.benefits || []),
      ];

      benefits[index] = {
        ...benefits[index],
        [field]: value,
      };

      return {
        ...current,
        benefits,
      };
    });
  }

  function removeBenefit(index) {
    setServiceForm((current) => ({
      ...current,
      benefits:
        current.benefits.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  }

  /* =====================================
     IMAGE UPLOAD
  ====================================== */

  async function uploadImage(file) {
    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setMessage("");

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const data =
        await apiRequest(
          "/api/admin/cms/media/images",
          {
            method: "POST",
            body: formData,
          }
        );

      setServiceForm(
        (current) => ({
          ...current,
          imageUrl:
            data.imageUrl || "",
        })
      );

      setMessage(
        "Image uploaded successfully."
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  /* =====================================
     CREATE SERVICE
  ====================================== */

  async function createService(
    event
  ) {
    event.preventDefault();

    try {
      setError("");
      setMessage("");

      await apiRequest(
        "/api/admin/cms/services/items",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            serviceForm
          ),
        }
      );

      setMessage(
        "Service created successfully."
      );

      cancelServiceForm();

      await loadServicesPage();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  /* =====================================
     UPDATE SERVICE
  ====================================== */

  async function updateService(
    event
  ) {
    event.preventDefault();

    if (!editingServiceId) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await apiRequest(
        `/api/admin/cms/services/items/${editingServiceId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            serviceForm
          ),
        }
      );

      setMessage(
        "Service updated successfully."
      );

      cancelServiceForm();

      await loadServicesPage();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  /* =====================================
     VISIBILITY
  ====================================== */

  async function toggleVisibility(
    service
  ) {
    try {
      setError("");
      setMessage("");

      await apiRequest(
        `/api/admin/cms/services/items/${service.id}/visibility`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            isVisible:
              !service.isVisible,
          }),
        }
      );

      setMessage(
        service.isVisible
          ? "Service hidden successfully."
          : "Service is now visible."
      );

      await loadServicesPage();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  /* =====================================
     DELETE
  ====================================== */

  async function deleteService(
    service
  ) {
    const confirmed =
      window.confirm(
        `Delete "${service.name || service.title}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await apiRequest(
        `/api/admin/cms/services/items/${service.id}`,
        {
          method: "DELETE",
        }
      );

      setMessage(
        "Service deleted successfully."
      );

      await loadServicesPage();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  /* =====================================
     REORDER
  ====================================== */

  async function moveService(
    index,
    direction
  ) {
    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= services.length
    ) {
      return;
    }

    const reordered = [
      ...services,
    ];

    [
      reordered[index],
      reordered[targetIndex],
    ] = [
      reordered[targetIndex],
      reordered[index],
    ];

    const items =
      reordered.map(
        (service, itemIndex) => ({
          id: service.id,
          sortOrder:
            itemIndex + 1,
        })
      );

    try {
      setError("");
      setMessage("");

      await apiRequest(
        "/api/admin/cms/services/items/reorder",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            items,
          }),
        }
      );

      setMessage(
        "Service order updated successfully."
      );

      await loadServicesPage();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  /* =====================================
     LOADING
  ====================================== */

  if (loading) {
    return (
      <div className="cms-services">
        <div className="cms-services__loading">
          Loading Services CMS...
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="cms-services">
        <div className="cms-services__error">
          {error ||
            "Services page could not be loaded."}
        </div>
      </div>
    );
  }

  /* =====================================
     SERVICE FORM UI
  ====================================== */

  function renderServiceForm() {
  const isEditing = editingServiceId !== null;

  return (
    <form
      className="cms-services__editor"
      onSubmit={isEditing ? updateService : createService}
    >
      {/* HEADER */}
      <div className="cms-services__editor-header">
        <div>
          <span className="cms-services__eyebrow">
            SERVICE EDITOR
          </span>

          <h2>
            {isEditing ? "Edit Service" : "Add New Service"}
          </h2>

          <p>
            Manage service information, image, call-to-action
            and customer benefits.
          </p>
        </div>

        <button
          type="button"
          className="cms-services__close-button"
          onClick={cancelServiceForm}
        >
          ✕ Close
        </button>
      </div>

      {/* BASIC INFORMATION */}
      <section className="cms-services__form-section">
        <div className="cms-services__form-section-heading">
          <span>01</span>

          <div>
            <h3>Basic Information</h3>
            <p>
              Main information displayed for this maritime service.
            </p>
          </div>
        </div>

        <div className="cms-services__form-grid">
          <label>
            <span>Internal Name</span>

            <input
              value={serviceForm.name}
              onChange={(event) =>
                updateServiceField(
                  "name",
                  event.target.value
                )
              }
              placeholder="Sea Freight"
              required
            />
          </label>

          <label>
            <span>Number</span>

            <input
              value={serviceForm.number}
              onChange={(event) =>
                updateServiceField(
                  "number",
                  event.target.value
                )
              }
              placeholder="01"
            />
          </label>

          <label className="cms-services__full">
            <span>Label</span>

            <input
              value={serviceForm.label}
              onChange={(event) =>
                updateServiceField(
                  "label",
                  event.target.value
                )
              }
              placeholder="01 / SEA FREIGHT"
            />
          </label>

          <label>
            <span>Title</span>

            <input
              value={serviceForm.title}
              onChange={(event) =>
                updateServiceField(
                  "title",
                  event.target.value
                )
              }
              placeholder="Reliable cargo transport"
              required
            />
          </label>

          <label>
            <span>Highlighted Title</span>

            <input
              value={serviceForm.highlightedTitle}
              onChange={(event) =>
                updateServiceField(
                  "highlightedTitle",
                  event.target.value
                )
              }
              placeholder="across global waters."
            />
          </label>

          <label className="cms-services__full">
            <span>Description</span>

            <textarea
              rows="5"
              value={serviceForm.description}
              onChange={(event) =>
                updateServiceField(
                  "description",
                  event.target.value
                )
              }
              placeholder="Describe this maritime service..."
            />
          </label>
        </div>
      </section>

      {/* IMAGE */}
      <section className="cms-services__form-section">
        <div className="cms-services__form-section-heading">
          <span>02</span>

          <div>
            <h3>Service Image</h3>
            <p>
              Manage the image displayed on the public Services page.
            </p>
          </div>
        </div>

        <div className="cms-services__image-editor">
          <div className="cms-services__image-fields">
            <label>
              <span>Image Badge</span>

              <input
                value={serviceForm.imageBadge}
                onChange={(event) =>
                  updateServiceField(
                    "imageBadge",
                    event.target.value
                  )
                }
                placeholder="GLOBAL SEA FREIGHT"
              />
            </label>

            <label>
              <span>Image Alt</span>

              <input
                value={serviceForm.imageAlt}
                onChange={(event) =>
                  updateServiceField(
                    "imageAlt",
                    event.target.value
                  )
                }
                placeholder="Sea freight container ship"
              />
            </label>

            <label>
              <span>Image URL</span>

              <input
                value={serviceForm.imageUrl}
                onChange={(event) =>
                  updateServiceField(
                    "imageUrl",
                    event.target.value
                  )
                }
                placeholder="/uploads/cms/..."
              />
            </label>

            <label>
              <span>Upload New Image</span>

              <div className="cms-services__upload-box">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploadingImage}
                  onChange={(event) =>
                    uploadImage(
                      event.target.files?.[0]
                    )
                  }
                />

                <small>
                  PNG, JPG or WEBP
                </small>
              </div>

              {uploadingImage && (
                <small className="cms-services__uploading">
                  Uploading image...
                </small>
              )}
            </label>
          </div>

          <div className="cms-services__preview-panel">
            <span className="cms-services__preview-label">
              IMAGE PREVIEW
            </span>

            {serviceForm.imageUrl ? (
              <div className="cms-services__image-preview">
                <img
                  src={getImageUrl(serviceForm.imageUrl)}
                  alt={
                    serviceForm.imageAlt ||
                    "Service preview"
                  }
                />

                {serviceForm.imageBadge && (
                  <div className="cms-services__preview-badge">
                    {serviceForm.imageBadge}
                  </div>
                )}
              </div>
            ) : (
              <div className="cms-services__empty-preview">
                <span>＋</span>
                <strong>No image selected</strong>
                <p>
                  Upload an image to preview it here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cms-services__form-section">
        <div className="cms-services__form-section-heading">
          <span>03</span>

          <div>
            <h3>Call To Action</h3>
            <p>
              Configure the button shown for this service.
            </p>
          </div>
        </div>

        <div className="cms-services__form-grid">
          <label>
            <span>Button Text</span>

            <input
              value={serviceForm.buttonText}
              onChange={(event) =>
                updateServiceField(
                  "buttonText",
                  event.target.value
                )
              }
              placeholder="Request a Quote"
            />
          </label>

          <label>
            <span>Button URL</span>

            <input
              value={serviceForm.buttonUrl}
              onChange={(event) =>
                updateServiceField(
                  "buttonUrl",
                  event.target.value
                )
              }
              placeholder="/register"
            />
          </label>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="cms-services__form-section">
        <div className="cms-services__benefits">
          <div className="cms-services__subheading">
            <div className="cms-services__form-section-heading">
              <span>04</span>

              <div>
                <h3>Service Benefits</h3>
                <p>
                  Add the main advantages customers receive
                  from this service.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="cms-services__add-benefit"
              onClick={addBenefit}
            >
              + Add Benefit
            </button>
          </div>

          {serviceForm.benefits.length === 0 && (
            <div className="cms-services__empty-benefits">
              No benefits added yet.
            </div>
          )}

          <div className="cms-services__benefits-list">
            {serviceForm.benefits.map(
              (benefit, index) => (
                <div
                  className="cms-services__benefit"
                  key={index}
                >
                  <div className="cms-services__benefit-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="cms-services__benefit-fields">
                    <label>
                      <span>Benefit Title</span>

                      <input
                        value={benefit.title || ""}
                        placeholder="Benefit title"
                        onChange={(event) =>
                          updateBenefit(
                            index,
                            "title",
                            event.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>Benefit Description</span>

                      <textarea
                        rows="3"
                        value={
                          benefit.description || ""
                        }
                        placeholder="Describe this benefit..."
                        onChange={(event) =>
                          updateBenefit(
                            index,
                            "description",
                            event.target.value
                          )
                        }
                      />
                    </label>
                  </div>

                  <button
                    type="button"
                    className="cms-services__remove-benefit"
                    onClick={() =>
                      removeBenefit(index)
                    }
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ACTIONS */}
      <div className="cms-services__editor-actions">
        <button
          type="button"
          className="cms-services__cancel-button"
          onClick={cancelServiceForm}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="cms-services__save-button"
        >
          {isEditing
            ? "Save Changes"
            : "Create Service"}
        </button>
      </div>
    </form>
  );
}

  /* =====================================
     MAIN UI
  ====================================== */

  return (
    <div className="cms-services">

      <div className="cms-services__heading">

        <div>
          <span>
            SERVICES PAGE CMS
          </span>

          <h1>
            Services
          </h1>

          <p>
            Manage page content,
            maritime services,
            images, visibility and
            display order.
          </p>
        </div>

        <button
          type="button"
          onClick={
            startCreateService
          }
        >
          + Add Service
        </button>

      </div>

      {error && (
        <div className="cms-services__alert cms-services__alert--error">
          {error}
        </div>
      )}

      {message && (
        <div className="cms-services__alert cms-services__alert--success">
          {message}
        </div>
      )}

      {/* PAGE SETTINGS */}

      <section className="cms-services__page-card">

        <div className="cms-services__page-card-header">

          <div>
            <span>
              PAGE CONTENT
            </span>

            <h2>
              Hero & Capabilities
            </h2>
          </div>

          {!editingPage ? (
            <button
              type="button"
              onClick={() =>
                setEditingPage(
                  true
                )
              }
            >
              Edit Page
            </button>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => {
                  setEditingPage(
                    false
                  );

                  loadServicesPage();
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  savingPage
                }
                onClick={savePage}
              >
                {savingPage
                  ? "Saving..."
                  : "Save Page"}
              </button>
            </div>
          )}

        </div>

        {!editingPage ? (
          <div className="cms-services__page-preview">

            <span>
              {page.heroLabel}
            </span>

            <h3>
              {page.heroTitle}{" "}
              <strong>
                {
                  page.heroHighlightedTitle
                }
              </strong>
            </h3>

            <p>
              {
                page.heroDescription
              }
            </p>

            <div className="cms-services__stats">
              {page.heroStats.map(
                (stat, index) => (
                  <div key={index}>
                    <strong>
                      {stat.value}
                    </strong>

                    <span>
                      {stat.label}
                    </span>
                  </div>
                )
              )}
            </div>

          </div>
        ) : (
          <div className="cms-services__page-editor">

            <label>
              <span>Page Name</span>

              <input
                value={
                  page.name || ""
                }
                onChange={(event) =>
                  updatePageField(
                    "name",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>Hero Label</span>

              <input
                value={
                  page.heroLabel ||
                  ""
                }
                onChange={(event) =>
                  updatePageField(
                    "heroLabel",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>Hero Title</span>

              <input
                value={
                  page.heroTitle ||
                  ""
                }
                onChange={(event) =>
                  updatePageField(
                    "heroTitle",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                Highlighted Title
              </span>

              <input
                value={
                  page.heroHighlightedTitle ||
                  ""
                }
                onChange={(event) =>
                  updatePageField(
                    "heroHighlightedTitle",
                    event.target.value
                  )
                }
              />
            </label>

            <label className="cms-services__full">
              <span>
                Hero Description
              </span>

              <textarea
                rows="4"
                value={
                  page.heroDescription ||
                  ""
                }
                onChange={(event) =>
                  updatePageField(
                    "heroDescription",
                    event.target.value
                  )
                }
              />
            </label>

            <div className="cms-services__full">

              <div className="cms-services__subheading">
                <h3>Hero Stats</h3>

                <button
                  type="button"
                  onClick={
                    addHeroStat
                  }
                >
                  + Add Stat
                </button>
              </div>

              {page.heroStats.map(
                (stat, index) => (
                  <div
                    className="cms-services__row-editor"
                    key={index}
                  >
                    <input
                      value={
                        stat.value ||
                        ""
                      }
                      placeholder="120+"
                      onChange={(
                        event
                      ) =>
                        updateHeroStat(
                          index,
                          "value",
                          event.target
                            .value
                        )
                      }
                    />

                    <input
                      value={
                        stat.label ||
                        ""
                      }
                      placeholder="Global Ports"
                      onChange={(
                        event
                      ) =>
                        updateHeroStat(
                          index,
                          "label",
                          event.target
                            .value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeHeroStat(
                          index
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                )
              )}

            </div>

            <label className="cms-services__full">
              <span>
                Capabilities Title
              </span>

              <input
                value={
                  page.capabilitiesTitle ||
                  ""
                }
                onChange={(event) =>
                  updatePageField(
                    "capabilitiesTitle",
                    event.target.value
                  )
                }
              />
            </label>

            <div className="cms-services__full">

              <div className="cms-services__subheading">
                <h3>
                  Capabilities
                </h3>

                <button
                  type="button"
                  onClick={
                    addCapability
                  }
                >
                  + Add Capability
                </button>
              </div>

              {page.capabilities.map(
                (
                  capability,
                  index
                ) => (
                  <div
                    className="cms-services__row-editor"
                    key={index}
                  >
                    <input
                      value={
                        capability.number ||
                        ""
                      }
                      placeholder="01"
                      onChange={(
                        event
                      ) =>
                        updateCapability(
                          index,
                          "number",
                          event.target
                            .value
                        )
                      }
                    />

                    <input
                      value={
                        capability.title ||
                        ""
                      }
                      placeholder="Sea Freight"
                      onChange={(
                        event
                      ) =>
                        updateCapability(
                          index,
                          "title",
                          event.target
                            .value
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeCapability(
                          index
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                )
              )}

            </div>

            <label className="cms-services__full">
              <span>Scroll Text</span>

              <input
                value={
                  page.scrollText ||
                  ""
                }
                onChange={(event) =>
                  updatePageField(
                    "scrollText",
                    event.target.value
                  )
                }
              />
            </label>

          </div>
        )}

      </section>

      {/* CREATE / EDIT FORM */}

      {(showCreateForm ||
        editingServiceId !==
          null) &&
        renderServiceForm()}

      {/* SERVICES LIST */}

      <section className="cms-services__list">

        <div className="cms-services__list-heading">

          <div>
            <span>
              SERVICE CONTENT
            </span>

            <h2>
              Maritime Services
            </h2>
          </div>

          <strong>
            {services.length}
          </strong>

        </div>

        {services.length === 0 ? (
          <div className="cms-services__empty">
            No services found.
          </div>
        ) : (
          services.map(
            (service, index) => (
              <article
                className="cms-services__service-card"
                key={service.id}
              >

                <div className="cms-services__service-number">
                  {service.number ||
                    String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                </div>

                {service.imageUrl && (
                  <div className="cms-services__service-image">
                    <img
                      src={getImageUrl(
                        service.imageUrl
                      )}
                      alt={
                        service.imageAlt ||
                        service.name ||
                        service.title
                      }
                    />
                  </div>
                )}

                <div className="cms-services__service-content">

                  <div className="cms-services__service-meta">

                    <span>
                      {service.label ||
                        service.name}
                    </span>

                    <strong
                      className={
                        service.isVisible
                          ? "cms-services__status cms-services__status--visible"
                          : "cms-services__status cms-services__status--hidden"
                      }
                    >
                      {service.isVisible
                        ? "VISIBLE"
                        : "HIDDEN"}
                    </strong>

                  </div>

                  <h3>
                    {service.title}

                    {service.highlightedTitle && (
                      <span>
                        {" "}
                        {
                          service.highlightedTitle
                        }
                      </span>
                    )}
                  </h3>

                  <p>
                    {
                      service.description
                    }
                  </p>

                </div>

                <div className="cms-services__service-actions">

                  <button
                    type="button"
                    disabled={
                      index === 0
                    }
                    onClick={() =>
                      moveService(
                        index,
                        "up"
                      )
                    }
                    title="Move up"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    disabled={
                      index ===
                      services.length -
                        1
                    }
                    onClick={() =>
                      moveService(
                        index,
                        "down"
                      )
                    }
                    title="Move down"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleVisibility(
                        service
                      )
                    }
                  >
                    {service.isVisible
                      ? "Hide"
                      : "Show"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      startEditService(
                        service
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteService(
                        service
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </article>
            )
          )
        )}

      </section>

    </div>
  );
}