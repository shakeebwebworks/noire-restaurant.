import { Link } from "react-router-dom";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.25 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 90]);

  return (
    <section className="hero" aria-label="Welcome to NOIRÉ">
      <motion.div className="hero__bg-wrap" style={{ y }} aria-hidden="true">
        <div className="hero__bg" />
      </motion.div>
      <div className="hero__overlay" aria-hidden="true" />

      <div className="noire-container hero__content">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span className="eyebrow" variants={item}>
            An experience in every detail
          </motion.span>

          <motion.h1 className="hero__title" variants={item}>
            Where Every Moment Becomes a Memory.
          </motion.h1>

          <motion.p className="hero__text" variants={item}>
            Contemporary cuisine, considered service, and an atmosphere made
            for the evenings you will want to remember.
          </motion.p>

          <motion.div className="hero__actions" variants={item}>
            <Link to="/reservations" className="btn-noire">
              Reserve Your Table
            </Link>
            <Link to="/menu" className="btn-noire-outline">
              Explore the Menu
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <a href="#intro" className="hero__scroll" aria-label="Scroll to introduction">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </a>
    </section>
  );
}