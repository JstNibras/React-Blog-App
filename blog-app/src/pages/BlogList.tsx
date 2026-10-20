import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getBlogs } from "../services/blogService";
import type { Blog } from "../types/blog"; 

export default function BlogList(){
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchBlogs(){
            try {
                setLoading(true)
                setError("");
                const data = await getBlogs()
                setBlogs(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Faild to load blogs")
            } finally {
                setLoading(false)
            }
        }

        void fetchBlogs()
    }, [location.key])

    async function handleLogout() {
        try {
            await logout()
            navigate("/login")
        } catch (error){
            console.error("Logout Failed :", error)
        } 
    }

    return (
        <main className="app-page">
            <header className="app-header">
                <Link className="app-brand" to="/blog">
                Blog App
                </Link>

                <div className="header-actions">
                {user ? (
                    <>
                    <span>{user.email}</span>
                    <button
                        className="secondary-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    </>
                ) : (
                    <Link className="secondary-button" to="/login">
                    Login
                    </Link>
                )}
                </div>
            </header>

            <section className="blog-content">
                <h1>Discover stories</h1>
                <p className="page-description">
                Read and share ideas with the community.
                </p>

                {user && (
                    <Link className="primary-link" to="/blog/new">
                        + Create a blog
                    </Link>
                )}

                {loading ? (
                    <p className="empty-state">Loading blogs...</p>
                    ) : error ? (
                    <p className="error-message" role="alert">{error}</p>
                    ) : blogs.length === 0 ? (
                    <p className="empty-state">
                        No blogs yet. Be the first to share a story!
                    </p>
                    ) : (
                    <div className="blog-grid">
                        {blogs.map((blog) => (
                        <article className="blog-card" key={blog.id}>
                            <h2>{blog.title}</h2>

                            <p className="blog-excerpt">
                            {blog.content.length > 180
                                ? `${blog.content.slice(0, 180)}...`
                                : blog.content}
                            </p>

                            <div className="blog-meta">
                            <span>By {blog.authorEmail || "Unknown author"}</span>
                            <span>
                                {blog.createdAt.toLocaleDateString()}
                            </span>
                            </div>

                            <Link
                            className="read-more"
                            to={`/blog/${blog.id}`}
                            >
                            Read more →
                            </Link>
                        </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}