import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

function CategoryCard({ category, onSelect }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = category.image && !imageFailed;

  return (
    <a
      href="#menu"
      className="category-card"
      onClick={(e) => {
        e.preventDefault();
        onSelect(category.slug);
      }}
    >
      <div className="category-card__media" aria-hidden="true">
        {showImage ? (
          <img
            src={category.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="category-card__fallback" />
        )}
      </div>

      <div className="category-card__shade" aria-hidden="true" />

      <div className="category-card__body">
        <h3 className="category-card__title">{category.name}</h3>
        {category.description && (
          <p className="category-card__desc">{category.description}</p>
        )}
        <span className="category-card__cta">
          View dishes
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}

export default CategoryCard;