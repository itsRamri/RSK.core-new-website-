import React, { useEffect, useState, useRef } from 'react';

export const HeroSection = ({ onOpenResume }) => {
  const [counts, setCounts] = useState({ score: 0, projects: 0, tools: 0, journey: 0 });
  const metricsRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;

          let scoreVal = 0;
          let projVal = 0;
          let toolVal = 0;
          let journeyVal = 0;

          const duration = 1200;
          const steps = 30;
          const interval = duration / steps;

          const timer = setInterval(() => {
            scoreVal = Math.min(88, scoreVal + 88 / steps);
            projVal = Math.min(15, projVal + 15 / steps);
            toolVal = Math.min(12, toolVal + 12 / steps);
            journeyVal = Math.min(3, journeyVal + 3 / steps);

            setCounts({
              score: Math.ceil(scoreVal),
              projects: Math.ceil(projVal),
              tools: Math.ceil(toolVal),
              journey: Math.ceil(journeyVal)
            });

            if (scoreVal >= 88 && projVal >= 15 && toolVal >= 12 && journeyVal >= 3) {
              clearInterval(timer);
            }
          }, interval);
        }
      });
    }, { threshold: 0.15 });

    if (metricsRef.current) {
      observer.observe(metricsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero-modern-section" id="hero">
      <div className="container hero-container">

        {/* Giant Typographic Title in Background */}
        <div className="hero-giant-typography" data-reveal>
          <span className="hero-title-outline">SHUBHAM</span>
          <span className="hero-title-solid">KUMAR</span>
        </div>

        {/* Center Main Stage (Left Info + Center Portrait + Right Socials) */}
        <div className="hero-main-stage">

          {/* Left Column: Role & CTA */}
          <div className="hero-left-column" data-reveal>
            <div className="hero-role-badge">
              <span className="badge-pulse-dot"></span>
              <span>Available for Freelance & Full-time</span>
            </div>

            <h1 className="hero-role-title">
              UI/UX Designer <span className="highlight">&amp;</span> <br />
              ECE Engineer
            </h1>

            <p className="hero-role-desc">
              Designing digital products and intelligent hardware architectures that are clear, usable, and conversion-focused.
            </p>

            <div className="hero-cta-actions">
              <a href="#contact" className="hero-primary-pill-btn">
                <span>Let's collaborate</span>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>

              <button
                type="button"
                className="hero-secondary-pill-btn"
                onClick={onOpenResume}
              >
                <i className="fa-solid fa-file-lines"></i>
                <span>Resume</span>
              </button>
            </div>
          </div>

          {/* Center Column: Portrait Photo with modern aesthetic styling */}
          <div className="hero-center-portrait" data-reveal>
            <div className="portrait-wrapper">
              <div className="portrait-glow-backdrop"></div>
              <div className="portrait-frame">
                <img
                  src="/ezgif-476a1f2348609364-jpg/shubham%20profile.jpeg"
                  alt="Ramri Shubham Kumar"
                  className="portrait-img"
                />
                <div className="portrait-vignette-overlay"></div>
              </div>
            </div>
          </div>

          {/* Right Column: Social Pills */}
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

        {/* Bottom Metrics Quick Strip */}
        <div className="hero-metrics-strip" ref={metricsRef} data-reveal>
          <div className="metric-box">
            <div className="metric-box-inner">
              <span className="metric-box-num">{counts.score}.69%</span>
              <span className="metric-box-title">10th CBSE Distinction</span>
            </div>
            <p className="metric-box-sub">Mannat Public School (2024)</p>
          </div>

          <div className="metric-divider"></div>

          <div className="metric-box">
            <div className="metric-box-inner">
              <span className="metric-box-num">{counts.projects}+</span>
              <span className="metric-box-title">IoT &amp; Hardware Projects</span>
            </div>
            <p className="metric-box-sub">Embedded &amp; Robotics Labs</p>
          </div>

          <div className="metric-divider"></div>

          <div className="metric-box">
            <div className="metric-box-inner">
              <span className="metric-box-num">{counts.tools}+</span>
              <span className="metric-box-title">Prototyping &amp; Tools</span>
            </div>
            <p className="metric-box-sub">KiCad, ESP32, STM32, C/C++</p>
          </div>

          <div className="metric-divider"></div>

          <div className="metric-box">
            <div className="metric-box-inner">
              <span className="metric-box-num">2024-27</span>
              <span className="metric-box-title">Diploma in ECE</span>
            </div>
            <p className="metric-box-sub">Bihar State Polytechnic</p>
          </div>
        </div>

      </div>
    </section>
  );
};
