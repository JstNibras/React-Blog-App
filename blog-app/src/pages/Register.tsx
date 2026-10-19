import { useState, type FormEvent } from "react";
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
        <section>
            <h2 className="form-title">Create your account</h2>

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
        </section>
    )
}