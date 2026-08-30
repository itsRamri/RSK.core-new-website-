/**
 * RSK Portfolio - Projects Module
 * Engineering Project Database, Category Filtering & Details Modal
 */

const projectDetailsDatabase = {
  p1: {
    title: 'Smart Home Automation & Power Monitor',
    subtitle: 'IoT-enabled Cloud Hub with Real-Time Current & Voltage Sensing',
    category: 'IoT & Cloud Systems',
    architecture: 'ESP32 MCU -> FreeRTOS Tasks -> MQTT Broker -> AWS IoT Cloud -> React Web App',
    specs: [
      'Microcontroller: ESP32-WROOM-32 (240MHz Dual Core)',
      'Peripherals: ACS712 Current Sensor, ZMPT101B Voltage Transformer, 4x Optocoupler Relays',
      'Protocol: MQTT over TLS, WebSockets with sub-50ms roundtrip latency',
      'Power: Onboard 5V/2A SMPS with thermal shutdown and surge protection'
    ],
    description: 'Engineered an IoT-enabled automation hub featuring current sensing, voltage monitoring, and cloud-synced bidirectional device control with sub-50ms relay latency. Designed complete firmware in ESP-IDF with non-blocking FreeRTOS tasks to log real-time power metrics, calculate instantaneous wattage, and alert users against overload faults via push notifications.',
    github: 'https://github.com',
    live: '#projects'
  },
  p2: {
    title: 'LoRa-Based Long-Range Remote Industrial Telemetry',
    subtitle: 'Ultra-Low-Power Sensor Node for 5+ km Sub-GHz Data Transmission',
    category: 'Embedded Systems & LoRa',
    architecture: 'STM32F401 -> SPI -> Semtech SX1278 -> 868MHz RF Link -> LoRa Gateway',
    specs: [
      'MCU: STM32F401RE ARM Cortex-M4 @ 84MHz',
      'RF Module: Semtech SX1278 (868MHz, Spreading Factor SF7-SF12)',
      'Power Consumption: 15μA deep sleep, 120mA peak TX (+20dBm)',
      'Range: 5.4 km line-of-sight in urban testing environment'
    ],
    description: 'Developed an industrial-grade environmental monitoring node designed for harsh environments. Implemented adaptive data rate (ADR) algorithms and battery voltage telemetry to ensure up to 2 years of autonomous operation on a single Li-SOCl2 cell.',
    github: 'https://github.com',
    live: '#projects'
  },
  p3: {
    title: 'Autonomous Obstacle Avoiding LiDAR Rover',
    subtitle: '4WD Mobile Robot with Reactive Pathfinding & Sensor Fusion',
    category: 'Robotics & Control Systems',
    architecture: 'Arduino Mega 2560 -> HC-SR04 & LiDAR -> Reactive Path Algorithm -> Dual L298N H-Bridges',
    specs: [
      'Controller: ATmega2560 MCU with 54 digital I/O pins',
      'Sensing: Front 180° pan-tilt ultrasonic radar + 360° LiDAR telemetry',
      'Drive: 4x 12V High-Torque Geared DC Motors with optical encoders',
      'Control: Closed-loop PID velocity control with dead reckoning'
    ],
    description: 'Constructed an autonomous ground vehicle capable of real-time 2D spatial mapping and dynamic obstacle avoidance. Programmed predictive turn vectors that eliminate corner traps and optimize transit time across cluttered indoor environments.',
    github: 'https://github.com',
    live: '#projects'
  },
  p4: {
    title: 'SDR Digital Communication & QPSK Modem',
    subtitle: 'Software-Defined Radio Pipeline with Carrier Recovery and BER Benchmarking',
    category: 'Telecom & DSP',
    architecture: 'Bitstream -> QPSK Constellation Mapper -> RRC Pulse Shaping -> AWGN Channel -> Costas Loop Receiver',
    specs: [
      'Environment: MATLAB, Simulink & GNU Radio',
      'Modulation: QPSK / 16-QAM with Root-Raised Cosine (RRC) filtering (α=0.35)',
      'Synchronization: Costas Loop for carrier frequency/phase recovery, Gardner timing detector',
      'Evaluation: Monte Carlo BER vs. Eb/N0 curve verification against theoretical limits'
    ],
    description: 'Designed and simulated an end-to-end digital communication transceiver. Accurately modeled wireless channel impairments including Rayleigh fading, Doppler shift, and additive white Gaussian noise (AWGN) to evaluate synchronization stability and forward error correction (FEC).',
    github: 'https://github.com',
    live: '#projects'
  },
  p5: {
    title: '4-Layer High-Speed ESP32 Carrier Board',
    subtitle: 'Custom Multi-Layer PCB with Controlled Impedance & Power Delivery',
    category: 'PCB Design & Hardware Engineering',
    architecture: 'Schematic Capture -> Stackup Planning -> High-Speed Routing -> DRC & DFM -> SMT Assembly',
    specs: [
      'Layer Stackup: Signal / GND Plane / Power Plane / Signal (FR4, 1.6mm)',
      'EDA Tools: KiCad 7.0 & Altium Designer',
      'Features: 50Ω coplanar waveguide RF trace, USB-C ESD protection, LiPo charging IC',
      'Fabrication: Passed automated optical inspection (AOI) with zero DRC violations'
    ],
    description: 'Designed a high-density 4-layer development board tailored for IoT deployment. Focused on return current path integrity, thermal dissipation vias under high-current LDOs, and high-frequency decoupling capacitor placement.',
    github: 'https://github.com',
    live: '#projects'
  },
  p6: {
    title: 'Smart Environmental & Air Quality Station',
    subtitle: 'Autonomous Solar-Powered Sensor Node with Multi-Gas AQI Computation',
    category: 'IoT & Environmental Sensing',
    architecture: 'BME680 + PMS5003 -> I2C / UART -> ESP8266 -> MQTT -> Firebase Cloud',
    specs: [
      'Sensors: Bosch BME680 (Temp/Hum/Press/VOC) & Plantower PMS5003 (PM1.0/2.5/10)',
      'Display: 0.96-inch Monochrome OLED (I2C interface)',
      'Power: 5W Monocrystalline Solar Panel + TP4056 MPPT Charger + 18650 Battery',
      'Telemetry: Automatic calibration against humidity variations for accurate VOC AQI'
    ],
    description: 'Deployed an autonomous weather and air quality monitoring station. Designed custom compensation algorithms to convert raw sensor resistance into standard European Air Quality Index (AQI) values with continuous cloud logging.',
    github: 'https://github.com',
    live: '#projects'
  }
};

function initProjectFilterAndModal() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-category');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // Modal Setup
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-project');
      const data = projectDetailsDatabase[pId];
      if (!data) return;

      modalBody.innerHTML = `
        <div class="modal-project-header">
          <span class="project-cat-pill">${data.category}</span>
          <h2 style="font-size: 1.6rem; margin: 0.6rem 0 0.2rem; color: #ffffff;">${data.title}</h2>
          <p style="color: var(--primary); font-family: var(--font-heading); margin-bottom: 1.2rem;">${data.subtitle}</p>
        </div>

        <div style="background: rgba(0,0,0,0.6); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 1.2rem;">
          <h4 style="color: var(--text-dim); font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.4rem;">
            <i class="fa-solid fa-network-wired"></i> System Architecture
          </h4>
          <p style="font-family: var(--font-mono); font-size: 0.85rem; color: #ffffff;">${data.architecture}</p>
        </div>

        <div style="margin-bottom: 1.2rem;">
          <h4 style="font-size: 1rem; color: #ffffff; margin-bottom: 0.5rem;"><i class="fa-solid fa-microchip highlight"></i> Technical Specifications</h4>
          <ul style="padding-left: 1.2rem; color: var(--text-muted); font-size: 0.88rem; line-height: 1.6; list-style: disc;">
            ${data.specs.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 1rem; color: #ffffff; margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-info highlight"></i> Project Overview & Engineering Rationale</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${data.description}</p>
        </div>

        <div style="display: flex; gap: 0.8rem; border-top: 1px solid var(--border-color); padding-top: 1.2rem;">
          <a href="${data.github}" target="_blank" class="btn btn-sm btn-primary btn-glow">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
          <button class="btn btn-sm btn-secondary" onclick="document.getElementById('project-modal').classList.remove('active')">
            Close Overview
          </button>
        </div>
      `;

      modal.classList.add('active');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => modal.classList.remove('active'));
  }
}

document.addEventListener('DOMContentLoaded', initProjectFilterAndModal);
