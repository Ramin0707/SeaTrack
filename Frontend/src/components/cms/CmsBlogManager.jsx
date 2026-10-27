import { useCallback, useEffect, useRef, useState } from "react";
import "./CmsBlogManager.css";

const API_URL = "https://localhost:44328";

const emptyForm = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  imageUrl: "",
  authorName: "SeaTrack Team",
  isPublished: false,
};

function getToken() {
  return (
    localStorage.getItem("seatrack_access_token") ||
    sessionStorage.getItem("seatrack_access_token")
  );
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function resolveImageUrl(imageUrl) {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${API_URL}${imageUrl}`;
  }

  return `${API_URL}/${imageUrl}`;
}

async function getApiError(response, fallbackMessage) {
  try {
    const data = await response.json();

    return (
      data?.message ||
      data?.title ||
      data?.detail ||
      fallbackMessage
    );
  } catch {
    return fallbackMessage;
  }
}

export default function CmsBlogManager() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef(null);

  // =========================================================
  // LOAD BLOG POSTS
  // =========================================================

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin access token was not found. Please sign in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/cms/blog`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await getApiError(
          response,
          `Failed to load blog posts (${response.status}).`
        );

        throw new Error(message);
      }

      const data = await response.json();

      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load blog posts."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // =========================================================
  // FORM
  // =========================================================

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  }

  function generateSlug() {
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((current) => ({
      ...current,
      slug,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function startEdit(post) {
    setEditingId(post.id);

    setForm({
      title: post.title ?? "",
      slug: post.slug ?? "",
      summary: post.summary ?? "",
      content: post.content ?? "",
      imageUrl: post.imageUrl ?? "",
      authorName: post.authorName ?? "SeaTrack Team",
      isPublished: post.isPublished ?? false,
    });

    setError("");
    setSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Image size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin access token was not found. Please sign in again."
        );
      }

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/api/admin/cms/media/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const message = await getApiError(
          response,
          `Failed to upload image (${response.status}).`
        );

        throw new Error(message);
      }

      const data = await response.json();

      const uploadedImageUrl =
        data?.imageUrl ||
        data?.url ||
        data?.path ||
        "";

      if (!uploadedImageUrl) {
        throw new Error(
          "Image was uploaded, but the server did not return imageUrl."
        );
      }

      setForm((current) => ({
        ...current,
        imageUrl: uploadedImageUrl,
      }));

      setSuccess("Image uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  function removeImageFromForm() {
    setForm((current) => ({
      ...current,
      imageUrl: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setSuccess("");
    setError("");
  }

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (uploadingImage) {
      setError(
        "Please wait until the image upload is complete."
      );
      return;
    }

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!form.summary.trim()) {
      setError("Summary is required.");
      return;
    }

    if (!form.content.trim()) {
      setError("Content is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin access token was not found. Please sign in again."
        );
      }

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        imageUrl: form.imageUrl || null,
        authorName:
          form.authorName.trim() || "SeaTrack Team",
        isPublished: form.isPublished,
      };

      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/api/admin/cms/blog/${editingId}`
        : `${API_URL}/api/admin/cms/blog`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await getApiError(
          response,
          `Failed to save blog post (${response.status}).`
        );

        throw new Error(message);
      }

      setForm(emptyForm);
      setEditingId(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccess(
        isEditing
          ? "Article updated successfully."
          : "Article created successfully."
      );

      await loadPosts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save blog post."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE
  // =========================================================

  async function deletePost(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Admin access token was not found. Please sign in again."
        );
      }

      const response = await fetch(
        `${API_URL}/api/admin/cms/blog/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await getApiError(
          response,
          `Failed to delete blog post (${response.status}).`
        );

        throw new Error(message);
      }

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      setSuccess("Article deleted successfully.");

      await loadPosts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete blog post."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =========================================================
  // COUNTERS
  // =========================================================

  const publishedCount = posts.filter(
    (post) => post.isPublished
  ).length;

  const draftCount =
    posts.length - publishedCount;

  const previewImageUrl = resolveImageUrl(
    form.imageUrl
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="cms-blog">

      {/* HEADER */}

      <div className="cms-blog__header">
        <div>
          <span className="cms-blog__eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h2>Blog Management</h2>

          <p>
            Create, edit, publish and manage SeaTrack
            website articles.
          </p>
        </div>

        <button
          type="button"
          className="cms-blog__refresh"
          onClick={loadPosts}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* STATS */}

      <div className="cms-blog__stats">
        <div className="cms-blog__stat">
          <span>Total Posts</span>
          <strong>{posts.length}</strong>
        </div>

        <div className="cms-blog__stat">
          <span>Published</span>
          <strong>{publishedCount}</strong>
        </div>

        <div className="cms-blog__stat">
          <span>Drafts</span>
          <strong>{draftCount}</strong>
        </div>
      </div>

      {/* MESSAGES */}

      {error && (
        <div className="cms-blog__error">
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            border:
              "1px solid rgba(38, 208, 199, 0.35)",
            borderRadius: "8px",
            background:
              "rgba(38, 208, 199, 0.08)",
            color: "#2bd9d0",
            fontSize: "14px",
          }}
        >
          {success}
        </div>
      )}

      <div className="cms-blog__layout">

        {/* =====================================================
            FORM
        ===================================================== */}

        <form
          className="cms-blog__form"
          onSubmit={handleSubmit}
        >
          <div className="cms-blog__form-heading">
            <div>
              <span>
                {editingId
                  ? `EDIT POST #${editingId}`
                  : "NEW BLOG POST"}
              </span>

              <h3>
                {editingId
                  ? "Update Article"
                  : "Create Article"}
              </h3>
            </div>

            {editingId && (
              <button
                type="button"
                className="cms-blog__cancel"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>

          {/* TITLE */}

          <label>
            Title

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Article title"
            />
          </label>

          {/* SLUG */}

          <div className="cms-blog__slug-row">
            <label>
              Slug

              <input
                type="text"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                required
                placeholder="article-url-slug"
              />
            </label>

            <button
              type="button"
              onClick={generateSlug}
            >
              Generate
            </button>
          </div>

          {/* SUMMARY */}

          <label>
            Summary

            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Short article summary"
            />
          </label>

          {/* CONTENT */}

          <label>
            Content

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows="10"
              placeholder="Full article content"
            />
          </label>

          {/* =====================================================
              IMAGE
          ===================================================== */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Article Image
            </span>

            {previewImageUrl && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "10px",
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  background: "#031f2b",
                }}
              >
                <img
                  src={previewImageUrl}
                  alt="Article preview"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    bottom: "12px",
                    padding: "6px 10px",
                    borderRadius: "5px",
                    background:
                      "rgba(0, 20, 30, 0.82)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                  }}
                >
                  ARTICLE IMAGE
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              style={{
                width: "100%",
                padding: "12px",
                border:
                  "1px dashed rgba(35, 204, 198, 0.35)",
                borderRadius: "8px",
                background:
                  "rgba(0, 25, 36, 0.6)",
                color: "#9bb8c2",
                cursor: uploadingImage
                  ? "wait"
                  : "pointer",
              }}
            />

            {uploadingImage && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#2bd9d0",
                }}
              >
                Uploading image...
              </div>
            )}

            {form.imageUrl && (
              <>
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "6px",
                    background:
                      "rgba(0, 0, 0, 0.15)",
                    color: "#6f9aa9",
                    fontSize: "11px",
                    wordBreak: "break-all",
                  }}
                >
                  {form.imageUrl}
                </div>

                <button
                  type="button"
                  onClick={removeImageFromForm}
                  style={{
                    alignSelf: "flex-start",
                    padding: "8px 14px",
                    border:
                      "1px solid rgba(255, 110, 110, 0.35)",
                    borderRadius: "6px",
                    background:
                      "rgba(255, 80, 80, 0.06)",
                    color: "#ff8585",
                    cursor: "pointer",
                  }}
                >
                  Remove Image
                </button>
              </>
            )}

            {!form.imageUrl && (
              <div
                style={{
                  padding: "18px",
                  border:
                    "1px dashed rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  textAlign: "center",
                  color: "#5f8491",
                  fontSize: "12px",
                }}
              >
                No image selected
              </div>
            )}
          </div>

          {/* AUTHOR */}

          <label>
            Author

            <input
              type="text"
              name="authorName"
              value={form.authorName}
              onChange={handleChange}
              placeholder="SeaTrack Team"
            />
          </label>

          {/* PUBLISH */}

          <label className="cms-blog__publish">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
            />

            <span>
              Publish this article on the public website
            </span>
          </label>

          {/* SAVE */}

          <button
            type="submit"
            className="cms-blog__save"
            disabled={
              saving ||
              uploadingImage
            }
          >
            {saving
              ? "Saving..."
              : uploadingImage
                ? "Uploading Image..."
                : editingId
                  ? "Update Article"
                  : "Create Article"}
          </button>
        </form>

        {/* =====================================================
            POSTS
        ===================================================== */}

        <div className="cms-blog__posts">
          <div className="cms-blog__posts-heading">
            <div>
              <span>WEBSITE CONTENT</span>
              <h3>Blog Posts</h3>
            </div>

            <strong>{posts.length}</strong>
          </div>

          {loading ? (
            <div className="cms-blog__empty">
              Loading blog posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="cms-blog__empty">
              No blog posts yet.
            </div>
          ) : (
            <div className="cms-blog__post-list">
              {posts.map((post) => {
                const postImage =
                  resolveImageUrl(post.imageUrl);

                return (
                  <article
                    key={post.id}
                    className="cms-blog__post"
                  >
                    {/* IMAGE */}

                    {postImage && (
                      <div
                        style={{
                          width: "100%",
                          height: "170px",
                          marginBottom: "18px",
                          overflow: "hidden",
                          borderRadius: "8px",
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <img
                          src={postImage}
                          alt={post.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "block",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    {/* TOP */}

                    <div className="cms-blog__post-top">
                      <div>
                        <span
                          className={
                            post.isPublished
                              ? "cms-blog__status cms-blog__status--published"
                              : "cms-blog__status cms-blog__status--draft"
                          }
                        >
                          {post.isPublished
                            ? "Published"
                            : "Draft"}
                        </span>

                        <span className="cms-blog__id">
                          #{post.id}
                        </span>
                      </div>

                      <div className="cms-blog__actions">
                        <button
                          type="button"
                          onClick={() =>
                            startEdit(post)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="cms-blog__delete"
                          disabled={
                            deletingId === post.id
                          }
                          onClick={() =>
                            deletePost(post.id)
                          }
                        >
                          {deletingId === post.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>

                    {/* TITLE */}

                    <h4>{post.title}</h4>

                    {/* SUMMARY */}

                    <p>{post.summary}</p>

                    {/* META */}

                    <div className="cms-blog__meta">
                      <span>
                        Slug: /{post.slug}
                      </span>

                      <span>
                        Author:{" "}
                        {post.authorName ||
                          "SeaTrack Team"}
                      </span>

                      <span>
                        Created:{" "}
                        {formatDate(
                          post.createdAtUtc
                        )}
                      </span>

                      <span>
                        Updated:{" "}
                        {formatDate(
                          post.updatedAtUtc
                        )}
                      </span>

                      <span>
                        Published:{" "}
                        {formatDate(
                          post.publishedAtUtc
                        )}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}