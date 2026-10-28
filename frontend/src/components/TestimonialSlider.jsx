import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getTestimonials } from "../services/api";
import { useApi } from "../hooks/useApi";
import SectionHeading from "./SectionHeading";
import StateMessage from "./StateMessage";
import "../styles/sections.css";
import "../styles/menu.css";

export default function TestimonialSlider() {
  const { data, loading, error, retry } = useApi((s) => getTestimonials(s), []);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = data?.length || 0;
  const go = (n) => setIndex((n + count) % count);

  useEffect(() => {
    if (reduce || paused || count < 2) return undefined;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearInterval(t);
  }, [reduce, paused, count]);

  const item = count ? data[index % count] : null;

  return (
    <section id="testimonials" className="noire-section noire-section--alt">
      <div className="noire-container">
        <SectionHeading eyebrow="Guest Voices" title="Words from our table." center />

        {loading && <div className="skeleton" style={{ height: 220, maxWidth: 760, margin: "0 auto" }} aria-hidden="true" />}
        {!loading && error && (
          <StateMessage title="We couldn't load the reviews." text="Please try again." onRetry={retry} />
        )}
        {!loading && !error && count === 0 && <StateMessage title="Reviews will appear here soon." />}

        {item && (
          <div
            className="testimonial"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="testimonial__stage" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={item.id}
                  style={{ margin: 0 }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.rating && (
                    <div className="testimonial__stars" role="img" aria-label={`${item.rating} out of 5 stars`}>
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  )}
                  <blockquote className="testimonial__quote">{item.review}</blockquote>
                  <figcaption>
                    <span className="testimonial__name">{item.customer_name}</span>
                    {item.is_sample && (
                      <span className="testimonial__sample">Sample review for demonstration</span>
                    )}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            {count > 1 && (
              <div className="testimonial__controls">
                <button type="button" className="testimonial__arrow" aria-label="Previous review" onClick={() => go(index - 1)}>
                  <ChevronLeft size={18} />
                </button>
                <div className="testimonial__dots">
                  {data.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`testimonial__dot${i === index ? " is-active" : ""}`}
                      aria-label={`Show review ${i + 1}`}
                      aria-current={i === index}
                      onClick={() => setIndex(i)}
                    />
                  ))}
                </div>
                <button type="button" className="testimonial__arrow" aria-label="Next review" onClick={() => go(index + 1)}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}