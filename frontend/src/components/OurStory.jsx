import { ArrowRight, ChefHat, Leaf, Wine } from 'lucide-react';
import Reveal from './Reveal.jsx';
import RevealImage from './RevealImage.jsx';

const PILLARS = [
  {
    icon: Leaf,
    title: 'Ingredients',
    text: 'We choose produce, fish and meat for how they taste at their peak, and we let the seasons write the menu.',
  },
  {
    icon: ChefHat,
    title: 'Craft',
    text: 'Classical technique, patient preparation and restraint. Nothing arrives on the plate without a reason.',
  },
  {
    icon: Wine,
    title: 'Hospitality',
    text: 'Warm, attentive and never intrusive. We want every guest to feel unhurried and quietly looked after.',
  },
];

function goTo(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function OurStory() {
  return (
    <section id="story" className="section-padding story-section">
      <div className="noire-container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6 order-2 order-lg-1">
            <Reveal>
              <span className="eyebrow">Our Story</span>
            </Reveal>

            <Reveal delay={0.1}>
              <h2>
                Cooking with <em className="text-gold">patience</em>, serving
                with care.
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <hr className="gold-rule" />
            </Reveal>

            <Reveal delay={0.2}>
              <p className="story-lead">
                NOIRÉ began with a simple idea: a restaurant should feel like
                an evening you step into, not just a meal you order.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p>
                Our kitchen follows a philosophy of focus. A short, thoughtful
                menu, ingredients we trust, and a team that takes pride in the
                small things: the temperature of a plate, the timing of a
                course, the way a table is set.
              </p>
            </Reveal>

            <ul className="story-pillars">
              {PILLARS.map(({ icon: Icon, title, text }, index) => (
                <Reveal as="li" key={title} delay={0.1 + index * 0.1}>
                  <span className="story-pillars__icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <div>
                    <h3 className="story-pillars__title">{title}</h3>
                    <p>{text}</p>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <a
                href="#chefs"
                className="text-link"
                onClick={(e) => goTo(e, 'chefs')}
              >
                Meet Our Chefs
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </Reveal>
          </div>

          <div className="col-lg-5 offset-lg-1 order-1 order-lg-2">
            <div className="story-media">
              <RevealImage
                src="/images/hero.avif"
                alt="The NOIRÉ dining room, softly lit for the evening"
                aspect="4 / 5"
              />
              <span className="story-media__frame" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStory;
