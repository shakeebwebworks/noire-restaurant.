import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * An image that is revealed with a soft wipe and slow zoom on scroll.
 * The box has a fixed aspect ratio, so the page never jumps while loading.
 */
function RevealImage({ src, alt, aspect = '4 / 5', className = '' }) {
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  const hiddenClip = reduceMotion ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)';
  const startScale = reduceMotion ? 1 : 1.25;

  return (
    <motion.div
      className={`reveal-image ${className}`}
      style={{ aspectRatio: aspect }}
      initial={{ clipPath: hiddenClip }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      {!failed ? (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          initial={{ scale: startScale }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.8, ease: EASE }}
        />
      ) : (
        <div className="reveal-image__fallback" role="img" aria-label={alt} />
      )}
    </motion.div>
  );
}

export default RevealImage;