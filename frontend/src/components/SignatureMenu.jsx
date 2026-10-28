import { useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import MenuBrowser from "./MenuBrowser";

export default function SignatureMenu() {
  const [category, setCategory] = useState("");

  return (
    <section id="signature-menu" className="noire-section">
      <div className="noire-container">
        <SectionHeading
          eyebrow="Signature Menu"
          title="Dishes worth the evening."
          text="A selection from our kitchen. Prices and availability are always up to date."
        />
        <MenuBrowser category={category} onCategoryChange={setCategory} limit={6} />
        <div className="text-center mt-5">
          <Link to="/menu" className="btn-noire-outline">View Full Menu</Link>
        </div>
      </div>
    </section>
  );
}