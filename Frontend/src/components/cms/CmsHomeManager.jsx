import { useEffect, useMemo, useState } from "react";
import "./CmsHomeManager.css";

const API_URL = "https://localhost:44328";

const SECTION_TYPES = [
  "Hero",
  "Services",
  "GlobalNetwork",
  "Tracking",
  "Destinations",
  "WhySeaTrack",
  "CallToAction",
];

function getToken() {
  return (
    localStorage.getItem("seatrack_access_token") ||
    sessionStorage.getItem("seatrack_access_token")
  );
}

function humanize(value) {
  if (!value) {
    return "";
  }

  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getDefaultContent(sectionType) {
  switch (sectionType) {
    case "Hero":
      return {
        label: "GLOBAL MARITIME LOGISTICS",
        title: "Connecting cargo.",
        highlightedTitle: "Moving the world.",
        description:
          "Manage your sea freight from quotation to final delivery. Track shipments, containers and voyages through one powerful maritime logistics platform.",
        primaryButtonText: "Start Shipping",
        primaryButtonUrl: "/register",
        secondaryButtonText: "Track Shipment",
        secondaryButtonUrl: "/tracking",
        stats: [
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
        ],
        demoShipment: {
          label: "LIVE SHIPMENT",
          route: "Baku → Aktau",
          voyage: "Voyage ST-2026-001",
          origin: "Baku",
          destination: "Aktau",
          status: "In Transit",
        },
      };

    case "Services":
      return {
        label: "OUR SERVICES",
        title: "End-to-End Logistics",
        highlightedTitle: "for Global Trade",
        description:
          "From quotation to final delivery, SeaTrack brings your maritime logistics operations together in one powerful platform.",
        services: [
          {
            number: "01",
            title: "Sea Freight",
            text:
              "Reliable international maritime cargo transportation with transparent management from port to port.",
            linkText: "Explore service",
            linkUrl: "#",
            iconType: "SeaFreight",
          },
        ],
      };

    case "GlobalNetwork":
      return {
        label: "OUR GLOBAL NETWORK",
        title: "Connecting ports",
        highlightedTitle: "across the world.",
        description:
          "SeaTrack connects major maritime routes, ports and logistics operations through one powerful platform built for modern global trade.",
        linkText: "Explore our network",
        linkUrl: "#routes",
        stats: [
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
            label: "Global Tracking",
          },
        ],
        locations: [
          {
            name: "Baku",
            subtitle: "Azerbaijan",
            position: "baku",
            accent: false,
          },
        ],
        bottomLabel: "GLOBAL MARITIME NETWORK",
        bottomTitle: "Any Port. Any Route.",
      };

    case "Tracking":
      return {
        label: "TRACK YOUR SHIPMENT",
        titleLines: [
          "Real-Time",
          "Tracking.",
        ],
        highlightedTitle: "Total Transparency.",
        description:
          "Track your cargo at every stage of the voyage. Enter your SeaTrack tracking number to see the latest shipment status, route and delivery progress.",
        inputPlaceholder: "Enter tracking number",
        buttonText: "Track Shipment",
        stats: [
          {
            value: "24/7",
            label: "Live visibility",
          },
          {
            value: "6",
            label: "Tracking stages",
          },
          {
            value: "100%",
            label: "Transparent",
          },
        ],
        demoShipment: {
          badge: "LIVE VOYAGE",
          voyageNumber: "ST-2026-001",
          panelLabel: "SHIPMENT STATUS",
          route: "Baku → Aktau",
          status: "In Transit",
          trackingLabel: "Tracking number",
          trackingNumber: "ST-2026-001",
        },
        stages: [
          {
            number: "01",
            title: "Loaded",
            description: "Cargo loaded into container",
            state: "completed",
          },
        ],
      };

    case "Destinations":
      return {
        label: "OUR DESTINATIONS",
        title: "Trade Without",
        highlightedTitle: "Borders.",
        description:
          "SeaTrack connects strategic ports and maritime trade routes, helping businesses move cargo efficiently across regions and international markets.",
        linkText: "Explore all routes",
        linkUrl: "#destinations",
        destinations: [
          {
            code: "01",
            region: "CASPIAN SEA",
            title: "Baku → Aktau",
            description:
              "Fast and reliable maritime connection between Azerbaijan and Kazakhstan across the Caspian Sea.",
            ports: "Baku Port • Aktau Port",
            imageUrl: "",
          },
        ],
      };

    case "WhySeaTrack":
      return {
        label: "WHY SEATRACK",
        title: "Logistics made",
        highlightedTitle: "clear and simple.",
        description:
          "SeaTrack brings customers and logistics operations together in one maritime platform — from the first shipping request to final cargo delivery.",
        imageOverlayLabel: "GLOBAL LOGISTICS",
        imageOverlayTitle:
          "One connected maritime platform.",
        linkText: "Discover SeaTrack",
        linkUrl: "#services",
        advantages: [
          {
            number: "01",
            title: "Complete Visibility",
            text:
              "Track every stage of your shipment from loading and departure to arrival and final delivery.",
          },
        ],
      };

    case "CallToAction":
      return {
        label: "READY TO SHIP?",
        title: "Ready to move",
        highlightedTitle: "your cargo?",
        description:
          "Start your shipment with SeaTrack and manage your cargo, quotes, payments and tracking through one connected maritime logistics platform.",
        primaryButtonText: "Start Shipping",
        primaryButtonUrl: "/register",
        secondaryButtonText: "Track Shipment",
        secondaryButtonUrl: "#tracking",
        features: [
          "Global Network",
          "Secure Shipping",
          "Real-Time Tracking",
        ],
        networkLabel: "SEATRACK GLOBAL NETWORK",
        originLabel: "ORIGIN",
        origin: "Baku",
        destinationLabel: "DESTINATION",
        destination: "Global Ports",
        miniCardLabel: "GLOBAL MARITIME LOGISTICS",
        miniCardTitle:
          "Connected across international trade routes.",
        miniCardText:
          "Reliable shipping. Transparent operations.",
        status: "Network Online",
      };

    default:
      return {};
  }
}

function getDefaultArrayItem(arrayKey) {
  switch (arrayKey) {
    case "stats":
      return {
        value: "",
        label: "",
      };

    case "services":
      return {
        number: "",
        title: "",
        text: "",
        linkText: "",
        linkUrl: "",
        iconType: "",
      };

    case "locations":
      return {
        name: "",
        subtitle: "",
        position: "",
        accent: false,
      };

    case "stages":
      return {
        number: "",
        title: "",
        description: "",
        state: "pending",
      };

    case "destinations":
      return {
        code: "",
        region: "",
        title: "",
        description: "",
        ports: "",
        imageUrl: "",
      };

    case "advantages":
      return {
        number: "",
        title: "",
        text: "",
      };

    case "titleLines":
    case "features":
      return "";

    default:
      return "";
  }
}

function CmsHomeManager() {
  const [homePage, setHomePage] = useState(null);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingSection, setEditingSection] =
    useState(null);

  const [isCreating, setIsCreating] =
    useState(false);

  const [form, setForm] = useState({
    sectionType: "Hero",
    name: "Hero",
    isVisible: true,
    imageUrl: "",
    content: getDefaultContent("Hero"),
  });

  const sortedSections = useMemo(() => {
    return [...sections].sort(
      (a, b) => a.sortOrder - b.sortOrder
    );
  }, [sections]);

  useEffect(() => {
    loadHomePage();
  }, []);

  async function apiRequest(
    url,
    options = {}
  ) {
    const token = getToken();

    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (
      options.body &&
      !(options.body instanceof FormData)
    ) {
      headers["Content-Type"] =
        headers["Content-Type"] ||
        "application/json";
    }

    const response = await fetch(
      `${API_URL}${url}`,
      {
        ...options,
        headers,
      }
    );

    if (!response.ok) {
      let message =
        `Request failed (${response.status}).`;

      try {
        const data = await response.json();

        message =
          data.message ||
          data.title ||
          message;
      } catch {
        // Ignore JSON parsing error.
      }

      throw new Error(message);
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();

    if (!text) {
      return null;
    }

    return JSON.parse(text);
  }

  async function loadHomePage() {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest(
        "/api/admin/cms/home"
      );

      setHomePage(data);
      setSections(
        Array.isArray(data?.sections)
          ? data.sections
          : []
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function resetMessages() {
    setError("");
    setMessage("");
  }

  function openCreate() {
    resetMessages();

    const sectionType = "Hero";

    setEditingSection(null);
    setIsCreating(true);

    setForm({
      sectionType,
      name: humanize(sectionType),
      isVisible: true,
      imageUrl: "",
      content: clone(
        getDefaultContent(sectionType)
      ),
    });
  }

  function openEdit(section) {
    resetMessages();

    let parsedContent = {};

    try {
      parsedContent = JSON.parse(
        section.contentJson || "{}"
      );
    } catch {
      parsedContent = {};
    }

    setEditingSection(section);
    setIsCreating(false);

    setForm({
      sectionType: section.sectionType,
      name: section.name,
      isVisible: section.isVisible,
      imageUrl: section.imageUrl || "",
      content: parsedContent,
    });
  }

  function closeEditor() {
    setEditingSection(null);
    setIsCreating(false);
  }

  function handleSectionTypeChange(event) {
    const sectionType = event.target.value;

    setForm({
      sectionType,
      name: humanize(sectionType),
      isVisible: true,
      imageUrl: "",
      content: clone(
        getDefaultContent(sectionType)
      ),
    });
  }

  function updateContentField(
    key,
    value
  ) {
    setForm((current) => ({
      ...current,
      content: {
        ...current.content,
        [key]: value,
      },
    }));
  }

  function updateNestedObjectField(
    objectKey,
    fieldKey,
    value
  ) {
    setForm((current) => ({
      ...current,
      content: {
        ...current.content,
        [objectKey]: {
          ...(current.content[objectKey] || {}),
          [fieldKey]: value,
        },
      },
    }));
  }

  function updateArrayItem(
    arrayKey,
    index,
    fieldKey,
    value
  ) {
    setForm((current) => {
      const items = [
        ...(current.content[arrayKey] || []),
      ];

      if (
        typeof items[index] === "object" &&
        items[index] !== null &&
        !Array.isArray(items[index])
      ) {
        items[index] = {
          ...items[index],
          [fieldKey]: value,
        };
      } else {
        items[index] = value;
      }

      return {
        ...current,
        content: {
          ...current.content,
          [arrayKey]: items,
        },
      };
    });
  }

  function addArrayItem(arrayKey) {
    setForm((current) => {
      const items = [
        ...(current.content[arrayKey] || []),
      ];

      items.push(
        clone(
          getDefaultArrayItem(arrayKey)
        )
      );

      return {
        ...current,
        content: {
          ...current.content,
          [arrayKey]: items,
        },
      };
    });
  }

  function removeArrayItem(
    arrayKey,
    index
  ) {
    setForm((current) => {
      const items = [
        ...(current.content[arrayKey] || []),
      ];

      items.splice(index, 1);

      return {
        ...current,
        content: {
          ...current.content,
          [arrayKey]: items,
        },
      };
    });
  }

  async function uploadImage(file) {
    if (!file) {
      return null;
    }

    const formData = new FormData();

    formData.append("file", file);

    const result = await apiRequest(
      "/api/admin/cms/media/images",
      {
        method: "POST",
        body: formData,
      }
    );

    return result?.imageUrl || null;
  }

  async function handleMainImageUpload(
    event
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      resetMessages();
      setSaving(true);

      const imageUrl =
        await uploadImage(file);

      if (!imageUrl) {
        throw new Error(
          "Image upload failed."
        );
      }

      setForm((current) => ({
        ...current,
        imageUrl,
      }));

      setMessage(
        "Image uploaded successfully."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  }

  async function handleNestedImageUpload(
    arrayKey,
    index,
    event
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      resetMessages();
      setSaving(true);

      const imageUrl =
        await uploadImage(file);

      if (!imageUrl) {
        throw new Error(
          "Image upload failed."
        );
      }

      updateArrayItem(
        arrayKey,
        index,
        "imageUrl",
        imageUrl
      );

      setMessage(
        "Image uploaded successfully."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  }

  async function handleSave(event) {
    event.preventDefault();

    try {
      resetMessages();
      setSaving(true);

      const request = {
        sectionType: form.sectionType,
        name:
          form.name.trim() ||
          humanize(form.sectionType),
        isVisible: form.isVisible,
        contentJson: JSON.stringify(
          form.content
        ),
        imageUrl:
          form.imageUrl.trim() || null,
      };

      if (isCreating) {
        await apiRequest(
          "/api/admin/cms/home/sections",
          {
            method: "POST",
            body: JSON.stringify(request),
          }
        );

        setMessage(
          "Section created successfully."
        );
      } else if (editingSection) {
        await apiRequest(
          `/api/admin/cms/home/sections/${editingSection.id}`,
          {
            method: "PUT",
            body: JSON.stringify(request),
          }
        );

        setMessage(
          "Section updated successfully."
        );
      }

      closeEditor();
      await loadHomePage();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(section) {
    try {
      resetMessages();

      await apiRequest(
        `/api/admin/cms/home/sections/${section.id}/visibility`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isVisible: !section.isVisible,
          }),
        }
      );

      setSections((current) =>
        current.map((item) =>
          item.id === section.id
            ? {
                ...item,
                isVisible:
                  !item.isVisible,
              }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteSection(section) {
    const confirmed = window.confirm(
      `Delete "${section.name}" section?`
    );

    if (!confirmed) {
      return;
    }

    try {
      resetMessages();

      await apiRequest(
        `/api/admin/cms/home/sections/${section.id}`,
        {
          method: "DELETE",
        }
      );

      setMessage(
        "Section deleted successfully."
      );

      await loadHomePage();
    } catch (err) {
      setError(err.message);
    }
  }

  async function moveSection(
    sectionId,
    direction
  ) {
    const current = [...sortedSections];

    const index = current.findIndex(
      (section) =>
        section.id === sectionId
    );

    if (index === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= current.length
    ) {
      return;
    }

    const temporary =
      current[index];

    current[index] =
      current[targetIndex];

    current[targetIndex] =
      temporary;

    try {
      resetMessages();

      const result = await apiRequest(
        "/api/admin/cms/home/sections/reorder",
        {
          method: "PUT",
          body: JSON.stringify({
            sectionIds: current.map(
              (section) => section.id
            ),
          }),
        }
      );

      if (
        Array.isArray(result?.sections)
      ) {
        const orderMap = new Map(
          result.sections.map(
            (section) => [
              section.id,
              section.sortOrder,
            ]
          )
        );

        setSections((existing) =>
          existing.map((section) => ({
            ...section,
            sortOrder:
              orderMap.get(section.id) ??
              section.sortOrder,
          }))
        );
      } else {
        await loadHomePage();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function renderPrimitiveField(
    key,
    value,
    onChange
  ) {
    if (typeof value === "boolean") {
      return (
        <label className="cms-home__checkbox">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) =>
              onChange(
                event.target.checked
              )
            }
          />

          <span>{humanize(key)}</span>
        </label>
      );
    }

    const isLongText =
      key.toLowerCase().includes(
        "description"
      ) ||
      key.toLowerCase().includes("text");

    return (
      <label className="cms-home__field">
        <span>{humanize(key)}</span>

        {isLongText ? (
          <textarea
            value={value ?? ""}
            rows="4"
            onChange={(event) =>
              onChange(
                event.target.value
              )
            }
          />
        ) : (
          <input
            type="text"
            value={value ?? ""}
            onChange={(event) =>
              onChange(
                event.target.value
              )
            }
          />
        )}
      </label>
    );
  }

  function renderObjectEditor(
    objectKey,
    objectValue
  ) {
    return (
      <div
        className="cms-home__group"
        key={objectKey}
      >
        <div className="cms-home__group-heading">
          <h4>{humanize(objectKey)}</h4>
        </div>

        <div className="cms-home__form-grid">
          {Object.entries(
            objectValue || {}
          ).map(([key, value]) =>
            renderPrimitiveField(
              key,
              value,
              (newValue) =>
                updateNestedObjectField(
                  objectKey,
                  key,
                  newValue
                )
            )
          )}
        </div>
      </div>
    );
  }

  function renderArrayEditor(
    arrayKey,
    items
  ) {
    const safeItems =
      Array.isArray(items)
        ? items
        : [];

    return (
      <div
        className="cms-home__group"
        key={arrayKey}
      >
        <div className="cms-home__group-heading">
          <div>
            <span>COLLECTION</span>
            <h4>
              {humanize(arrayKey)}
            </h4>
          </div>

          <button
            type="button"
            className="cms-home__small-button"
            onClick={() =>
              addArrayItem(arrayKey)
            }
          >
            + Add Item
          </button>
        </div>

        <div className="cms-home__collection">
          {safeItems.length === 0 && (
            <div className="cms-home__empty">
              No items.
            </div>
          )}

          {safeItems.map(
            (item, index) => {
              const isObject =
                typeof item ===
                  "object" &&
                item !== null &&
                !Array.isArray(item);

              return (
                <div
                  className="cms-home__collection-item"
                  key={`${arrayKey}-${index}`}
                >
                  <div className="cms-home__collection-top">
                    <strong>
                      {humanize(
                        arrayKey
                      )}{" "}
                      #{index + 1}
                    </strong>

                    <button
                      type="button"
                      className="cms-home__remove-button"
                      onClick={() =>
                        removeArrayItem(
                          arrayKey,
                          index
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>

                  {isObject ? (
                    <div className="cms-home__form-grid">
                      {Object.entries(
                        item
                      ).map(
                        ([
                          fieldKey,
                          fieldValue,
                        ]) => {
                          if (
                            fieldKey ===
                            "imageUrl"
                          ) {
                            return (
                              <div
                                className="cms-home__field cms-home__image-field"
                                key={
                                  fieldKey
                                }
                              >
                                <span>
                                  Image
                                </span>

                                {fieldValue && (
                                  <img
                                    src={`${API_URL}${fieldValue}`}
                                    alt=""
                                  />
                                )}

                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                                  onChange={(
                                    event
                                  ) =>
                                    handleNestedImageUpload(
                                      arrayKey,
                                      index,
                                      event
                                    )
                                  }
                                />

                                <input
                                  type="text"
                                  value={
                                    fieldValue ||
                                    ""
                                  }
                                  placeholder="/uploads/cms/..."
                                  onChange={(
                                    event
                                  ) =>
                                    updateArrayItem(
                                      arrayKey,
                                      index,
                                      fieldKey,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                />

                                {fieldValue && (
                                  <button
                                    type="button"
                                    className="cms-home__remove-image"
                                    onClick={() =>
                                      updateArrayItem(
                                        arrayKey,
                                        index,
                                        fieldKey,
                                        ""
                                      )
                                    }
                                  >
                                    Remove
                                    Image
                                  </button>
                                )}
                              </div>
                            );
                          }

                          return renderPrimitiveField(
                            fieldKey,
                            fieldValue,
                            (
                              newValue
                            ) =>
                              updateArrayItem(
                                arrayKey,
                                index,
                                fieldKey,
                                newValue
                              )
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <label className="cms-home__field">
                      <span>
                        Value
                      </span>

                      <input
                        type="text"
                        value={
                          item ?? ""
                        }
                        onChange={(
                          event
                        ) =>
                          updateArrayItem(
                            arrayKey,
                            index,
                            null,
                            event.target
                              .value
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  function renderContentEditor() {
    return Object.entries(
      form.content || {}
    ).map(([key, value]) => {
      if (Array.isArray(value)) {
        return renderArrayEditor(
          key,
          value
        );
      }

      if (
        typeof value === "object" &&
        value !== null
      ) {
        return renderObjectEditor(
          key,
          value
        );
      }

      return (
        <div
          key={key}
          className="cms-home__single-field"
        >
          {renderPrimitiveField(
            key,
            value,
            (newValue) =>
              updateContentField(
                key,
                newValue
              )
          )}
        </div>
      );
    });
  }

  if (loading) {
    return (
      <div className="cms-home__loading">
        Loading Home Page CMS...
      </div>
    );
  }

  return (
    <div className="cms-home">
      <div className="cms-home__header">
        <div>
          <span className="cms-home__eyebrow">
            HOME PAGE CMS
          </span>

          <h1>
            {homePage?.name ||
              "Home Page"}
          </h1>

          <p>
            Manage sections, content,
            visibility, images and display
            order of the public SeaTrack
            home page.
          </p>
        </div>

        <button
          type="button"
          className="cms-home__create-button"
          onClick={openCreate}
        >
          + Add Section
        </button>
      </div>

      {error && (
        <div className="cms-home__alert cms-home__alert--error">
          {error}
        </div>
      )}

      {message && (
        <div className="cms-home__alert cms-home__alert--success">
          {message}
        </div>
      )}

      <div className="cms-home__sections">
        {sortedSections.length === 0 ? (
          <div className="cms-home__empty-state">
            <h3>No Home Page sections</h3>

            <p>
              Create the first section to
              start building the page.
            </p>
          </div>
        ) : (
          sortedSections.map(
            (section, index) => (
              <article
                key={section.id}
                className={
                  section.isVisible
                    ? "cms-home__section-card"
                    : "cms-home__section-card cms-home__section-card--hidden"
                }
              >
                <div className="cms-home__section-order">
                  {String(
                    section.sortOrder
                  ).padStart(2, "0")}
                </div>

                <div className="cms-home__section-info">
                  <div className="cms-home__section-meta">
                    <span>
                      {
                        section.sectionType
                      }
                    </span>

                    <span
                      className={
                        section.isVisible
                          ? "cms-home__status cms-home__status--visible"
                          : "cms-home__status cms-home__status--hidden"
                      }
                    >
                      {section.isVisible
                        ? "VISIBLE"
                        : "HIDDEN"}
                    </span>
                  </div>

                  <h3>
                    {section.name}
                  </h3>

                  {section.imageUrl && (
                    <span className="cms-home__has-image">
                      Image attached
                    </span>
                  )}
                </div>

                <div className="cms-home__section-actions">
                  <div className="cms-home__order-buttons">
                    <button
                      type="button"
                      disabled={
                        index === 0
                      }
                      onClick={() =>
                        moveSection(
                          section.id,
                          "up"
                        )
                      }
                    >
                      ↑
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        sortedSections.length -
                          1
                      }
                      onClick={() =>
                        moveSection(
                          section.id,
                          "down"
                        )
                      }
                    >
                      ↓
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      toggleVisibility(
                        section
                      )
                    }
                  >
                    {section.isVisible
                      ? "Hide"
                      : "Show"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openEdit(section)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="cms-home__delete-button"
                    onClick={() =>
                      deleteSection(
                        section
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
      </div>

      {(isCreating ||
        editingSection) && (
        <div className="cms-home__editor-overlay">
          <div className="cms-home__editor">
            <div className="cms-home__editor-header">
              <div>
                <span>
                  {isCreating
                    ? "CREATE SECTION"
                    : "EDIT SECTION"}
                </span>

                <h2>
                  {isCreating
                    ? "Add Home Section"
                    : editingSection?.name}
                </h2>
              </div>

              <button
                type="button"
                className="cms-home__close"
                onClick={closeEditor}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="cms-home__editor-body"
            >
              <div className="cms-home__group">
                <div className="cms-home__group-heading">
                  <h4>
                    Section Settings
                  </h4>
                </div>

                <div className="cms-home__form-grid">
                  <label className="cms-home__field">
                    <span>
                      Section Type
                    </span>

                    <select
                      value={
                        form.sectionType
                      }
                      disabled={
                        !isCreating
                      }
                      onChange={
                        handleSectionTypeChange
                      }
                    >
                      {SECTION_TYPES.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {humanize(
                              type
                            )}
                          </option>
                        )
                      )}
                    </select>
                  </label>

                  <label className="cms-home__field">
                    <span>
                      CMS Name
                    </span>

                    <input
                      type="text"
                      value={form.name}
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (current) => ({
                            ...current,
                            name:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    />
                  </label>

                  <label className="cms-home__checkbox">
                    <input
                      type="checkbox"
                      checked={
                        form.isVisible
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (current) => ({
                            ...current,
                            isVisible:
                              event
                                .target
                                .checked,
                          })
                        )
                      }
                    />

                    <span>
                      Visible on website
                    </span>
                  </label>
                </div>
              </div>

              <div className="cms-home__group">
                <div className="cms-home__group-heading">
                  <h4>
                    Main Section Image
                  </h4>
                </div>

                <div className="cms-home__main-image">
                  {form.imageUrl ? (
                    <img
                      src={`${API_URL}${form.imageUrl}`}
                      alt="Section"
                    />
                  ) : (
                    <div className="cms-home__image-placeholder">
                      No image selected
                    </div>
                  )}

                  <div className="cms-home__image-controls">
                    <label className="cms-home__upload-button">
                      Choose Image

                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={
                          handleMainImageUpload
                        }
                      />
                    </label>

                    {form.imageUrl && (
                      <button
                        type="button"
                        className="cms-home__remove-image"
                        onClick={() =>
                          setForm(
                            (current) => ({
                              ...current,
                              imageUrl:
                                "",
                            })
                          )
                        }
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="cms-home__content-fields">
                {renderContentEditor()}
              </div>

              <div className="cms-home__editor-footer">
                <button
                  type="button"
                  className="cms-home__cancel-button"
                  onClick={closeEditor}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cms-home__save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : isCreating
                    ? "Create Section"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CmsHomeManager;