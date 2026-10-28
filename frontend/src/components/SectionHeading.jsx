import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
  as: Tag = "h2",
}) {
  return (
    <motion.div
      className={`section-heading${center ? " section-heading--center" : ""}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag>{title}</Tag>
      <hr className="gold-rule" />
      {text && <p>{text}</p>}
    </motion.div>
  );
}