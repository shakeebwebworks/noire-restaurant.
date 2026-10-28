import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import "../styles/sections.css";

const EASE = [0.22, 1, 0.36, 1];

const VALUES = [
  ["Ingredients", "We start with the best produce and the producers we trust."],
  ["Craft", "Technique serves the ingredient, never the other way round."],
  ["Hospitality", "Every guest should feel expected, looked after and unhurried."],
];

export default function AboutSection({ showLink = true }) {
  return (
    <section id="about" className="noire-section noire-section--alt">
      <div className="noire-container">
        <div className="row align-items-center g-5">
          <motion.div
            className="col-lg-6 order-lg-2"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div
              className="media-panel"
              role="img"
              aria-label="Ingredients being prepared in the NOIRÉ kitchen"
            />
          </motion.div>

          <div className="col-lg-6 order-lg-1">
            <SectionHeading
              eyebrow="About NOIRÉ"
              title="A philosophy of restraint and warmth."
              text="Sample story. Replace this text with the restaurant's real history, culinary philosophy and sourcing."
            />
            <div className="about-values">
              {VALUES.map(([title, text]) => (
                <div key={title} className="about-value">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            {showLink && (
              <Link to="/about" className="text-link mt-4">
                Discover Our Story <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}