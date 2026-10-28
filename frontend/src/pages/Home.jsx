import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Categories from "../components/Categories";
import SignatureMenu from "../components/SignatureMenu";
import AboutSection from "../components/AboutSection";
import Chefs from "../components/Chefs";
import Gallery from "../components/Gallery";
import TestimonialSlider from "../components/TestimonialSlider";
import ContactSection from "../components/ContactSection";
import "../styles/home.css";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Categories />
      <SignatureMenu />
      <AboutSection />
      <Chefs />
      <Gallery limit={6} />
      <TestimonialSlider />
      <ContactSection />
    </>
  );
}