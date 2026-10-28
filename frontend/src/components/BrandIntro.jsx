import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal.jsx';
import RevealImage from './RevealImage.jsx';

function goToStory(e) {
  e.preventDefault();
  const el = document.getElementById('story');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function BrandIntro() {
  return (
    <section id="intro" className="section-padding intro-section">
      <div className="noire-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="intro-media">
              <RevealImage
                src="/images/intro.avif"
                alt="A beautifully plated dish at NOIRÉ"
                aspect="4 / 5"
              />
              <span className="intro-media__frame" aria-hidden="true" />
            </div>
          </div>

          <div className="col-lg-5 offset-lg-1">
            <Reveal>
              <span className="eyebrow">Welcome to NOIRÉ</span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2>
                A table set for <em className="text-gold">unhurried</em> evenings.
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <hr className="gold-rule" />
            </Reveal>

            <Reveal delay={0.2}>
              <p className="intro-lead">
                NOIRÉ is a contemporary dining room built around quiet luxury:
                low light, thoughtful service, and a menu that lets each
                ingredient speak for itself.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p>
                From the first welcome to the final course, every detail is
                considered, so that you can simply settle in and enjoy the
                evening.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <a href="#story" className="text-link" onClick={goToStory}>
                Discover Our Story
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandIntro;