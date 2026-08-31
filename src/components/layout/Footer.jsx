import React from 'react';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="chip-logo">
            <span className="chip-core">
              <i className="fa-solid fa-microchip"></i>
            </span>
          </div>
          <div className="footer-brand-text">
            <span className="footer-title">Ramri Shubham Kumar (RSK)</span>
            <span className="footer-sub">
              Diploma in Electronics & Communication Engineering • Bihar (Dhamaul)
            </span>
          </div>
        </div>

        <p className="footer-quote">
          <em>"Designed & Built with passion for Electronics, Microcontrollers & Embedded Systems."</em>
        </p>

        <div className="footer-socials">
          <a href="https://wa.me/917766939312" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <i className="fa-brands fa-whatsapp"></i>
          </a>
          <a href="mailto:rsk149652@gmail.com" aria-label="Email">
            <i className="fa-solid fa-envelope"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fa-brands fa-github"></i>
          </a>
        </div>

        <div className="footer-bottom">
          <p>© 2026 RSK (Ramri Shubham Kumar). All rights reserved. • Bihar (Dhamaul), India</p>
          <a href="#hero" className="back-to-top" aria-label="Back to Top">
            <i className="fa-solid fa-arrow-up"></i> Top
          </a>
        </div>
      </div>
    </footer>
  );
};
