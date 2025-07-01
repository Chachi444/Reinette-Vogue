import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Facebook } from 'lucide-react';
import './Footer.css';

// Import Logo
import Logo from '../assets/Logo.jpg';

// TikTok Icon Component (since it's not in lucide-react)
const TikTokIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <img src={Logo} alt="Reinette's Vogue Logo" className="footer-logo-icon" />
              <span className="footer-logo-text">
                <span className="footer-brand-main">Reinette's</span>
                <span className="footer-brand-sub">Vogue</span>
              </span>
            </div>
            <p className="footer-description">
              Custom-tailored elegance for every shape and story. 
              Made with love, styled for royalty.
            </p>
            <div className="footer-social">
              <a href="https://instagram.com" className="footer-social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href="https://facebook.com" className="footer-social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href="https://tiktok.com" className="footer-social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/gallery" className="footer-link">Gallery</Link></li>
              <li><Link to="/services" className="footer-link">Services</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li><Link to="/services" className="footer-link">Custom Gowns</Link></li>
              <li><Link to="/services" className="footer-link">Tailored Suits</Link></li>
              <li><Link to="/services" className="footer-link">Alterations</Link></li>
              <li><Link to="/book-appointment" className="footer-link">Consultations</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Phone size={16} />
                <span>0816-766-2286</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} />
                <span>info@reinettesvogue.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Reinette's Vogue. All rights reserved.</p>
          <div className="footer-bottom-links">
            <button className="footer-bottom-link" onClick={() => console.log('Privacy Policy')}>Privacy Policy</button>
            <button className="footer-bottom-link" onClick={() => console.log('Terms of Service')}>Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
