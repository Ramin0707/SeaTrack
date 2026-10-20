import { useCallback, useEffect, useState } from "react";
import "./CmsBlogManager.css";

const API_URL = "http://localhost:5080";

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

  return new Date(value).toLocaleString();
}

export default function CmsBlogManager() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/cms/blog`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load blog posts (${response.status}).`
        );
      }

      const data = await response.json();

      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function generateSlug() {
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((current) => ({
      ...current,
      slug,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function startEdit(post) {
    setEditingId(post.id);

    setForm({
      title: post.title ?? "",
      slug: post.slug ?? "",
      summary: post.summary ?? "",
      content: post.content ?? "",
      imageUrl: post.imageUrl ?? "",
      authorName: post.authorName ?? "",
      isPublished: post.isPublished ?? false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const token = getToken();

      const payload = {
        title: form.title,
        slug: form.slug,
        summary: form.summary,
        content: form.content,
        imageUrl: form.imageUrl || null,
        authorName: form.authorName || null,
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
        throw new Error(
          `Failed to save blog post (${response.status}).`
        );
      }

      resetForm();
      await loadPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deletePost(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog post?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/cms/blog/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok && response.status !== 204) {
        throw new Error(
          `Failed to delete blog post (${response.status}).`
        );
      }

      if (editingId === id) {
        resetForm();
      }

      await loadPosts();
    } catch (err) {
      setError(err.message);
    }
  }

  const publishedCount = posts.filter(
    (post) => post.isPublished
  ).length;

  const draftCount = posts.length - publishedCount;

  return (
    <div className="cms-blog">
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
        >
          Refresh
        </button>
      </div>

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

      {error && (
        <div className="cms-blog__error">
          {error}
        </div>
      )}

      <div className="cms-blog__layout">
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

          <label>
            Content
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows="9"
              placeholder="Full article content"
            />
          </label>

          <label>
            Image URL
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

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

          <button
            type="submit"
            className="cms-blog__save"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Article"
                : "Create Article"}
          </button>
        </form>

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
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="cms-blog__post"
                >
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
                        onClick={() => startEdit(post)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="cms-blog__delete"
                        onClick={() => deletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <h4>{post.title}</h4>

                  <p>{post.summary}</p>

                  <div className="cms-blog__meta">
                    <span>
                      Slug: /{post.slug}
                    </span>

                    <span>
                      Author: {post.authorName || "—"}
                    </span>

                    <span>
                      Created: {formatDate(post.createdAtUtc)}
                    </span>

                    <span>
                      Updated: {formatDate(post.updatedAtUtc)}
                    </span>

                    <span>
                      Published:{" "}
                      {formatDate(post.publishedAtUtc)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}