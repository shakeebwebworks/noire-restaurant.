import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1];

function Lightbox({ items, index, onClose, onChange }) {
  const closeRef = useRef(null);
  const item = items[index];
  const hasMany = items.length > 1;

  const prev = () => onChange((index - 1 + items.length) % items.length);
  const next = () => onChange((index + 1) % items.length);

  // Keyboard: Esc closes, arrows move
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasMany) prev();
      if (e.key === 'ArrowRight' && hasMany) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Lock page scroll, move focus into the dialog, restore it on close
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  if (!item) return null;

  return (
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        className="lightbox__btn lightbox__close"
        aria-label="Close photo viewer"
        onClick={onClose}
      >
        <X size={26} />
      </button>

      {hasMany && (
        <button
          type="button"
          className="lightbox__btn lightbox__nav lightbox__nav--prev"
          aria-label="Previous photo"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
        >
          <ChevronLeft size={30} />
        </button>
      )}

      <motion.figure
        key={item.id}
        className="lightbox__figure"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={item.image} alt={item.caption} />
        <figcaption>
          <span>{item.category_label}</span>
          {item.caption}
          <small>
            {index + 1} / {items.length}
          </small>
        </figcaption>
      </motion.figure>

      {hasMany && (
        <button
          type="button"
          className="lightbox__btn lightbox__nav lightbox__nav--next"
          aria-label="Next photo"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          <ChevronRight size={30} />
        </button>
      )}
    </motion.div>
  );
}

export default Lightbox;