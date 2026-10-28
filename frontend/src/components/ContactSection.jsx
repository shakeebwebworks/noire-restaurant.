import { useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ApiError, sendContact } from "../services/api";
import { site } from "../config/site";
import SectionHeading from "./SectionHeading";
import "../styles/sections.css";
import "../styles/reservation.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = { name: "", email: "", phone: "", subject: "", message: "" };
const MAP_EMBED = import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL;
const MAP_LINK = import.meta.env.VITE_GOOGLE_MAPS_URL;

function check(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  const digits = v.phone.replace(/\D/g, "");
  if (v.phone.trim() && (!/^[0-9+\-\s()]+$/.test(v.phone) || digits.length < 7 || digits.length > 15)) {
    e.phone = "Please enter a valid phone number.";
  }
  if (v.subject.trim().length < 3) e.subject = "Please enter a subject.";
  if (v.message.trim().length < 10) e.message = "Please write a little more (at least 10 characters).";
  return e;
}

function Field({ name, label, error, children }) {
  return (
    <div className="noire-field">
      <label htmlFor={`contact-${name}`}>{label}</label>
      {children}
      {error && <p className="noire-error" id={`contact-${name}-error`}>{error}</p>}
    </div>
  );
}

export default function ContactSection() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [formError, setFormError] = useState("");

  const change = (name) => (e) => {
    setValues((p) => ({ ...p, [name]: e.target.value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setFormError("");
    if (status === "sent") setStatus("idle");
  };

  const props = (name) => ({
    id: `contact-${name}`,
    className: "noire-input",
    value: values[name],
    onChange: change(name),
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
  });

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    const found = check(values);
    setErrors(found);
    if (Object.keys(found).length) {
      setFormError("Please review the highlighted details.");
      return;
    }
    setStatus("sending");
    try {
      await sendContact({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setValues(EMPTY);
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      if (err instanceof ApiError && err.status === 400 && err.data) {
        const fe = {};
        for (const [k, m] of Object.entries(err.data)) fe[k] = Array.isArray(m) ? m[0] : String(m);
        setErrors(fe);
        setFormError("Your message was not sent. Please review the highlighted details.");
      } else if (err instanceof ApiError && err.status === 429) {
        setFormError("Too many messages sent. Please try again later.");
      } else {
        setFormError("We couldn't send your message. Please try again.");
      }
    }
  };

  return (
    <section id="contact" className="noire-section">
      <div className="noire-container">
        <div className="contact-grid">
          <div>
            <SectionHeading
              eyebrow="Visit Us"
              title="Find your way to NOIRÉ."
              text="Demo contact details are shown below until the owner supplies the real ones."
            />
            <ul className="contact-list">
              <li><MapPin size={18} /><span>{site.address}</span></li>
              <li><Phone size={18} /><span>{site.phone}</span></li>
              <li><Mail size={18} /><a href={`mailto:${site.email}`}>{site.email}</a></li>
              {site.hours.map((h) => (
                <li key={h.days}>
                  <Clock size={18} />
                  <span>{h.days}: {h.time}</span>
                </li>
              ))}
            </ul>

            {MAP_LINK && (
              <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="btn-noire-outline">
                Get Directions
              </a>
            )}
            {MAP_EMBED && (
              <div className="map-frame">
                <iframe
                  title="Map showing the restaurant's location"
                  src={MAP_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          <form className="booking-card" onSubmit={submit} noValidate>
            <h3>Send us a message</h3>
            {status === "sent" && (
              <div className="form-success" role="status">
                Thank you. Your message has been sent and the team will reply soon.
              </div>
            )}
            {formError && <div className="form-alert" role="alert">{formError}</div>}

            <div className="booking-grid">
              <Field name="name" label="Name" error={errors.name}>
                <input type="text" autoComplete="name" maxLength={100} {...props("name")} />
              </Field>
              <Field name="email" label="Email" error={errors.email}>
                <input type="email" autoComplete="email" {...props("email")} />
              </Field>
              <Field name="phone" label="Phone (optional)" error={errors.phone}>
                <input type="tel" autoComplete="tel" maxLength={20} {...props("phone")} />
              </Field>
              <Field name="subject" label="Subject" error={errors.subject}>
                <input type="text" maxLength={150} {...props("subject")} />
              </Field>
              <div className="span-2">
                <Field name="message" label="Message" error={errors.message}>
                  <textarea rows={4} maxLength={2000} {...props("message")} />
                </Field>
              </div>
            </div>

            <button type="submit" className="btn-noire booking-submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}