import { motion } from "framer-motion";
import { getCategories, getMenuItems } from "../services/api";
import { useApi } from "../hooks/useApi";
import FoodCard from "./FoodCard";
import StateMessage from "./StateMessage";
import "../styles/menu.css";

export default function MenuBrowser({ category = "", onCategoryChange, limit }) {
  const cats = useApi((signal) => getCategories(signal), []);
  const items = useApi((signal) => getMenuItems({ category }, signal), [category]);

  const tabs = [{ slug: "", name: "All" }, ...(cats.data || [])];
  const visible = items.data ? (limit ? items.data.slice(0, limit) : items.data) : [];

  return (
    <div>
      <div className="menu-filters" role="group" aria-label="Filter dishes by category">
        {tabs.map((tab) => {
          const active = tab.slug === category;
          return (
            <button
              key={tab.slug || "all"}
              type="button"
              className={`menu-filter${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => onCategoryChange(tab.slug)}
            >
              {tab.name}
              {active && (
                <motion.span
                  layoutId="menu-filter-line"
                  className="menu-filter__line"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="menu-results" aria-live="polite" aria-busy={items.loading}>
        {items.loading && (
          <div className="menu-grid" aria-hidden="true">
            {Array.from({ length: limit || 6 }).map((_, i) => (
              <div key={i} className="skeleton-card skeleton" />
            ))}
          </div>
        )}

        {!items.loading && items.error && (
          <StateMessage
            title="We couldn't load the menu."
            text="Please check your connection and try again."
            onRetry={items.retry}
          />
        )}

        {!items.loading && !items.error && visible.length === 0 && (
          <StateMessage
            title="No dishes here yet."
            text="Please choose another category or check back soon."
          />
        )}

        {!items.loading && !items.error && visible.length > 0 && (
          <motion.div
            key={category || "all"}
            className="menu-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {visible.map((item, i) => (
              <FoodCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}