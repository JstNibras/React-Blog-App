import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function BlogList(){
    const {user, logout} = useAuth();
    const navigate = useNavigate()

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

                <p className="empty-state">
                Your blog list will appear here in Session 5.
                </p>
            </section>
        </main>
    )
}