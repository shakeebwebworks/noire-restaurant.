import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Fades and slides its children up when they scroll into view.
 * Usage: <Reveal delay={0.1}>...content...</Reveal>
 */
function Reveal({ children, delay = 0, y = 32, className = '', as = 'div' }) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}

export default Reveal;
