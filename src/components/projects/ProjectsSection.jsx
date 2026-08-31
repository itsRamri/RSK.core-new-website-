import React, { useState } from 'react';
import { projectsData } from '../../data/projectsData';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { ProjectCard } from './ProjectCard';

const projectFilters = [
  { id: 'all', label: 'All Projects', icon: 'fa-solid fa-layer-group' },
  { id: 'iot', label: 'IoT Systems', icon: 'fa-solid fa-wifi' },
  { id: 'embedded', label: 'Embedded & LoRa', icon: 'fa-solid fa-microchip' },
  { id: 'robotics', label: 'Robotics', icon: 'fa-solid fa-robot' },
  { id: 'communication', label: 'DSP & Telecom', icon: 'fa-solid fa-satellite-dish' },
  { id: 'electronics', label: 'PCB & Hardware', icon: 'fa-solid fa-circuit-board' }
];

export const ProjectsSection = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Re-observe cards whenever filter category changes
  useScrollReveal([activeCategory]);

  const filteredProjects = activeCategory === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === activeCategory);

  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-diagram-project"></i> INNOVATION PORTFOLIO
          </span>
          <h2 className="section-title">Featured <span className="highlight">Projects</span></h2>
          <p className="section-desc">
            Production-grade IoT prototypes, embedded firmware, telemetry nodes, and custom multi-layer circuit boards.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="projects-filter-bar" data-reveal>
          {projectFilters.map(filter => (
            <button
              key={filter.id}
              className={`project-filter-btn ${activeCategory === filter.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(filter.id)}
            >
              <i className={filter.icon}></i> {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid" id="projects-grid">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetails={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
