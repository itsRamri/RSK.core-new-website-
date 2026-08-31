import React, { useEffect, useRef } from 'react';

export const ProjectCard = ({ project, onOpenDetails }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!cardEl) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0, rootMargin: '120px 0px 50px 0px' });

    observer.observe(cardEl);

    const timer = setTimeout(() => {
      if (cardEl) {
        cardEl.classList.add('revealed');
      }
    }, 150);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [project.id]);

  return (
    <div
      className="project-card glass-card"
      data-category={project.category}
      data-reveal
      ref={cardRef}
    >
      {/* Circuit Header Visual Banner */}
      <div className="project-card-visual">
        <div className="project-circuit-bg"></div>
        <div className="project-type-badge">
          <i className={project.icon}></i>
          <span>{project.categoryLabel}</span>
        </div>
        <div className="project-links">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-link"
            aria-label="GitHub Repository"
            title="View Source on GitHub"
          >
            <i className="fa-brands fa-github"></i>
          </a>
        </div>
      </div>

      {/* Project Body */}
      <div className="project-body">
        <h3 className="project-title" onClick={() => onOpenDetails(project)}>
          {project.title}
        </h3>
        <p className="project-desc">{project.subtitle}</p>

        {/* System Architecture Pipeline Flow */}
        <div className="project-arch-pill">
          <span className="arch-label"><i className="fa-solid fa-diagram-project"></i> Pipeline:</span>
          <span className="arch-text">{project.architecture}</span>
        </div>

        {/* Tech Stack Chips */}
        <div className="project-tech-tags">
          {project.tags.map((tag, idx) => (
            <span key={idx} className="tech-chip">{tag}</span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="project-footer">
        <button
          className="btn-project-details open-modal-btn"
          onClick={() => onOpenDetails(project)}
          aria-label={`View specs for ${project.title}`}
        >
          <span>System Specs & Architecture</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};
