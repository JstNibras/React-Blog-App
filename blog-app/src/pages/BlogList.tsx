import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getBlogs } from "../services/blogService";
import type { Blog } from "../types/blog"; 

export default function BlogList(){
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [search, setSearch] = useState("")
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");
    const [currentPage, setCurrentPage] = useState(1)

    const blogsPerPage = 6

    const filteredBlogs = blogs.filter((blog) => {
        const searchTerm = search.trim().toLowerCase();

        return (
            blog.title.toLowerCase().includes(searchTerm) ||
            blog.content.toLowerCase().includes(searchTerm)
        )
    })

    const sortedBlogs = [...filteredBlogs].sort((a, b) => {
        switch (sortBy) {
            case "oldest":
                return a.createdAt.getTime() - b.createdAt.getTime()

            case "title": 
                return a.title.localeCompare(b.title);

            case "newest":
                default:
                    return b.createdAt.getTime() - a.createdAt.getTime()
        }
    })

    const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;

    const paginatedBlogs = sortedBlogs.slice(startIndex, startIndex + blogsPerPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [search, sortBy])

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

                <div className="blog-search">
                    <input
                        type="search"
                        placeholder="Search blogs by title or content..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Search blogs"
                    />
                </div>

                <div className="blog-toolbar">
                    <label htmlFor="sort-blogs">Sort by</label>

                    <select
                        id="sort-blogs"
                        value={sortBy}
                        onChange={(event) =>
                        setSortBy(
                            event.target.value as "newest" | "oldest" | "title"
                        )
                        }
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                        <option value="title">Title A–Z</option>
                    </select>
                </div>

                <div>
                    <hr></hr>
                    <hr></hr>
                </div>

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
                            {search.trim()
                            ? "No blogs match your search."
                            : "No blogs yet. Be the first to share a story!"}
                        </p>
                    ) : (
                    <div className="blog-grid">
                        {paginatedBlogs.map((blog) => (
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
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                        className="secondary-button"
                        onClick={() =>
                            setCurrentPage((page) => Math.max(1, page - 1))
                        }
                        disabled={currentPage === 1}
                        >
                        ← Previous
                        </button>

                        <span>
                        Page {currentPage} of {totalPages}
                        </span>

                        <button
                        className="secondary-button"
                        onClick={() =>
                            setCurrentPage((page) => Math.min(totalPages, page + 1))
                        }
                        disabled={currentPage === totalPages}
                        >
                        Next →
                        </button>
                    </div>
                )}
            </section>
        </main>
    )
}