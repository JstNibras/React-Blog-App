import { Link, useParams } from "react-router-dom";

export default function BlogDetails() {
    const {id} = useParams();

    return (
        <main className="app-page">
            <section className="blog-content">
                <Link to="/blog">← Back to blogs</Link>
                <h1>Blog Deatails</h1>
                <p>Blog ID : {id}</p>
                <p>autaul blog in session 5</p>
            </section>
        </main>
    )
}