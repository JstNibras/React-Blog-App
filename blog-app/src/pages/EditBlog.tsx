import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getBlogById, updateBlog } from "../services/blogService";
import type { Blog } from "../types/blog";
import { validateBlog } from "../utils/blogValidation";

export default function EditBlog() {
  const { id } = useParams<{id:string}>();
  const { user } = useAuth();
  const navigate = useNavigate()

  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlog() {
      if(!id) {
        setError("Invalid Blog ID")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError("")
        const result  = await getBlogById(id)
        if(!result) {
          setError("Blog not found")
          return
        }

        if(result.authorId !== user?.uid){
          setError("You are not authorized")
          return
        }

        setBlog(result)
        setTitle(result.title)
        setContent(result.content)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load blog")
      } finally {
        setLoading(false)
      }
    }
    void fetchBlog()
  }, [id, user?.uid])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const validation = validateBlog({ title, content });

    if (!id || !blog || blog.authorId !== user?.uid) {
      setError("You are not authorized to edit this blog.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      setSubmitting(true);

      await updateBlog(id, {
        title: title.trim(),
        content: content.trim(),
      });

      navigate(`/blog/${id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update blog."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="app-page">
        <p className="page-description">Loading blog...</p>
      </main>
    );
  }

  if (error && !blog) {
    return (
      <main className="app-page">
        <Link className="secondary-button" to="/blog">
          ← Back to blogs
        </Link>
        <div className="empty-state">
          <h2>Unable to edit blog</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <header className="app-header">
        <Link className="secondary-button" to={`/blog/${id}`}>
          ← Back to blog
        </Link>
      </header>

      <section className="edit-blog-content">
        <h1>Edit blog</h1>
        <p className="page-description">
          Update your title and content below.
        </p>

        <form className="blog-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={150}
              required
            />
            <p className="character-count">
              {title.length}/150 characters
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              required
            />
            <p className="character-count">
              {content.length}/10000 characters
            </p>
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <div className="blog-actions">
            <button
              className="auth-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save changes"}
            </button>

            <Link className="secondary-button" to={`/blog/${id}`}>
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}