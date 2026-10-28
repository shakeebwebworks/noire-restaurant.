import { useState } from 'react';

function ChefCard({ chef }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = chef.image && !imageFailed;
  const initial = chef.name.replace(/^Chef\s+/i, '').charAt(0);

  return (
    <article className="chef-card">
      <div className="chef-card__media">
        {showImage ? (
          <img
            src={chef.image}
            alt={`Portrait of ${chef.name}, ${chef.role}`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="chef-card__fallback" role="img" aria-label={chef.name}>
            <span>{initial}</span>
          </div>
        )}
      </div>

      <div className="chef-card__body">
        <span className="chef-card__role">{chef.role}</span>
        <h3 className="chef-card__name">{chef.name}</h3>
        {chef.specialty && (
          <p className="chef-card__specialty">{chef.specialty}</p>
        )}
        <p className="chef-card__bio">{chef.biography}</p>
        {chef.recommendation && (
          <p className="chef-card__rec">
            <span>Chef’s recommendation</span>
            {chef.recommendation}
          </p>
        )}
      </div>
    </article>
  );
}

export default ChefCard;