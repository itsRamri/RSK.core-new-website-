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

  const navLinks = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Education', href: '#experience', id: 'experience' },
    { label: 'Achievements', href: '#achievements', id: 'achievements' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header className={`modern-navbar-header ${isScrolled ? 'scrolled' : ''}`} id="header">
      <div className="container nav-wrapper">
        
        {/* Left: Status Badge / Available for New Project */}
        <div className="nav-left-section">
          <a href="#contact" className="nav-status-pill" title="Currently available for hire and freelance projects">
            <span className="status-green-dot"></span>
            <span className="status-label">Available for New Project</span>
          </a>
        </div>

        {/* Center: Navigation Links */}
        <nav className={`nav-center-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links-list">
            {navLinks.map((link) => (
              <li key={link.id} className="nav-item">
                <a
                  href={link.href}
                  className={`nav-link-item ${activeSection === link.id ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-link-text">{link.label}</span>
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
            href="#contact"
            className="nav-cta-talk-btn"
          >
            <span>Let's Talk</span>
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
          </a>

          {/* Mobile Hamburger Button */}
          <button
            className="nav-mobile-hamburger"
            id="mobile-hamburger-btn"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`bar ${isMobileMenuOpen ? 'bar-top' : ''}`}></span>
            <span className={`bar ${isMobileMenuOpen ? 'bar-mid' : ''}`}></span>
            <span className={`bar ${isMobileMenuOpen ? 'bar-bot' : ''}`}></span>
          </button>

        </div>

      </div>
    </header>
  );
};
