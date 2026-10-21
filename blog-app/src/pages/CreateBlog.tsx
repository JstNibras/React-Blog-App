import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { createBlog } from "../services/blogService";
import { validateBlog } from "../utils/blogValidation";

export default function CreateBlog() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("");
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("")
        
        if(!user) {
            setError("You must be logged in")
            return
        }

        const validation = validateBlog({title, content});
        const trimmedTitle = title.trim()
        const trimmedContent = content.trim()

        if (!trimmedTitle || !trimmedContent) {
            setError("Title and Content needed")
        }

        if (!validation.valid) {
            setError(validation.error);
            return;
        }

        setSubmitting(true)

        try {
            await createBlog({
                title: trimmedTitle,
                content: trimmedContent,
                authorId: user.uid,
                authorEmail: user.email ?? "",
            })
            navigate("/blog")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create blog")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="app-page">
            <section className="blog-content">
                <Link to="/blog">← Back to blogs</Link>

                <h1>Create a blog</h1>
                <p className="page-description">
                Share your thoughts and ideas with the community.
                </p>

                <form className="blog-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="blog-title">Title</label>
                    <input
                    id="blog-title"
                    type="text"
                    placeholder="Enter your blog title"
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
                    <label htmlFor="blog-content">Content</label>
                    <textarea
                    id="blog-content"
                    placeholder="Write your blog here..."
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={10}
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

                <button
                    className="auth-button"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? "Publishing..." : "Publish blog"}
                </button>
                </form>
            </section>
        </main>
    )
}