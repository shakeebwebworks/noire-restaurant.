import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Newsletter from "./components/Newsletter";
import WhatsAppButton from "./components/WhatsAppButton";
import PageTransition from "./components/PageTransition";
import PageStub from "./components/PageStub";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import GalleryPage from "./pages/GalleryPage";
import ReservationPage from "./pages/ReservationPage";

const page = (element) => <PageTransition>{element}</PageTransition>;

export default function App() {
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />

      <AnimatePresence
        mode="wait"
        onExitComplete={() =>
          window.scrollTo({ top: 0, left: 0, behavior: "instant" })
        }
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={page(<Home />)} />
          <Route path="/menu" element={page(<Menu />)} />
          <Route path="/about" element={page(<About />)} />
          <Route path="/gallery" element={page(<GalleryPage />)} />
          <Route path="/reservations" element={page(<ReservationPage />)} />
          <Route
            path="*"
            element={page(
              <PageStub
                eyebrow="404"
                title="This page could not be found."
                text="The page you are looking for does not exist. Please use the navigation above."
              />
            )}
          />
        </Routes>
      </AnimatePresence>

      <Newsletter />
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}