import React, { useState } from 'react';

export const HeroSection = ({ onOpenResume }) => {
  const [portraitLoaded, setPortraitLoaded] = useState(false);

  return (
    <section className="rsk-editorial-hero" id="hero">
      {/* Warm Ambience & Sunlight/Leaf Shadow Layer */}
      <div className="hero-sunlight-overlay" aria-hidden="true" />

      {/* Subtle Crosshairs in Grid */}
      <span className="hero-crosshair crosshair-top-left" aria-hidden="true">+</span>
      <span className="hero-crosshair crosshair-mid-center" aria-hidden="true">+</span>

      {/* Main Content Container */}
      <div className="container hero-layout-container">
        
        {/* ============================================================
            LEFT COLUMN: Bio, Title, CTA & Metric Strip
            ============================================================ */}
        <div className="hero-left-column" data-reveal>
          
          {/* Eyebrow / Category Tag */}
          <div className="hero-eyebrow-wrapper">
            <div className="hero-eyebrow-bullet">
              <span className="eyebrow-outer-ring">
                <span className="eyebrow-inner-dot"></span>
              </span>
              <span className="eyebrow-connector-line"></span>
            </div>
            <div className="hero-eyebrow-text">
              <span>ELECTRONICS & COMMUNICATION ENGINEERING</span>
              <span className="eyebrow-sub">STUDENT</span>
            </div>
          </div>

          {/* Main Hero Headline */}
          <h1 className="hero-headline">
            <span className="headline-dark">Hello,</span>
            <span className="headline-bronze">I’m Shubham.</span>
          </h1>

          {/* Intro Description */}
          <p className="hero-tagline">
            I build electronic systems, digital experiences and technology-driven solutions.
          </p>

          {/* Handwritten Script Motto */}
          <div className="hero-handwritten-motto" aria-hidden="true">
            Build. Learn. Create.
          </div>

          {/* Action Buttons */}
          <div className="hero-button-group">
            <a href="#achievements" className="rsk-btn-primary">
              <span>VIEW PROJECTS</span>
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a href="#contact" className="rsk-btn-secondary">
              <span>CONTACT ME</span>
            </a>
          </div>

          {/* Bottom Left Metrics / Badge Strip */}
          <div className="hero-metrics-strip">
            
            {/* Metric Item 1 */}
            <div className="metric-item">
              <div className="metric-icon">
                <i className="fa-solid fa-microchip"></i>
              </div>
              <div className="metric-content">
                <span className="metric-value">03+</span>
                <span className="metric-label">PROJECTS</span>
              </div>
            </div>

            <div className="metric-divider"></div>

            {/* Metric Item 2 */}
            <div className="metric-item">
              <div className="metric-icon">
                <i className="fa-solid fa-tower-broadcast"></i>
              </div>
              <div className="metric-content">
                <span className="metric-value">ECE</span>
                <span className="metric-label">ENGINEERING</span>
              </div>
            </div>

            <div className="metric-divider"></div>

            {/* Metric Item 3 */}
            <div className="metric-item">
              <div className="metric-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="metric-content">
                <span className="metric-value">INDIA</span>
                <span className="metric-label">AVAILABLE</span>
              </div>
            </div>

            <div className="metric-divider"></div>

            {/* Compact Scroll Down Indicator on Left */}
            <a href="#about" className="hero-scroll-metric-item" aria-label="Scroll to About Section">
              <div className="scroll-indicator-icon">
                <span className="scroll-outer-circle">
                  <span className="scroll-center-line"></span>
                </span>
              </div>
              <div className="scroll-indicator-text">
                <span>SCROLL</span>
                <span>DOWN</span>
              </div>
              <div className="scroll-indicator-arrow">
                <i className="fa-solid fa-arrow-down"></i>
              </div>
            </a>

          </div>

        </div>

        {/* ============================================================
            CENTER-RIGHT COLUMN: Giant 'RSK' Typography + Orbit + Cutout Portrait
            ============================================================ */}
        <div className="hero-center-column">
          
          {/* Faint Dashed Orbit Ring behind head & letters (like DSK reference) */}
          <div className="hero-orbit-ring" aria-hidden="true">
            <svg viewBox="0 0 500 500" className="orbit-svg">
              <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(92, 78, 61, 0.22)" strokeWidth="1.5" strokeDasharray="7 7" />
            </svg>
          </div>

          {/* Giant 'RSK' Typography (matching DSKR in reference) */}
          <div className="hero-giant-watermark" aria-hidden="true">
            <span className="watermark-letter watermark-r">R</span>
            <span className="watermark-letter watermark-s">S</span>
            <span className="watermark-letter watermark-k">K</span>
          </div>

          {/* Handwritten Cursive 'Shubham' signature over 'K' (like 'Deepak' in reference) */}
          <div className="hero-cursive-name" aria-hidden="true">
            Shubham
          </div>

          {/* Shubham Cutout Portrait */}
          <div className={`hero-portrait-stage ${portraitLoaded ? 'image-loaded' : ''}`}>
            <img
              src="/ezgif-476a1f2348609364-jpg/shubham-cutout.png"
              alt="Ramri Shubham Kumar"
              className="hero-person-cutout"
              onLoad={() => setPortraitLoaded(true)}
              loading="eager"
            />
          </div>

          {/* Handwritten Annotation pointing to 'R' (like App/SaaS Development in reference) */}
          <div className="hero-annotation-shoulder" aria-hidden="true">
            <div className="annotation-text-line">App Development</div>
            <div className="annotation-text-line">Electronics & IoT</div>
            <div className="annotation-text-line">Web Development</div>
            <div className="annotation-arrow">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M6 6 C 18 8, 26 18, 28 28" stroke="#5D5043" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="3 3"/>
                <path d="M22 28 L 28 29 L 29 23" stroke="#5D5043" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

        </div>

        {/* ============================================================
            RIGHT COLUMN: Mantra, PCB Circuit Graphic & Scroll Indicator
            ============================================================ */}
        <div className="hero-right-column">
          
          {/* Vertical Mantra */}
          <div className="hero-mantra-list" data-reveal>
            <div className="mantra-item">
              <span className="mantra-dot"></span>
              <span className="mantra-text">DREAM</span>
            </div>
            <div className="mantra-item">
              <span className="mantra-dot"></span>
              <span className="mantra-text">DESIGN</span>
            </div>
            <div className="mantra-item">
              <span className="mantra-dot"></span>
              <span className="mantra-text">DEVELOP</span>
            </div>
          </div>

          {/* PCB / Circuit Trace Graphic */}
          <div className="hero-pcb-graphic" aria-hidden="true">
            <svg width="180" height="240" viewBox="0 0 180 240" fill="none" className="pcb-svg">
              {/* Circuit Paths */}
              <circle cx="160" cy="40" r="3.5" className="pcb-node" />
              <line x1="160" y1="40" x2="160" y2="90" className="pcb-line" />
              <line x1="160" y1="90" x2="110" y2="140" className="pcb-line" />
              <circle cx="110" cy="140" r="3" className="pcb-node" />
              <line x1="110" y1="140" x2="60" y2="140" className="pcb-line" />
              
              <circle cx="140" cy="115" r="3.5" className="pcb-node" />
              <line x1="140" y1="115" x2="80" y2="175" className="pcb-line" />
              <line x1="80" y1="175" x2="30" y2="175" className="pcb-line" />
              <circle cx="30" cy="175" r="3" className="pcb-node" />
              <line x1="30" y1="175" x2="10" y2="195" className="pcb-line" />
              <circle cx="10" cy="195" r="3.5" className="pcb-node" />

              <line x1="110" y1="140" x2="110" y2="180" className="pcb-line" />
              <line x1="110" y1="180" x2="80" y2="210" className="pcb-line" />
              <circle cx="80" cy="210" r="3" className="pcb-node" />
            </svg>
          </div>
        </div>

      </div>

    </section>
  );
};

export default HeroSection;
