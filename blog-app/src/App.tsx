import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import Login from './pages/Login';
import Register from './pages/Register';
import "./index.css";

function App() {
  
  const { user, loading, logout } = useAuth()
  const [page, setPage] = useState<"login" | "register">("login");
  const [logoutError, setLogoutError] = useState("");

  async function handleLogout() {
    setLogoutError("")

    try {
      await logout()
    } catch {
      setLogoutError("Unable to log out. Please try again.");
    }
  }

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="loading-text">Checking your session...</p>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="auth-page">
        <section className="auth-card welcome-card">
          <div className="brand-icon">B</div>
          <h1>Welcome to Blog App</h1>
          <p className="auth-subtitle">
            You are successfully logged in.
          </p>

          <p className="user-email">{user.email}</p>

          <button className="auth-button" onClick={handleLogout}>
            Logout
          </button>

          {logoutError && (
            <p className="error-message" role="alert">
              {logoutError}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-icon">B</div>

        <h1>Blog App</h1>
        <p className="auth-subtitle">
          Your space to share stories and ideas.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${page === "login" ? "active" : ""}`}
            onClick={() => setPage("login")}
          >
            Login
          </button>

          <button
            type="button"
            className={`auth-tab ${page === "register" ? "active" : ""}`}
            onClick={() => setPage("register")}
          >
            Create account
          </button>
        </div>

        {page === "login" ? <Login /> : <Register />}

        <p className="auth-footer">
          {page === "login"
            ? "New here? Create an account to get started."
            : "Already have an account? Sign in instead."}
        </p>
      </section>
    </main>
  );
}

export default App
