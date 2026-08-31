import React from 'react';
import { certsData } from '../../data/siteData';

export const CertificationsSection = () => {
  return (
    <section className="section certs-section" id="certifications">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-certificate"></i> VERIFIED CREDENTIALS
          </span>
          <h2 className="section-title">Certifications & <span className="highlight">Accreditations</span></h2>
          <p className="section-desc">Certified engineering proficiencies and industry-recognized credentials.</p>
        </div>

        <div className="certs-grid">
          {certsData.map(cert => (
            <div key={cert.id} className="cert-card glass-card" data-reveal>
              <div className="cert-icon-box">
                <i className={cert.icon}></i>
              </div>
              <div className="cert-info">
                <span className="cert-issuer">{cert.issuer}</span>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-meta">
                  <i className="fa-regular fa-calendar"></i> {cert.meta}
                </p>
              </div>
              <a href={cert.link} className="cert-verify-btn" aria-label="Verify Certificate">
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
