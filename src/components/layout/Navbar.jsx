import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { theme, changeTheme, themes } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

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
    { num: '01.', label: 'About', href: '#about', id: 'about' },
    { num: '02.', label: 'Skills', href: '#skills', id: 'skills' },
    { num: '03.', label: 'Projects', href: '#projects', id: 'projects' },
    { num: '04.', label: 'Lab', href: '#workbench', id: 'workbench' },
    { num: '05.', label: 'Education', href: '#experience', id: 'experience' },
    { num: '06.', label: 'Credentials', href: '#certifications', id: 'certifications' },
    { num: '07.', label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header className={`site-header header ${isScrolled ? 'scrolled' : ''}`} id="header">
      <nav className="navbar container">
        {/* Brand Logo */}
        <a href="#hero" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="logo-chip">
            <span className="chip-pin pin-t1"></span>
            <span className="chip-pin pin-t2"></span>
            <span className="chip-core">
              <i className="fa-solid fa-microchip"></i>
            </span>
            <span className="chip-pin pin-b1"></span>
            <span className="chip-pin pin-b2"></span>
          </div>
          <div className="brand-text">
            <span className="brand-name">RSK<span className="highlight">.CORE</span></span>
            <span className="brand-sub">ECE PORTFOLIO</span>
          </div>
        </a>

        {/* Nav Links */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`} id="nav-menu">
          {navLinks.map((link) => (
            <li key={link.id} className="nav-item">
              <a
                href={link.href}
                className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-num">{link.num}</span> {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Theme Accent Switcher */}
          <div className="theme-picker" title="Switch Accent Theme">
            {themes.map((t) => (
              <button
                key={t}
                className={`theme-btn theme-${t} ${theme === t ? 'active' : ''}`}
                data-color={t}
                aria-label={`${t} theme`}
                onClick={() => changeTheme(t)}
              />
            ))}
          </div>

          <a
            href="https://wa.me/917766939312?text=Hello%20Ramri%20Shubham%20Kumar,%20I%20visited%20your%20portfolio!"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-glow hide-mobile"
          >
            <i className="fa-brands fa-whatsapp"></i> WhatsApp
          </a>

          {/* Hamburger Toggle */}
          <button
            className="hamburger-btn"
            id="hamburger-btn"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>
    </header>
  );
};
