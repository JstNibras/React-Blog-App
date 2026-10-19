import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

export default function login() {
    const { login } = useAuth()

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
            await login(email.trim(), password);
            setSuccess("Logged in successfully!")
            setPassword("")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login Failed"
            setError(message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section>
            <h2 className="form-title">Welcome back</h2>

            <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="login-email">Email address</label>
                <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                />
            </div>

            <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                />
            </div>

            <button className="auth-button" type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Sign in"}
            </button>
            </form>

            {error && <p className="error-message" role="alert">{error}</p>}
            {success && <p className="success-message" role="status">{success}</p>}
        </section>
    )
}