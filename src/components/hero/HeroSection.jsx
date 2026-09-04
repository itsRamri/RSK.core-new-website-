import React from 'react';
import { HeroPortraitCanvas } from './HeroPortraitCanvas';

export const HeroSection = ({ onOpenResume }) => {
  return (
    <section className="hero-modern-section" id="hero">
      <div className="container hero-container">
        
        {/* Giant Headline (Behind Portrait) - DYMAS ALFIN Style */}
        <h1 className="hero-dymas-title" data-reveal aria-label="Shubham Kumar">
          <span className="hero-dymas-outline">SHUBHAM</span>
          <span className="hero-dymas-solid">KUMAR</span>
        </h1>

        {/* 3-Column Content Layer Framing the Center Cutout */}
        <div className="hero-dymas-stage">

          {/* Left Column: Role, Description, CTA Button */}
          <div className="hero-dymas-left" data-reveal>
            <h2 className="hero-dymas-role">Electronics & Communication Engineer</h2>
            <p className="hero-dymas-desc">
              Designing digital products and intelligent hardware systems that are clear, usable, and innovation-focused.
            </p>
            <div className="hero-cta-actions">
              <a href="#contact" className="hero-dymas-btn">
                <span>Let's collaborate</span>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>

          {/* Center Column: Cutout Portrait (Main Visual Focus) */}
          <div className="hero-center-portrait" data-reveal>
            <HeroPortraitCanvas />
          </div>

          {/* Right Column: Social Pills List */}
          <div className="hero-dymas-right" data-reveal>
            <div className="social-pills-list">

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-card"
                aria-label="Instagram"
              >
                <div className="social-pill-icon"><i className="fa-brands fa-instagram"></i></div>
                <span className="social-pill-name">Instagram</span>
                <i className="fa-solid fa-arrow-up-right-from-square social-pill-arrow"></i>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-card"
                aria-label="LinkedIn"
              >
                <div className="social-pill-icon"><i className="fa-brands fa-linkedin-in"></i></div>
                <span className="social-pill-name">LinkedIn</span>
                <i className="fa-solid fa-arrow-up-right-from-square social-pill-arrow"></i>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-card"
                aria-label="GitHub"
              >
                <div className="social-pill-icon"><i className="fa-brands fa-github"></i></div>
                <span className="social-pill-name">GitHub</span>
                <i className="fa-solid fa-arrow-up-right-from-square social-pill-arrow"></i>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
export default HeroSection;
