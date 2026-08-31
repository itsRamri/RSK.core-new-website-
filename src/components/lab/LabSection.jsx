import React from 'react';
import { OscilloscopeStation } from './OscilloscopeStation';
import { LabTools } from './LabTools';

export const LabSection = () => {
  return (
    <section className="section lab-section" id="workbench">
      <div className="container">
        <div className="section-header" data-reveal>
          <span className="section-tag">
            <i className="fa-solid fa-flask-vial"></i> HARDWARE TESTBENCH
          </span>
          <h2 className="section-title">Virtual <span className="highlight">Oscilloscope & Lab</span></h2>
          <p className="section-desc">
            Interact with live signal waveforms, tune frequency & amplitude, and explore workbench instrumentation.
          </p>
        </div>

        {/* Interactive Virtual Oscilloscope */}
        <OscilloscopeStation />

        {/* Hardware Lab Equipment */}
        <LabTools />
      </div>
    </section>
  );
};
