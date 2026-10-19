import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
    const { register } = useAuth()

    const [ email, setEmail] = useState("")
    const [ password, setPassword ] = useState("")
    const [error, setError] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState("")

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true)

        try {
            await register(email.trim(), password);
            setSuccess("Account created")
            setPassword("")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Registration Failed"
            setError(message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="brand-icon">B</div>
                <h1>Blog App</h1>
                <p className="auth-subtitle">
                    Create an account to start sharing your stories.
                </p>

                <h2 className="form-title">Create account</h2>

                <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="register-email">Email address</label>
                    <input
                    id="register-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <input
                    id="register-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                    />
                </div>

                <button className="auth-button" type="submit" disabled={submitting}>
                    {submitting ? "Creating account..." : "Create account"}
                </button>
                </form>

                {error && <p className="error-message" role="alert">{error}</p>}
                {success && <p className="success-message" role="status">{success}</p>}

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </section>
        </main> 
    )
}