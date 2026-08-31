import React from 'react';
import { timelineData } from '../../data/siteData';

export const TimelineSection = () => {
  return (
    <section className="section timeline-section" id="experience">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-graduation-cap"></i> ACADEMIC PATH
          </span>
          <h2 className="section-title">Education & <span className="highlight">Qualifications</span></h2>
          <p className="section-desc">Academic excellence and technical journey of Ramri Shubham Kumar.</p>
        </div>

        <div className="timeline-wrapper">
          <div className="timeline-line"></div>

          {timelineData.map(item => (
            <div
              key={item.id}
              className={`timeline-item timeline-${item.side}`}
              data-reveal
            >
              <div className="timeline-dot">
                <i className={item.dotIcon}></i>
              </div>
              <div className="timeline-card glass-card">
                <div className="timeline-meta">
                  <span className="timeline-year">{item.year}</span>
                  <span className="timeline-tag">{item.tag}</span>
                </div>
                <h3 className="timeline-title">{item.title}</h3>
                <h4 className="timeline-subtitle">{item.subtitle}</h4>
                <p className="timeline-desc">{item.desc}</p>
                <div className="timeline-badges">
                  {item.highlightBadge && (
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
                      {item.highlightBadge}
                    </span>
                  )}
                  {item.badges.map((badge, idx) => (
                    <span key={idx}>{badge}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
