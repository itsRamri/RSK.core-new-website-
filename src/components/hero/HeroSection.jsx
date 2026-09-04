import React from 'react';
import { HeroPortraitCanvas } from './HeroPortraitCanvas';

export const HeroSection = ({ onOpenResume }) => {
  return (
    <section className="hero-modern-section" id="hero">
      
      {/* Warm Golden Luminous Aura (Exact Reference Vibe) */}
      <div className="hero-golden-aura" aria-hidden="true"></div>

      <div className="container hero-container">

        {/* 1. Top Flowing Script "Hey, there" Framing the Head */}
        <div className="hero-script-header" data-reveal aria-hidden="true">
          <span className="hero-script-left">Hey,</span>
          <span className="hero-script-right">there</span>
        </div>

        {/* 2. 3-Column Editorial Stage Framing the Portrait */}
        <div className="hero-editorial-stage">

          {/* Left Column: Status Badge, "I AM SHUBHAM", Bio & CTA */}
          <div className="hero-left-editorial" data-reveal>
            <div className="hero-editorial-status-pill">
              <span className="status-orange-dot"></span>
              <span>Available for new opportunities</span>
            </div>

            <div className="hero-name-block">
              <span className="hero-name-intro">I AM</span>
              <h1 className="hero-name-main">SHUBHAM</h1>
              <span className="hero-name-last">KUMAR</span>
            </div>

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

          {/* Center Column: Cutout Foreground Subject (Main Visual Focus) */}
          <div className="hero-center-portrait" data-reveal>
            <HeroPortraitCanvas />
          </div>

          {/* Right Column: Specialty Note at Top, Stacked Role Title at Bottom */}
          <div className="hero-right-editorial" data-reveal>
            <p className="hero-specialty-note">
              Specialized in Embedded Systems, IoT, PCB Design, and Modern Web Development.
            </p>

            <div className="hero-stacked-role-block">
              <span>ELECTRONICS &</span>
              <span>COMMUNICATION</span>
              <span>ENGINEER</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
export default HeroSection;
