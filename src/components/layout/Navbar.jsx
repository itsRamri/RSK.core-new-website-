import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { mode, toggleMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;

      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 140;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#hero', id: 'hero' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'PROJECTS', href: '#achievements', id: 'achievements' },
    { label: 'SKILLS', href: '#timeline', id: 'timeline' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <header className={`modern-navbar-header ${isScrolled ? 'scrolled' : ''}`} id="header">
        <div className="container nav-wrapper">
          
          {/* Left: Brand Logo */}
          <div className="nav-left-section">
            <a href="#hero" className="nav-brand-logo" title="RSK - Shubham Kumar">
              <span className="brand-name">RSK<span className="brand-dot-accent">.</span></span>
            </a>
          </div>

          {/* Center: Navigation Links */}
          <nav className={`nav-center-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
            <ul className="nav-links-list">
              {navLinks.map((link) => (
                <li key={link.id} className="nav-item">
                  <a
                    href={link.href}
                    className={`nav-link-item ${activeSection === link.id ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="nav-link-text">{link.label}</span>
                    {activeSection === link.id && <span className="nav-active-bar" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Actions (Theme Light/Dark Toggle & Let's Talk CTA) */}
          <div className="nav-right-actions">
            
            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              className="theme-mode-toggle"
              onClick={toggleMode}
              title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle theme appearance"
            >
              {mode === 'light' ? (
                <i className="fa-solid fa-moon"></i>
              ) : (
                <i className="fa-solid fa-sun"></i>
              )}
            </button>

            {/* Let's Talk CTA Button */}
            <a
              href="#contact-form"
              className="nav-cta-talk-btn"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                const formElement = document.getElementById('contact-form') || document.getElementById('contact');
                if (formElement) {
                  e.preventDefault();
                  formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus({ preventScroll: true });
                  }, 450);
                }
              }}
            >
              <span>Let's Talk</span>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>

            {/* Mobile Hamburger Button */}
            <button
              className={`nav-mobile-hamburger ${isMobileMenuOpen ? 'open' : ''}`}
              id="mobile-hamburger-btn"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="bar bar-top"></span>
              <span className="bar bar-mid"></span>
              <span className="bar bar-bot"></span>
            </button>

          </div>

        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-nav-backdrop" 
          onClick={() => setIsMobileMenuOpen(false)} 
          aria-hidden="true" 
        />
      )}
    </>
  );
};
