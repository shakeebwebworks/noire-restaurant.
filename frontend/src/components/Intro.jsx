import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

export default function Intro() {
  return (
    <section id="intro" className="noire-section">
      <div className="noire-container">
        <div className="row align-items-center g-5">
          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
           
<div className="media-panel">
  <img
    src="/images/restaurant-interior.jpg"
    alt="The NOIRÉ dining room, softly lit for the evening"
  />
</div>

          </motion.div>

          <motion.div
            className="col-lg-5 offset-lg-1"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          >
            <span className="eyebrow">Welcome to NOIRÉ</span>
            <h2>Dining, composed with care.</h2>
            <hr className="gold-rule" />
            <p>
              At NOIRÉ, every plate begins with the ingredient and ends with
              the guest. Our kitchen cooks with precision and restraint, and
              our team treats each evening as something worth getting right.
            </p>
            <p>
              Sample introduction text. Replace with the restaurant's own story.
            </p>
            <Link to="/about" className="text-link mt-3">
              Discover Our Story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}