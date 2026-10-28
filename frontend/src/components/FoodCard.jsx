import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];
const CURRENCY = import.meta.env.VITE_CURRENCY || "$";

export default function FoodCard({ item, index = 0 }) {
  const name = item.name || "Dish";
  const labels = Array.isArray(item.dietary_labels) ? item.dietary_labels : [];
  const available = item.is_available !== false;
  const priceNumber = Number(item.price);
  const price = Number.isFinite(priceNumber)
    ? `${CURRENCY}${priceNumber.toFixed(2)}`
    : "";

  return (
    <motion.article
      className={`food-card${available ? "" : " is-unavailable"}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: EASE }}
    >
      <div className="food-card__media img-zoom">
        {item.image ? (
          <img src={item.image} alt={name} loading="lazy" />
        ) : (
          <div className="food-card__placeholder" aria-hidden="true">
            {name.charAt(0)}
          </div>
        )}
        {item.is_featured && (
          <span className="food-card__badge">Chef's Choice</span>
        )}
      </div>

      <div className="food-card__body">
        {item.category_name && (
          <span className="food-card__cat">{item.category_name}</span>
        )}
        <div className="food-card__top">
          <h3 className="food-card__name">{name}</h3>
          {price && <span className="food-card__price">{price}</span>}
        </div>
        {item.description && <p>{item.description}</p>}

        {(labels.length > 0 || !available) && (
          <ul className="diet-tags">
            {labels.map((label) => (
              <li key={label} className="diet-tag">{label}</li>
            ))}
            {!available && <li className="diet-tag">Currently unavailable</li>}
          </ul>
        )}
      </div>
    </motion.article>
  );
}