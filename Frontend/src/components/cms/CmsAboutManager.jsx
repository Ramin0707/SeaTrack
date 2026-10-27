import { useEffect, useMemo, useState } from "react";
import "./CmsAboutManager.css";

const API_URL = "https://localhost:44328";

const SECTION_TYPES = [
  "Hero",
  "OurStory",
  "Mission",
  "Values",
  "GlobalNetwork",
  "CallToAction",
];

const SECTION_NAMES = {
  Hero: "Hero",
  OurStory: "Our Story",
  Mission: "Mission",
  Values: "Values",
  GlobalNetwork: "Global Network",
  CallToAction: "Call To Action",
};

const EMPTY_CONTENT = {
  label: "",
  title: "",
  highlightedTitle: "",
  description: "",
};

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

function parseContentJson(contentJson) {
  if (!contentJson) {
    return { ...EMPTY_CONTENT };
  }

  try {
    const parsed = JSON.parse(contentJson);

    return {
      ...EMPTY_CONTENT,
      ...parsed,
    };
  } catch {
    return {
      ...EMPTY_CONTENT,
    };
  }
}

function getDefaultContent(sectionType) {
  switch (sectionType) {
    case "Hero":
      return {
        label: "ABOUT SEATRACK",
        title: "",
        highlightedTitle: "",
        description: "",
      };

    case "OurStory":
      return {
        label: "OUR STORY",
        title: "",
        highlightedTitle: "",
        description: "",
      };

    case "Mission":
      return {
        label: "OUR MISSION",
        title: "",
        highlightedTitle: "",
        description: "",
      };

    case "Values":
      return {
        label: "OUR VALUES",
        title: "",
        highlightedTitle: "",
        description: "",
        items: [],
      };

    case "GlobalNetwork":
      return {
        label: "GLOBAL NETWORK",
        title: "",
        highlightedTitle: "",
        description: "",
        stats: [],
      };

    case "CallToAction":
      return {
        label: "LET'S MOVE FORWARD",
        title: "",
        highlightedTitle: "",
        description: "",
        primaryButtonText: "",
        primaryButtonUrl: "",
        secondaryButtonText: "",
        secondaryButtonUrl: "",
      };

    default:
      return {
        ...EMPTY_CONTENT,
      };
  }
}

export default function CmsAboutManager() {
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingSectionId, setEditingSectionId] =
    useState(null);

  const [sectionForm, setSectionForm] = useState({
    sectionType: "Hero",
    isVisible: true,
    imageUrl: "",
    content: getDefaultContent("Hero"),
  });

  const token = getToken();

  const sortedSections = useMemo(() => {
    return [...sections].sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        a.id - b.id
    );
  }, [sections]);

  const availableSectionTypes = useMemo(() => {
    const existingTypes = new Set(
      sections.map(
        (section) => section.sectionType
      )
    );

    return SECTION_TYPES.filter(
      (type) => !existingTypes.has(type)
    );
  }, [sections]);

  useEffect(() => {
    loadAboutPage();
  }, []);

  async function request(
    url,
    options = {}
  ) {
    const headers = {
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
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
      response.headers.get(
        "content-type"
      ) || "";

    if (
      contentType.includes(
        "application/json"
      )
    ) {
      data = await response.json();
    } else {
      const text = await response.text();

      data = text
        ? { message: text }
        : null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Request failed (${response.status})`
      );
    }

    return data;
  }

  async function loadAboutPage() {
    try {
      setLoading(true);
      setError("");

      const data = await request(
        "/api/admin/cms/about"
      );

      setPage(data);
      setSections(data?.sections || []);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load About page."
      );
    } finally {
      setLoading(false);
    }
  }

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function startEdit(section) {
    clearMessages();

    setEditingSectionId(section.id);

    setSectionForm({
      sectionType: section.sectionType,
      isVisible: section.isVisible,
      imageUrl: section.imageUrl || "",
      content: parseContentJson(
        section.contentJson
      ),
    });

    window.setTimeout(() => {
      document
        .getElementById(
          "about-section-editor"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function startCreate() {
    clearMessages();

    const type =
      availableSectionTypes[0] ||
      "Hero";

    setEditingSectionId("new");

    setSectionForm({
      sectionType: type,
      isVisible: true,
      imageUrl: "",
      content: getDefaultContent(type),
    });

    window.setTimeout(() => {
      document
        .getElementById(
          "about-section-editor"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function closeEditor() {
    setEditingSectionId(null);

    setSectionForm({
      sectionType: "Hero",
      isVisible: true,
      imageUrl: "",
      content:
        getDefaultContent("Hero"),
    });
  }

  function updateFormField(
    field,
    value
  ) {
    setSectionForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateContentField(
    field,
    value
  ) {
    setSectionForm((current) => ({
      ...current,
      content: {
        ...current.content,
        [field]: value,
      },
    }));
  }

  function changeSectionType(type) {
    setSectionForm((current) => ({
      ...current,
      sectionType: type,
      content: getDefaultContent(type),
    }));
  }

  async function saveSection(event) {
    event.preventDefault();

    try {
      setSaving(true);
      clearMessages();

      const body = {
        sectionType:
          sectionForm.sectionType,
        isVisible:
          sectionForm.isVisible,
        contentJson: JSON.stringify(
          sectionForm.content
        ),
        imageUrl:
          sectionForm.imageUrl ||
          null,
      };

      if (editingSectionId === "new") {
        await request(
          "/api/admin/cms/about/sections",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        setSuccess(
          "About section created successfully."
        );
      } else {
        await request(
          `/api/admin/cms/about/sections/${editingSectionId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(body),
          }
        );

        setSuccess(
          "About section updated successfully."
        );
      }

      setEditingSectionId(null);

      await loadAboutPage();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to save section."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(
    section
  ) {
    try {
      clearMessages();

      await request(
        `/api/admin/cms/about/sections/${section.id}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            isVisible:
              !section.isVisible,
          }),
        }
      );

      setSuccess(
        section.isVisible
          ? `${SECTION_NAMES[section.sectionType] || section.sectionType} hidden successfully.`
          : `${SECTION_NAMES[section.sectionType] || section.sectionType} is now visible.`
      );

      await loadAboutPage();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to change visibility."
      );
    }
  }

  async function deleteSection(
    section
  ) {
    const confirmed =
      window.confirm(
        `Delete "${SECTION_NAMES[section.sectionType] || section.sectionType}" section?`
      );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      await request(
        `/api/admin/cms/about/sections/${section.id}`,
        {
          method: "DELETE",
        }
      );

      if (
        editingSectionId ===
        section.id
      ) {
        closeEditor();
      }

      setSuccess(
        "About section deleted successfully."
      );

      await loadAboutPage();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to delete section."
      );
    }
  }

  async function moveSection(
    sectionId,
    direction
  ) {
    const current = [
      ...sortedSections,
    ];

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

    [
      current[index],
      current[targetIndex],
    ] = [
      current[targetIndex],
      current[index],
    ];

    const items = current.map(
      (section, itemIndex) => ({
        id: section.id,
        sortOrder: itemIndex + 1,
      })
    );

    try {
      clearMessages();

      await request(
        "/api/admin/cms/about/sections/reorder",
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

      setSuccess(
        "Section order updated."
      );

      await loadAboutPage();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Failed to reorder sections."
      );
    }
  }

  async function uploadImage(file) {
    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      clearMessages();

      const formData =
        new FormData();

      formData.append("file", file);

      const data = await request(
        "/api/admin/cms/media/images",
        {
          method: "POST",
          body: formData,
        }
      );

      const imageUrl =
        data?.imageUrl ||
        data?.url ||
        data?.fileUrl ||
        data?.path;

      if (!imageUrl) {
        throw new Error(
          "Image uploaded, but image URL was not returned."
        );
      }

      updateFormField(
        "imageUrl",
        imageUrl
      );

      setSuccess(
        "Image uploaded successfully."
      );
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Image upload failed."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  function addValueItem() {
    setSectionForm((current) => ({
      ...current,
      content: {
        ...current.content,
        items: [
          ...(current.content.items ||
            []),
          {
            number: String(
              (current.content.items
                ?.length || 0) + 1
            ).padStart(2, "0"),
            title: "",
            description: "",
          },
        ],
      },
    }));
  }

  function updateValueItem(
    index,
    field,
    value
  ) {
    setSectionForm((current) => {
      const items = [
        ...(current.content.items ||
          []),
      ];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...current,
        content: {
          ...current.content,
          items,
        },
      };
    });
  }

  function removeValueItem(index) {
    setSectionForm((current) => ({
      ...current,
      content: {
        ...current.content,
        items: (
          current.content.items || []
        ).filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
      },
    }));
  }

  function addStat() {
    setSectionForm((current) => ({
      ...current,
      content: {
        ...current.content,
        stats: [
          ...(current.content.stats ||
            []),
          {
            value: "",
            label: "",
          },
        ],
      },
    }));
  }

  function updateStat(
    index,
    field,
    value
  ) {
    setSectionForm((current) => {
      const stats = [
        ...(current.content.stats ||
          []),
      ];

      stats[index] = {
        ...stats[index],
        [field]: value,
      };

      return {
        ...current,
        content: {
          ...current.content,
          stats,
        },
      };
    });
  }

  function removeStat(index) {
    setSectionForm((current) => ({
      ...current,
      content: {
        ...current.content,
        stats: (
          current.content.stats || []
        ).filter(
          (_, statIndex) =>
            statIndex !== index
        ),
      },
    }));
  }

  function renderBasicFields() {
    return (
      <div className="cms-about__form-grid">
        <label>
          <span>Label</span>

          <input
            value={
              sectionForm.content
                .label || ""
            }
            onChange={(event) =>
              updateContentField(
                "label",
                event.target.value
              )
            }
            placeholder="ABOUT SEATRACK"
          />
        </label>

        <label>
          <span>Title</span>

          <input
            value={
              sectionForm.content
                .title || ""
            }
            onChange={(event) =>
              updateContentField(
                "title",
                event.target.value
              )
            }
            placeholder="Section title"
          />
        </label>

        <label className="cms-about__full">
          <span>
            Highlighted Title
          </span>

          <input
            value={
              sectionForm.content
                .highlightedTitle ||
              ""
            }
            onChange={(event) =>
              updateContentField(
                "highlightedTitle",
                event.target.value
              )
            }
            placeholder="Highlighted part of the title"
          />
        </label>

        <label className="cms-about__full">
          <span>Description</span>

          <textarea
            rows="5"
            value={
              sectionForm.content
                .description || ""
            }
            onChange={(event) =>
              updateContentField(
                "description",
                event.target.value
              )
            }
            placeholder="Section description"
          />
        </label>
      </div>
    );
  }

  function renderValuesEditor() {
    if (
      sectionForm.sectionType !==
      "Values"
    ) {
      return null;
    }

    const items =
      sectionForm.content.items || [];

    return (
      <section className="cms-about__editor-section">
        <div className="cms-about__subheading">
          <div>
            <span>VALUES</span>
            <h3>Company Values</h3>

            <p>
              Manage the values displayed
              on the public About page.
            </p>
          </div>

          <button
            type="button"
            onClick={addValueItem}
          >
            + Add Value
          </button>
        </div>

        <div className="cms-about__repeat-list">
          {items.map(
            (item, index) => (
              <article
                className="cms-about__repeat-card"
                key={index}
              >
                <div className="cms-about__repeat-number">
                  {String(
                    index + 1
                  ).padStart(2, "0")}
                </div>

                <div className="cms-about__form-grid">
                  <label>
                    <span>Number</span>

                    <input
                      value={
                        item.number ||
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateValueItem(
                          index,
                          "number",
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  <label>
                    <span>Title</span>

                    <input
                      value={
                        item.title ||
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateValueItem(
                          index,
                          "title",
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  <label className="cms-about__full">
                    <span>
                      Description
                    </span>

                    <textarea
                      rows="3"
                      value={
                        item.description ||
                        ""
                      }
                      onChange={(
                        event
                      ) =>
                        updateValueItem(
                          index,
                          "description",
                          event.target
                            .value
                        )
                      }
                    />
                  </label>
                </div>

                <button
                  className="cms-about__remove"
                  type="button"
                  onClick={() =>
                    removeValueItem(
                      index
                    )
                  }
                >
                  Remove
                </button>
              </article>
            )
          )}
        </div>
      </section>
    );
  }

  function renderStatsEditor() {
    if (
      sectionForm.sectionType !==
      "GlobalNetwork"
    ) {
      return null;
    }

    const stats =
      sectionForm.content.stats || [];

    return (
      <section className="cms-about__editor-section">
        <div className="cms-about__subheading">
          <div>
            <span>NETWORK STATS</span>

            <h3>
              Global Network Statistics
            </h3>

            <p>
              Manage statistics displayed
              in the Global Network
              section.
            </p>
          </div>

          <button
            type="button"
            onClick={addStat}
          >
            + Add Stat
          </button>
        </div>

        <div className="cms-about__stats-editor">
          {stats.map(
            (stat, index) => (
              <article
                className="cms-about__stat-editor"
                key={index}
              >
                <label>
                  <span>Value</span>

                  <input
                    value={
                      stat.value || ""
                    }
                    placeholder="120+"
                    onChange={(
                      event
                    ) =>
                      updateStat(
                        index,
                        "value",
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <label>
                  <span>Label</span>

                  <input
                    value={
                      stat.label || ""
                    }
                    placeholder="Global Ports"
                    onChange={(
                      event
                    ) =>
                      updateStat(
                        index,
                        "label",
                        event.target
                          .value
                      )
                    }
                  />
                </label>

                <button
                  type="button"
                  className="cms-about__remove"
                  onClick={() =>
                    removeStat(index)
                  }
                >
                  Remove
                </button>
              </article>
            )
          )}
        </div>
      </section>
    );
  }

  function renderCallToActionEditor() {
    if (
      sectionForm.sectionType !==
      "CallToAction"
    ) {
      return null;
    }

    return (
      <section className="cms-about__editor-section">
        <div className="cms-about__subheading">
          <div>
            <span>CALL TO ACTION</span>

            <h3>Buttons</h3>

            <p>
              Manage CTA buttons and
              destinations.
            </p>
          </div>
        </div>

        <div className="cms-about__form-grid">
          <label>
            <span>
              Primary Button Text
            </span>

            <input
              value={
                sectionForm.content
                  .primaryButtonText ||
                ""
              }
              onChange={(event) =>
                updateContentField(
                  "primaryButtonText",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            <span>
              Primary Button URL
            </span>

            <input
              value={
                sectionForm.content
                  .primaryButtonUrl ||
                ""
              }
              onChange={(event) =>
                updateContentField(
                  "primaryButtonUrl",
                  event.target.value
                )
              }
              placeholder="/register"
            />
          </label>

          <label>
            <span>
              Secondary Button Text
            </span>

            <input
              value={
                sectionForm.content
                  .secondaryButtonText ||
                ""
              }
              onChange={(event) =>
                updateContentField(
                  "secondaryButtonText",
                  event.target.value
                )
              }
            />
          </label>

          <label>
            <span>
              Secondary Button URL
            </span>

            <input
              value={
                sectionForm.content
                  .secondaryButtonUrl ||
                ""
              }
              onChange={(event) =>
                updateContentField(
                  "secondaryButtonUrl",
                  event.target.value
                )
              }
              placeholder="/services"
            />
          </label>
        </div>
      </section>
    );
  }

  function renderEditor() {
    if (editingSectionId === null) {
      return null;
    }

    const isCreating =
      editingSectionId === "new";

    return (
      <form
        id="about-section-editor"
        className="cms-about__editor"
        onSubmit={saveSection}
      >
        <div className="cms-about__editor-header">
          <div>
            <span>
              ABOUT PAGE EDITOR
            </span>

            <h2>
              {isCreating
                ? "Add Section"
                : `Edit ${
                    SECTION_NAMES[
                      sectionForm
                        .sectionType
                    ] ||
                    sectionForm.sectionType
                  }`}
            </h2>

            <p>
              Manage section content,
              image and visibility.
            </p>
          </div>

          <button
            type="button"
            className="cms-about__close"
            onClick={closeEditor}
          >
            × Close
          </button>
        </div>

        <section className="cms-about__editor-section">
          <div className="cms-about__section-title">
            <span>01</span>

            <div>
              <h3>
                Basic Information
              </h3>

              <p>
                Main content displayed in
                this About section.
              </p>
            </div>
          </div>

          {isCreating && (
            <div className="cms-about__form-grid">
              <label className="cms-about__full">
                <span>
                  Section Type
                </span>

                <select
                  value={
                    sectionForm.sectionType
                  }
                  onChange={(
                    event
                  ) =>
                    changeSectionType(
                      event.target
                        .value
                    )
                  }
                >
                  {availableSectionTypes.map(
                    (type) => (
                      <option
                        value={type}
                        key={type}
                      >
                        {SECTION_NAMES[
                          type
                        ] || type}
                      </option>
                    )
                  )}
                </select>
              </label>
            </div>
          )}

          {renderBasicFields()}
        </section>

        <section className="cms-about__editor-section">
          <div className="cms-about__section-title">
            <span>02</span>

            <div>
              <h3>Section Image</h3>

              <p>
                Manage the image displayed
                in this About section.
              </p>
            </div>
          </div>

          <div className="cms-about__form-grid">
            <label className="cms-about__full">
              <span>Image URL</span>

              <input
                value={
                  sectionForm.imageUrl
                }
                onChange={(event) =>
                  updateFormField(
                    "imageUrl",
                    event.target.value
                  )
                }
                placeholder="/uploads/cms/..."
              />
            </label>

            <label className="cms-about__full">
              <span>
                Upload New Image
              </span>

              <div className="cms-about__file-box">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={
                    uploadingImage
                  }
                  onChange={(event) =>
                    uploadImage(
                      event.target
                        .files?.[0]
                    )
                  }
                />

                <small>
                  PNG, JPG or WEBP
                </small>
              </div>
            </label>
          </div>

          {uploadingImage && (
            <p className="cms-about__uploading">
              Uploading image...
            </p>
          )}

          {sectionForm.imageUrl && (
            <div className="cms-about__image-preview">
              <span>
                IMAGE PREVIEW
              </span>

              <img
                src={getImageUrl(
                  sectionForm.imageUrl
                )}
                alt="About section preview"
              />
            </div>
          )}
        </section>

        {renderValuesEditor()}

        {renderStatsEditor()}

        {renderCallToActionEditor()}

        <section className="cms-about__editor-section">
          <div className="cms-about__section-title">
            <span>03</span>

            <div>
              <h3>Visibility</h3>

              <p>
                Choose whether this section
                is displayed publicly.
              </p>
            </div>
          </div>

          <label className="cms-about__visibility-option">
            <input
              type="checkbox"
              checked={
                sectionForm.isVisible
              }
              onChange={(event) =>
                updateFormField(
                  "isVisible",
                  event.target.checked
                )
              }
            />

            <div>
              <strong>
                Visible on website
              </strong>

              <span>
                Visitors can see this
                section on the public About
                page.
              </span>
            </div>
          </label>
        </section>

        <div className="cms-about__editor-actions">
          <button
            type="button"
            onClick={closeEditor}
          >
            Cancel
          </button>

          <button
            type="submit"
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
    );
  }

  if (loading) {
    return (
      <div className="cms-about">
        <div className="cms-about__loading">
          Loading About Page CMS...
        </div>
      </div>
    );
  }

  return (
    <div className="cms-about">
      <header className="cms-about__page-header">
        <div>
          <span>
            ABOUT PAGE CMS
          </span>

          <h1>About Page</h1>

          <p>
            Manage company information,
            images, visibility and display
            order.
          </p>
        </div>

        {availableSectionTypes.length >
          0 && (
          <button
            type="button"
            className="cms-about__add"
            onClick={startCreate}
          >
            + Add Section
          </button>
        )}
      </header>

      {error && (
        <div className="cms-about__message cms-about__message--error">
          {error}
        </div>
      )}

      {success && (
        <div className="cms-about__message cms-about__message--success">
          {success}
        </div>
      )}

      <section className="cms-about__summary">
        <div>
          <span>PAGE CONTENT</span>

          <h2>
            {page?.name ||
              "About Page"}
          </h2>

          <p>
            {sections.length} sections
            configured
          </p>
        </div>

        <div className="cms-about__summary-stats">
          <div>
            <strong>
              {
                sections.filter(
                  (section) =>
                    section.isVisible
                ).length
              }
            </strong>

            <span>Visible</span>
          </div>

          <div>
            <strong>
              {sections.length}
            </strong>

            <span>Total Sections</span>
          </div>
        </div>
      </section>

      {renderEditor()}

      <section className="cms-about__sections">
        <div className="cms-about__list-heading">
          <div>
            <span>
              WEBSITE CONTENT
            </span>

            <h2>
              About Sections
            </h2>
          </div>

          <span className="cms-about__count">
            {sections.length}
          </span>
        </div>

        <div className="cms-about__section-list">
          {sortedSections.map(
            (section, index) => {
              const content =
                parseContentJson(
                  section.contentJson
                );

              return (
                <article
                  className="cms-about__section-card"
                  key={section.id}
                >
                  <div className="cms-about__order">
                    {String(
                      index + 1
                    ).padStart(2, "0")}
                  </div>

                  {section.imageUrl ? (
                    <div className="cms-about__thumbnail">
                      <img
                        src={getImageUrl(
                          section.imageUrl
                        )}
                        alt=""
                      />
                    </div>
                  ) : (
                    <div className="cms-about__thumbnail cms-about__thumbnail--empty">
                      NO IMAGE
                    </div>
                  )}

                  <div className="cms-about__section-info">
                    <div className="cms-about__section-meta">
                      <span>
                        {section.sectionType}
                      </span>

                      <span
                        className={
                          section.isVisible
                            ? "cms-about__badge cms-about__badge--visible"
                            : "cms-about__badge cms-about__badge--hidden"
                        }
                      >
                        {section.isVisible
                          ? "VISIBLE"
                          : "HIDDEN"}
                      </span>
                    </div>

                    <h3>
                      {content.title ||
                        SECTION_NAMES[
                          section
                            .sectionType
                        ] ||
                        section.sectionType}
                    </h3>

                    {content.highlightedTitle && (
                      <strong>
                        {
                          content.highlightedTitle
                        }
                      </strong>
                    )}

                    {content.description && (
                      <p>
                        {
                          content.description
                        }
                      </p>
                    )}
                  </div>

                  <div className="cms-about__actions">
                    <button
                      type="button"
                      disabled={
                        index === 0
                      }
                      title="Move up"
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
                      title="Move down"
                      onClick={() =>
                        moveSection(
                          section.id,
                          "down"
                        )
                      }
                    >
                      ↓
                    </button>

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
                        startEdit(
                          section
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="cms-about__delete"
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
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}