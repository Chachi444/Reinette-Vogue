import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

// Import Logo
import Logo from '../assets/Logo.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/services', label: 'Services' },
    { path: '/book-appointment', label: 'Book Appointment' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={Logo} alt="Reinette's Vogue Logo" className="logo-icon" />
          <span className="logo-text">
            <span className="brand-main">Reinette's</span>
            <span className="brand-sub">Vogue</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          {isOpen ? <X /> : <Menu />}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`navbar-mobile ${isOpen ? 'navbar-mobile-open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`navbar-mobile-link ${location.pathname === item.path ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
