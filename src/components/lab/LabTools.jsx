import React from 'react';
import { labToolsData } from '../../data/siteData';

export const LabTools = () => {
  return (
    <div className="lab-tools-grid">
      {labToolsData.map(tool => (
        <div key={tool.id} className="lab-tool-card glass-card" data-reveal>
          <div className="lab-tool-icon">
            <i className={tool.icon}></i>
          </div>
          <h4>{tool.title}</h4>
          <p>{tool.desc}</p>
        </div>
      ))}
    </div>
  );
};
