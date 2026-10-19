import { Link } from "react-router-dom";

export default function CreateBlog() {
    return (
        <main className="blog-content">
            <Link to="/blog">← Back to blogs</Link>
            <h1>Create a blog</h1>
            <p>The blog editor will be implemented in Session 5.</p>
        </main>
    )
}