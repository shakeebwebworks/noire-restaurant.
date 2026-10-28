import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getGallery } from "../services/api";
import { useApi } from "../hooks/useApi";
import SectionHeading from "./SectionHeading";
import StateMessage from "./StateMessage";
import "../styles/sections.css";
import "../styles/menu.css";

const FILTERS = [
  ["", "All"], ["food", "Food"], ["interior", "Interior"],
  ["dining", "Dining"], ["chefs", "Chefs"],
];

export default function Gallery({ limit, filters = false, heading = true }) {
  const [category, setCategory] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const trigger = useRef(null);
  const closeBtn = useRef(null);

  const { data, loading, error, retry } = useApi(
    (s) => getGallery({ category }, s),
    [category]
  );
  const images = data ? (limit ? data.slice(0, limit) : data) : [];

  const close = useCallback(() => {
    setOpenIndex(null);
    trigger.current?.focus();
  }, []);
  const step = useCallback(
    (dir) => setOpenIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

  const current = openIndex !== null ? images[openIndex] : null;

  return (
    <section id="gallery" className={heading ? "noire-section" : undefined}>
      <div className="noire-container">
        {heading && (
          <SectionHeading
            eyebrow="Gallery"
            title="The atmosphere, the plates, the people."
          />
        )}

        {filters && (
          <div className="menu-filters" role="group" aria-label="Filter photos">
            {FILTERS.map(([slug, name]) => (
              <button
                key={slug || "all"}
                type="button"
                className={`menu-filter${category === slug ? " is-active" : ""}`}
                aria-pressed={category === slug}
                onClick={() => setCategory(slug)}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="gallery-grid" aria-hidden="true">
            {[260, 340, 300, 380, 280, 320].map((h, i) => (
              <div key={i} className="skeleton" style={{ height: h, marginBottom: "1rem" }} />
            ))}
          </div>
        )}
        {!loading && error && (
          <StateMessage title="We couldn't load the gallery." text="Please try again." onRetry={retry} />
        )}
        {!loading && !error && images.length === 0 && (
          <StateMessage title="Photographs are coming soon." text="Please check back shortly." />
        )}

        {!loading && !error && images.length > 0 && (
          <div className="gallery-grid">
            {images.map((img, i) => (
              <motion.button
                key={img.id}
                type="button"
                className="gallery-item"
                aria-label={`Open photo: ${img.alt_text}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => {
                  trigger.current = e.currentTarget;
                  setOpenIndex(i);
                }}
              >
                <img src={img.image} alt={img.alt_text} loading="lazy" />
                {img.caption && <span className="gallery-item__overlay">{img.caption}</span>}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.target === e.currentTarget && close()}
          >
            <button ref={closeBtn} type="button" className="lightbox__btn lightbox__close" aria-label="Close" onClick={close}>
              <X size={22} />
            </button>
            {images.length > 1 && (
              <>
                <button type="button" className="lightbox__btn lightbox__prev" aria-label="Previous photo" onClick={() => step(-1)}>
                  <ChevronLeft size={22} />
                </button>
                <button type="button" className="lightbox__btn lightbox__next" aria-label="Next photo" onClick={() => step(1)}>
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <img src={current.image} alt={current.alt_text} />
            {current.caption && <p className="lightbox__caption">{current.caption}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}