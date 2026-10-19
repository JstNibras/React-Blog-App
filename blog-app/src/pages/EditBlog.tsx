import { Link, useParams } from "react-router-dom";

export default function EditBlog() {
  const { id } = useParams();

  return (
    <main className="blog-content">
      <Link to="/blog">← Back to blogs</Link>
      <h1>Edit blog</h1>
      <p>Blog ID: {id}</p>
      <p>The edit form will be implemented in Session 6.</p>
    </main>
  );
}