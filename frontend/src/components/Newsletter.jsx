import { useState } from "react";
import { ApiError, subscribeNewsletter } from "../services/api";
import "../styles/sections.css";
import "../styles/reservation.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      await subscribeNewsletter(email.trim());
      setEmail("");
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof ApiError && err.status === 429
          ? "Too many attempts. Please try again later."
          : "We couldn't subscribe you. Please try again."
      );
    }
  };

  return (
    <section className="newsletter" aria-labelledby="newsletter-title">
      <div className="noire-container">
        <span className="eyebrow">Newsletter</span>
        <h2 id="newsletter-title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
          News from our kitchen.
        </h2>
        <p>Seasonal menus and private events, sent occasionally. Unsubscribe any time.</p>

        {status === "done" ? (
          <div className="form-success" role="status" style={{ maxWidth: 560 }}>
            Thank you for subscribing.
          </div>
        ) : (
          <form className="newsletter__form" onSubmit={submit} noValidate>
            <div className="noire-field">
              <label htmlFor="newsletter-email">Email address</label>
              <input
                id="newsletter-email"
                className="noire-input"
                type="email"
                autoComplete="email"
                value={email}
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "newsletter-error" : undefined}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
              />
              {error && <p className="noire-error" id="newsletter-error" role="alert">{error}</p>}
            </div>
            <button type="submit" className="btn-noire" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}