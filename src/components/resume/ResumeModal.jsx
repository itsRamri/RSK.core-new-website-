import React from 'react';

export const ResumeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} id="resume-modal">
      <div className="modal-overlay" id="resume-overlay" onClick={onClose}></div>
      <div className="modal-container glass-card resume-modal-container">
        <button
          className="modal-close-btn"
          id="resume-close-btn"
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="modal-body">
          <div className="resume-header">
            <h2><i className="fa-solid fa-file-lines"></i> Engineering Resume</h2>
            <p>Ramri Shubham Kumar (RSK)</p>
          </div>
          <div className="resume-preview-sheet">
            <div className="resume-sheet-header">
              <h3>Ramri Shubham Kumar</h3>
              <p>Diploma in ECE (2024-27) • rsk149652@gmail.com • Bihar (Dhamaul), India</p>
            </div>
            <hr className="resume-divider" />
            <div className="resume-section-item">
              <h4><i className="fa-solid fa-graduation-cap"></i> Education</h4>
              <p>
                • <strong>Diploma in Electronics & Communication Engineering</strong> (Session: 2024 - 2027)<br />
                • <strong>10th Matriculation (CBSE Board)</strong> — Mannat Public School (2024) | Score: <strong>88.69%</strong>
              </p>
            </div>
            <div className="resume-section-item">
              <h4><i className="fa-solid fa-microchip"></i> Core Technical Skills</h4>
              <p>
                Embedded Systems, Microcontrollers (ESP32, STM32, Arduino), IoT Protocols (MQTT, HTTP, BLE), PCB Design (KiCad, Altium), C/C++, Python, MATLAB, Digital & Analog Electronics.
              </p>
            </div>
            <div className="resume-section-item">
              <h4><i className="fa-solid fa-diagram-project"></i> Key Projects</h4>
              <p>
                • Smart IoT Home Automation & Energy Gateway (ESP32, MQTT)<br />
                • LoRa Long-Range Remote Industrial Telemetry (STM32, SX1278)<br />
                • Autonomous Obstacle Avoiding Rover (Arduino Mega, LiDAR)
              </p>
            </div>
          </div>
          <div className="resume-actions">
            <button className="btn btn-primary btn-glow" id="download-print-btn" onClick={handlePrint}>
              <i className="fa-solid fa-download"></i> Save / Print PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
