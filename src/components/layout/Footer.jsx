import React from 'react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="modern-footer-section">
      <div className="container footer-container">
        
        {/* Top Tier: Brand, Role & Socials */}
        <div className="footer-top-grid">
          
          <div className="footer-brand-column">
            <div className="footer-brand-title">
              <span>SHUBHAM</span> <span className="highlight">KUMAR</span>
            </div>
            <p className="footer-brand-tagline">
              Electronics &amp; Communication Engineering Student • UI/UX Designer &amp; Hardware Technologist.
            </p>
            <div className="footer-location-pill">
              <i className="fa-solid fa-location-dot"></i>
              <span>Bihar (Dhamaul), India</span>
            </div>
          </div>

          <div className="footer-links-column">
            <h4 className="footer-col-heading">Quick Navigation</h4>
            <ul className="footer-nav-list">
              <li><a href="#hero" className="footer-nav-link">Home</a></li>
              <li><a href="#about" className="footer-nav-link">About Me</a></li>
              <li><a href="#experience" className="footer-nav-link">Education &amp; Journey</a></li>
              <li><a href="#achievements" className="footer-nav-link">Achievements</a></li>
              <li><a href="#contact" className="footer-nav-link">Get in Touch</a></li>
            </ul>
          </div>

          <div className="footer-connect-column">
            <h4 className="footer-col-heading">Connect With Me</h4>
            <div className="footer-social-icons">
              <a 
                href="mailto:rsk149652@gmail.com" 
                className="footer-social-pill"
                aria-label="Email"
              >
                <i className="fa-solid fa-envelope"></i>
                <span>Email</span>
              </a>

              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-pill"
                aria-label="LinkedIn"
              >
                <i className="fa-brands fa-linkedin-in"></i>
                <span>LinkedIn</span>
              </a>

              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-pill"
                aria-label="GitHub"
              >
                <i className="fa-brands fa-github"></i>
                <span>GitHub</span>
              </a>

              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-pill"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
                <span>Instagram</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Tier: Copyright, Availability & Back-to-Top */}
        <div className="footer-bottom-bar">
          <div className="footer-status-indicator">
            <span className="status-green-dot"></span>
            <span>Available for new projects &amp; collaborations</span>
          </div>

          <p className="footer-copyright-text">
            © {new Date().getFullYear()} <strong>Ramri Shubham Kumar</strong>. All rights reserved.
          </p>

          <button 
            type="button" 
            onClick={scrollToTop} 
            className="footer-back-to-top-btn"
            aria-label="Back to Top"
          >
            <span>Back to Top</span>
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>

      </div>
    </footer>
  );
};
