import React, { useEffect, useState, useRef } from 'react';

export const AboutSection = () => {
  const [counts, setCounts] = useState({ score: 0, projects: 0, tools: 0, journey: 0 });
  const statsRef = useRef(null);
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

          const steps = 30;
          const interval = 1200 / steps;

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
    }, { threshold: 0.2 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-user-astronaut"></i> BIOGRAPHY
          </span>
          <h2 className="section-title">About <span className="highlight">Me</span></h2>
          <p className="section-desc">
            Innovating at the intersection of electronics, firmware, and next-gen communication.
          </p>
        </div>

        <div className="about-grid">
          {/* Profile Card */}
          <div className="about-card-profile glass-card" data-reveal>
            <div className="profile-avatar-box">
              <div className="avatar-glow-ring"></div>
              <div className="avatar-inner">
                <img
                  src="/ezgif-476a1f2348609364-jpg/shubham%20profile.jpeg"
                  alt="Ramri Shubham Kumar"
                  className="profile-avatar-img"
                />
                <div className="avatar-scan-line"></div>
              </div>
              <div className="profile-badge">
                <i className="fa-solid fa-certificate"></i> RSK • ECE
              </div>
            </div>

            <div className="profile-info">
              <h3 className="profile-name">Ramri Shubham Kumar</h3>
              <p className="profile-role">Diploma in Electronics & Communication (2024-27)</p>
              
              <div className="profile-contacts">
                <div className="contact-pill"><i className="fa-solid fa-location-dot"></i> Bihar (Dhamaul), India</div>
                <div className="contact-pill"><i className="fa-solid fa-envelope"></i> rsk149652@gmail.com</div>
                <div className="contact-pill"><i className="fa-solid fa-phone"></i> +91 7766939312</div>
              </div>

              <div className="profile-socials">
                <a href="https://wa.me/917766939312" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="WhatsApp">
                  <i className="fa-brands fa-whatsapp"></i>
                </a>
                <a href="mailto:rsk149652@gmail.com" className="social-icon" aria-label="Email">
                  <i className="fa-solid fa-envelope"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
                  <i className="fa-brands fa-github"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Description & Terminal */}
          <div className="about-details" data-reveal>
            <div className="glass-card bio-card">
              <div className="bio-header">
                <i className="fa-solid fa-terminal"></i>
                <span>RSK_SYS_PROFILE.INIT()</span>
              </div>
              <div className="bio-body">
                <p>
                  I am <strong>Ramri Shubham Kumar (RSK)</strong>, an enthusiastic <strong>Electronics & Communication Engineering</strong> student (Session 2024–2027) based in <strong>Bihar (Dhamaul)</strong>. Having secured <strong>88.69% in CBSE Matriculation (2024) from Mannat Public School</strong>, I bring dedication, precision, and passion to hardware and firmware design.
                </p>
                <p>
                  My goal is to master modern <strong>Embedded Systems, IoT devices, Robotics, and Communication Stacks</strong> to engineer smart, reliable hardware solutions for industry and community challenges.
                </p>
              </div>

              {/* Quick Spec Highlights */}
              <div className="spec-grid">
                <div className="spec-item">
                  <div className="spec-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                  <div className="spec-content">
                    <span className="spec-label">Diploma Program</span>
                    <span className="spec-val">Diploma ECE (2024 - 2027)</span>
                  </div>
                </div>

                <div className="spec-item">
                  <div className="spec-icon"><i className="fa-solid fa-school"></i></div>
                  <div className="spec-content">
                    <span className="spec-label">Matriculation (CBSE)</span>
                    <span className="spec-val">Mannat Public School (88.69%)</span>
                  </div>
                </div>

                <div className="spec-item">
                  <div className="spec-icon"><i className="fa-solid fa-location-dot"></i></div>
                  <div className="spec-content">
                    <span className="spec-label">Hometown Location</span>
                    <span className="spec-val">Bihar (Dhamaul), India</span>
                  </div>
                </div>

                <div className="spec-item">
                  <div className="spec-icon"><i className="fa-solid fa-microchip"></i></div>
                  <div className="spec-content">
                    <span className="spec-label">Core Focus</span>
                    <span className="spec-val">IoT, Embedded Systems, PCB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="about-stats-grid" ref={statsRef}>
              <div className="stat-card glass-card">
                <div className="stat-number">{counts.score}.69%</div>
                <div className="stat-label">10th CBSE Score</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-number">{counts.projects}+</div>
                <div className="stat-label">Hardware Projects</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-number">{counts.tools}+</div>
                <div className="stat-label">Tools & Frameworks</div>
              </div>
              <div className="stat-card glass-card">
                <div className="stat-number">{counts.journey} Yrs</div>
                <div className="stat-label">ECE Journey</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
