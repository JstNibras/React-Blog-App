import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog } from "../services/blogService";
import { useAuth } from "../hooks/useAuth";
import type { Blog } from "../types/blog"; 

export default function BlogDetails() {
    const {id} = useParams<{id: string}>();
    const { user } = useAuth();

    const navigate = useNavigate()

    const [blog, setBlog] = useState<Blog | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [deleting, setDeleting] = useState(false)

    const isAuthor = user?.uid === blog?.authorId;

    useEffect(() => {
        async function fetchBlog() {
            if(!id) {
                setError("Invalid blog ID")
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError("")
                const result = await getBlogById(id)

                if(!result) {
                    setError("Blog not found")
                } else {
                    setBlog(result)
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Faild to load blog")
            } finally {
                setLoading(false)
            }
        }

        void fetchBlog()
    }, [id])

    if(loading) {
       return (
            <main className="app-page">
                <p className="page-description">Loading blog...</p>
            </main>
        ); 
    }

    if (error || !blog) {
        return (
            <main className="app-page">
                <Link className="secondary-button" to="/blog">
                ← Back to blogs
                </Link>

                <div className="empty-state">
                <h2>Unable to display blog</h2>
                <p>{error || "Blog not found."}</p>
                </div>
            </main>
        );
    }

    async function handleDelete() {

        if (!blog || !isAuthor) {
            return;
        }

        const confirmed = window.confirm("Are You sure to delete this blog")

        if (!confirmed) return

        try {
            setDeleting(true)
            const deleteId = blog.id
            await deleteBlog(deleteId)
            const deletedBlog = await getBlogById(deleteId)
            if (deletedBlog !== null) {
                setError("The blog still exists in Firestore after deletion.");
                return;
            }
            navigate("/blog", { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete blog")
        } finally {
            setDeleting(false)
        }
    }
    
    return (
        <main className="app-page">
            <header className="app-header">
                <Link className="secondary-button" to="/blog">
                ← Back to blogs
                </Link>
            </header>

            <article className="blog-detail">
                <h1>{blog.title}</h1>

                <div className="blog-meta">
                <span>Written by {blog.authorEmail}</span>
                <span>
                    Published on{" "}
                    {blog.createdAt.toLocaleDateString()}
                </span>
                {blog.updatedAt.getTime() !== blog.createdAt.getTime() && (
                    <span>
                    Updated on {blog.updatedAt.toLocaleDateString()}
                    </span>
                )}
                </div>

                <div className="blog-full-content">
                {blog.content}
                </div>

                {isAuthor && (
                    <div className="blog-actions">
                        <Link
                        className="primary-link"
                        to={`/blog/edit/${blog.id}`}
                        >
                        Edit blog
                        </Link>

                        <button
                        className="danger-button"
                        onClick={handleDelete}
                        disabled={deleting}
                        >
                        {deleting ? "Deleting..." : "Delete blog"}
                        </button>
                    </div>
                )}
            </article>
        </main>
    )
}