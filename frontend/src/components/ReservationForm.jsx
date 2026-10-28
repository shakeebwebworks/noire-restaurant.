import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { ApiError, createReservation } from "../services/api";
import "../styles/reservation.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY = {
  name: "", email: "", phone: "", date: "", time: "", guests: "2", special_requests: "",
};

const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function label12(t) {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
}

function validate(v, info, minDate, maxDate, dayInfo) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";

  const digits = v.phone.replace(/\D/g, "");
  if (!/^[0-9+\-\s()]+$/.test(v.phone.trim()) || digits.length < 7 || digits.length > 15) {
    e.phone = "Please enter a valid phone number.";
  }

  if (!v.date) e.date = "Please choose a date.";
  else if (v.date < minDate) e.date = "Please choose today or a future date.";
  else if (v.date > maxDate) e.date = `Bookings open up to ${info.max_days_ahead} days ahead.`;
  else if (dayInfo?.is_closed) e.date = "We are closed on that day. Please choose another date.";

  if (!e.date && !v.time) e.time = "Please choose a time.";

  const g = Number(v.guests);
  if (!Number.isInteger(g) || g < 1 || g > info.max_guests) {
    e.guests = `Please choose between 1 and ${info.max_guests} guests.`;
  }
  if (v.special_requests.length > 500) {
    e.special_requests = "Please keep special requests under 500 characters.";
  }
  return e;
}

function Field({ id, label, error, hint, className = "", children }) {
  return (
    <div className={`noire-field ${className}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="noire-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

export default function ReservationForm({ info }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null);

  const minDate = toISO(new Date());
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + info.max_days_ahead);
    return toISO(d);
  }, [info.max_days_ahead]);

  const dayInfo = useMemo(() => {
    if (!values.date) return null;
    const d = new Date(`${values.date}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return info.hours.find((h) => h.weekday === (d.getDay() + 6) % 7) || null;
  }, [values.date, info.hours]);

  const slots = dayInfo?.slots ?? [];

  const change = (name) => (e) => {
    const v = e.target.value;
    setValues((prev) => ({ ...prev, [name]: v, ...(name === "date" ? { time: "" } : {}) }));
    setErrors((prev) => ({ ...prev, [name]: undefined, ...(name === "date" ? { time: undefined } : {}) }));
    setFormError("");
  };

  const props = (name) => ({
    id: `res-${name}`,
    value: values[name],
    onChange: change(name),
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `res-${name}-error` : undefined,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validate(values, info, minDate, maxDate, dayInfo);
    setErrors(found);
    if (Object.keys(found).length) {
      setFormError("Please review the highlighted details.");
      return;
    }

    setStatus("submitting");
    setFormError("");
    try {
      const data = await createReservation({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        date: values.date,
        time: values.time,
        guests: Number(values.guests),
        special_requests: values.special_requests.trim(),
      });
      setResult(data);
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      if (err instanceof ApiError && err.status === 400 && err.data) {
        const fieldErrors = {};
        for (const [key, msg] of Object.entries(err.data)) {
          fieldErrors[key] = Array.isArray(msg) ? msg[0] : String(msg);
        }
        setErrors(fieldErrors);
        setFormError("Your request was not accepted. Please review the highlighted details.");
      } else if (err instanceof ApiError && err.status === 429) {
        setFormError("Too many requests. Please wait a while or contact the restaurant directly.");
      } else {
        setFormError(
          "We couldn't send your request. Please try again, or contact the restaurant directly."
        );
      }
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setResult(null);
    setFormError("");
    setStatus("idle");
  };

  if (status === "success" && result) {
    const niceDate = new Date(`${result.date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    return (
      <motion.div
        className="booking-card booking-success"
        role="status"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <CheckCircle2 size={44} />
        <h3>Request received</h3>
        <p>
          Thank you, {result.name}. We have your request for {result.guests}{" "}
          {result.guests === 1 ? "guest" : "guests"} on {niceDate} at{" "}
          {label12(result.time.slice(0, 5))}.
        </p>
        <span className="booking-ref">{result.reference}</span>
        <p>
          <strong>This is a request, not a confirmed booking.</strong> The restaurant will
          confirm by phone or email. Please keep your reference.
        </p>
        <button type="button" className="btn-noire-outline" onClick={reset}>
          Make another request
        </button>
      </motion.div>
    );
  }

  return (
    <form className="booking-card" onSubmit={onSubmit} noValidate>
      {formError && (
        <div className="form-alert" role="alert">{formError}</div>
      )}

      <div className="booking-grid">
        <Field id="res-name" label="Full name" error={errors.name}>
          <input className="noire-input" type="text" autoComplete="name" maxLength={100} {...props("name")} />
        </Field>

        <Field id="res-email" label="Email" error={errors.email}>
          <input className="noire-input" type="email" autoComplete="email" {...props("email")} />
        </Field>

        <Field id="res-phone" label="Phone" error={errors.phone}>
          <input className="noire-input" type="tel" autoComplete="tel" maxLength={20} {...props("phone")} />
        </Field>

        <Field
          id="res-guests"
          label="Guests"
          error={errors.guests}
          hint={`Parties of more than ${info.max_guests}: please contact us directly.`}
        >
          <select className="noire-input" {...props("guests")}>
            {Array.from({ length: info.max_guests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
            ))}
          </select>
        </Field>

        <Field id="res-date" label="Date" error={errors.date}>
          <input className="noire-input" type="date" min={minDate} max={maxDate} {...props("date")} />
        </Field>

        <Field id="res-time" label="Time" error={errors.time}>
          <select className="noire-input" disabled={!values.date || slots.length === 0} {...props("time")}>
            <option value="">
              {!values.date
                ? "Choose a date first"
                : slots.length === 0
                ? "Closed on this day"
                : "Select a time"}
            </option>
            {slots.map((s) => (
              <option key={s} value={s}>{label12(s)}</option>
            ))}
          </select>
        </Field>

        <Field
          id="res-special_requests"
          label="Special requests (optional)"
          error={errors.special_requests}
          className="span-2"
        >
          <textarea className="noire-input" rows={3} maxLength={500} {...props("special_requests")} />
        </Field>
      </div>

      <button type="submit" className="btn-noire booking-submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Request Reservation"}
      </button>
    </form>
  );
}