import React from 'react';
import { achievementsData } from '../../data/siteData';

export const AchievementsSection = () => {
  return (
    <section className="section achievements-section" id="achievements">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-trophy"></i> MILESTONES
          </span>
          <h2 className="section-title">Honors & <span className="highlight">Achievements</span></h2>
          <p className="section-desc">Academic excellence and technical accomplishments.</p>
        </div>

        <div className="achievements-grid">
          {achievementsData.map(item => (
            <div key={item.id} className="achievement-card glass-card" data-reveal>
              <div className={item.badgeClass}>
                <i className={item.badgeIcon}></i> {item.badgeText}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
