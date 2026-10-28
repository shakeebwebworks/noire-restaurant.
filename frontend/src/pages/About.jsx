import AboutSection from "../components/AboutSection";
import Chefs from "../components/Chefs";

export default function About() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      <AboutSection showLink={false} />
      <Chefs />
    </div>
  );
}