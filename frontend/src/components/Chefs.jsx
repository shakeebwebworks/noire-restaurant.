import { motion } from "framer-motion";
import { getChefs } from "../services/api";
import { useApi } from "../hooks/useApi";
import SectionHeading from "./SectionHeading";
import StateMessage from "./StateMessage";
import "../styles/sections.css";
import "../styles/menu.css";

const EASE = [0.22, 1, 0.36, 1];

export default function Chefs() {
  const { data, loading, error, retry } = useApi((s) => getChefs(s), []);

  return (
    <section id="chefs" className="noire-section">
      <div className="noire-container">
        <SectionHeading
          eyebrow="The Kitchen"
          title="The people behind the plate."
          text="Meet the chefs who shape every menu."
        />

        {loading && (
          <div className="chef-grid" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton" style={{ height: 460 }} />
            ))}
          </div>
        )}
        {!loading && error && (
          <StateMessage title="We couldn't load the chefs." text="Please try again." onRetry={retry} />
        )}
        {!loading && !error && data?.length === 0 && (
          <StateMessage title="Our chefs will be introduced soon." />
        )}

        {!loading && !error && data?.length > 0 && (
          <div className="chef-grid">
            {data.map((chef, i) => (
              <motion.article
                key={chef.id}
                className="chef-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
              >
                <div className="chef-card__photo img-zoom">
                  {chef.image ? (
                    <img src={chef.image} alt={`Portrait of ${chef.name}`} loading="lazy" />
                  ) : (
                    <div className="chef-card__initial" aria-hidden="true">
                      {chef.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="chef-card__body">
                  <span className="chef-card__role">{chef.role}</span>
                  <h3>{chef.name}</h3>
                  {chef.specialty && <p><em>{chef.specialty}</em></p>}
                  {chef.biography && <p>{chef.biography}</p>}
                  {chef.recommendation && (
                    <p className="chef-card__rec">
                      <strong>Recommends:</strong> {chef.recommendation}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}