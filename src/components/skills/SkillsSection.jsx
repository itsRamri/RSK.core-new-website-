import React, { useState } from 'react';
import { skillCategories, skillsData } from '../../data/skillsData';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { SkillCard } from './SkillCard';

export const SkillsSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Re-observe cards whenever filter changes
  useScrollReveal([activeFilter]);

  const filteredSkills = activeFilter === 'all'
    ? skillsData
    : skillsData.filter(s => s.category === activeFilter);

  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-microchip"></i> TECH STACK
          </span>
          <h2 className="section-title">Core <span className="highlight">Proficiencies</span></h2>
          <p className="section-desc">
            Hardware engineering, firmware architecture, embedded communications, and modern software toolchains.
          </p>
        </div>

        {/* Skill Category Tabs */}
        <div className="skills-tab-filter" data-reveal>
          {skillCategories.map(cat => (
            <button
              key={cat.id}
              className={`skill-tab ${activeFilter === cat.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              <i className={cat.icon}></i> {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="skills-grid" id="skills-container">
          {filteredSkills.map(skill => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
};
