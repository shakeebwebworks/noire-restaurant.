import { MessageCircle } from "lucide-react";
import "../styles/sections.css";

// Digits only, international format (e.g. 919876543210). Empty = button hidden.
const number = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const valid = number.length >= 7 && number.length <= 15;

export default function WhatsAppButton() {
  if (!valid) return null;

  // The prefilled text contains no personal information
  const text = "Hello NOIRÉ, I would like to ask about a reservation.";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

  return (
    <a
      className="whatsapp-btn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with NOIRÉ on WhatsApp"
    >
      <MessageCircle size={24} />
    </a>
  );
}