import React from 'react';
import { HeroPortraitCanvas } from './HeroPortraitCanvas';

export const HeroSection = ({ onOpenResume }) => {
  return (
    <section className="hero-modern-section" id="hero">
      <div className="container hero-container">

        {/* 1. Giant Background Name Typography */}
        <div className="hero-giant-typography" data-reveal aria-hidden="true">
          <span className="hero-title-outline">SHUBHAM</span>
          <span className="hero-title-solid">KUMAR</span>
        </div>

        {/* 2. 3-Part Main Stage (Left Content + Center Subject + Right Socials) */}
        <div className="hero-main-stage">

          {/* Left Column: Role, Description & CTA */}
          <div className="hero-left-column" data-reveal>
            <h1 className="hero-role-title">
              Electronics &amp; Communication Engineer
            </h1>
            <p className="hero-role-desc">
              Building technology-driven digital solutions with electronics, communication, and modern web technologies.
            </p>
            <div className="hero-cta-actions">
              <a href="#contact" className="hero-primary-pill-btn">
                <span>Let's Collaborate</span>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>

          {/* Center Column: Cutout Foreground Subject (No Box / No Card) */}
          <div className="hero-center-portrait" data-reveal>
            <HeroPortraitCanvas />
          </div>

          {/* Right Column: Clean Social Links Rows */}
          <div className="hero-right-column" data-reveal>
            <div className="social-pills-list">
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

              <a
                href="mailto:rsk149652@gmail.com"
                className="social-pill-card"
                aria-label="Email"
              >
                <div className="social-pill-icon"><i className="fa-solid fa-envelope"></i></div>
                <span className="social-pill-name">Email Me</span>
                <i className="fa-solid fa-arrow-up-right-from-square social-pill-arrow"></i>
              </a>

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
                href="https://dribbble.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill-card"
                aria-label="Dribbble"
              >
                <div className="social-pill-icon"><i className="fa-brands fa-dribbble"></i></div>
                <span className="social-pill-name">Dribbble</span>
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
