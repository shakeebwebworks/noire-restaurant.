import { useSearchParams } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import MenuBrowser from "../components/MenuBrowser";

export default function Menu() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";

  const changeCategory = (slug) =>
    setParams(slug ? { category: slug } : {}, { replace: true });

  return (
    <section className="page-stub">
      <div className="noire-container">
        <SectionHeading
          as="h1"
          eyebrow="The Menu"
          title="Crafted with intention."
          text="Every dish below is managed by the restaurant, so prices and availability are always current."
        />
        <MenuBrowser category={category} onCategoryChange={changeCategory} />
      </div>
    </section>
  );
}