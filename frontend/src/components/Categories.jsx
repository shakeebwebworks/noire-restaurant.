// import { Col, Row } from 'react-bootstrap';
// import { getCategories } from '../services/api.js';
// import useFetch from '../hooks/useFetch.js';
// import SectionHeading from './SectionHeading.jsx';
// import Reveal from './Reveal.jsx';
// import CategoryCard from './CategoryCard.jsx';
// import StatusMessage from './StatusMessage.jsx';

// function Categories({ onSelectCategory }) {
//   const { data, loading, error, reload } = useFetch(getCategories);

//   const handleSelect = (slug) => {
//     onSelectCategory(slug);
//     const menu = document.getElementById('menu');
//     if (menu) {
//       menu.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   let content;

//   if (loading) {
//     content = (
//       <Row className="g-4 justify-content-center" aria-busy="true">
//         {[0, 1, 2].map((n) => (
//           <Col key={n} xs={12} md={6} lg={4}>
//             <div className="category-skeleton skeleton" />
//           </Col>
//         ))}
//       </Row>
//     );
//   } else if (error) {
//     content = (
//       <StatusMessage
//         variant="error"
//         title="We couldn’t load our categories"
//         text="Please check your connection and try again."
//         actionLabel="Try again"
//         onAction={reload}
//       />
//     );
//   } else if (!data || data.length === 0) {
//     content = (
//       <StatusMessage
//         variant="empty"
//         title="Our menu is being prepared"
//         text="Please check back soon."
//       />
//     );
//   } else {
//     content = (
//       <Row className="g-4 justify-content-center">
//         {data.map((category, index) => (
//           <Col key={category.id} xs={12} md={6} lg={4}>
//             <Reveal delay={(index % 3) * 0.1}>
//               <CategoryCard category={category} onSelect={handleSelect} />
//             </Reveal>
//           </Col>
//         ))}
//       </Row>
//     );
//   }

//   return (
//     <section id="categories" className="section-padding bg-alt">
//       <div className="noire-container">
//         <SectionHeading
//           align="center"
//           eyebrow="The Menu"
//           title="Explore Our Kitchen"
//           text="From delicate first bites to a final, lingering sweetness, choose where you would like to begin."
//         />
//         {content}
//       </div>
//     </section>
//   );
// }

// export default Categories;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getCategories } from "../services/api";
import { useApi } from "../hooks/useApi";
import SectionHeading from "./SectionHeading";
import StateMessage from "./StateMessage";
import "../styles/menu.css";

const EASE = [0.22, 1, 0.36, 1];

export default function Categories() {
  const { data, loading, error, retry } = useApi((s) => getCategories(s), []);

  return (
    <section id="categories" className="noire-section noire-section--alt">
      <div className="noire-container">
        <SectionHeading
          eyebrow="The Menu"
          title="Explore by course."
          text="From the first bite to the last sip, choose where to begin."
        />

        {loading && (
          <div className="category-grid" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="category-card skeleton" />
            ))}
          </div>
        )}

        {!loading && error && (
          <StateMessage
            title="We couldn't load the categories."
            text="Please try again in a moment."
            onRetry={retry}
          />
        )}

        {!loading && !error && data && data.length === 0 && (
          <StateMessage title="The menu is being prepared." text="Please check back soon." />
        )}

        {!loading && !error && data && data.length > 0 && (
          <div className="category-grid">
            {data.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: EASE }}
              >
                <Link to={`/menu?category=${cat.slug}`} className="category-card">
                  {cat.image && (
                    <img className="category-card__img" src={cat.image} alt="" loading="lazy" />
                  )}
                  <div className="category-card__body">
                    <h3>{cat.name}</h3>
                    {cat.description && <p>{cat.description}</p>}
                    <span className="text-link">
                      View dishes <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}