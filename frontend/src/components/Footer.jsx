import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { site } from "../config/site";

export default function Footer() {
  return (
    <footer className="noire-footer">
      <div className="noire-container">
        <div className="row g-5">
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="noire-logo">NOIRÉ</Link>
            <p className="mt-4">{site.tagline}</p>
            {site.social.length > 0 && (
              <ul className="footer-list">
                {site.social.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h3 className="footer-heading">Explore</h3>
            <ul className="footer-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/reservations">Reservations</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <h3 className="footer-heading">Visit</h3>
            <ul className="footer-list footer-contact">
              <li><MapPin size={16} /><span>{site.address}</span></li>
              <li><Phone size={16} /><span>{site.phone}</span></li>
              <li>
                <Mail size={16} />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h3 className="footer-heading">Opening Hours</h3>
            <ul className="footer-list footer-contact">
              {site.hours.map((h) => (
                <li key={h.days}>
                  <Clock size={16} />
                  <span>{h.days}<br />{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NOIRÉ. All rights reserved.</p>
          <p>Demo contact details. Replace with the owner's information.</p>
        </div>
      </div>
    </footer>
  );
}