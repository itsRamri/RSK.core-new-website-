/**
 * RSK Portfolio - Projects Database
 * Comprehensive Engineering Project Registry
 */

export const projectsData = [
  {
    id: 'p1',
    category: 'iot',
    categoryLabel: 'IoT & Cloud Systems',
    title: 'Smart Home Automation & Power Monitor',
    subtitle: 'IoT-enabled Cloud Hub with Real-Time Current & Voltage Sensing',
    description: 'Engineered an IoT-enabled automation hub featuring current sensing, voltage monitoring, and cloud-synced bidirectional device control with sub-50ms relay latency. Designed complete firmware in ESP-IDF with non-blocking FreeRTOS tasks to log real-time power metrics, calculate instantaneous wattage, and alert users against overload faults via push notifications.',
    architecture: 'ESP32 MCU -> FreeRTOS Tasks -> MQTT Broker -> AWS IoT Cloud -> React Web App',
    specs: [
      'Microcontroller: ESP32-WROOM-32 (240MHz Dual Core)',
      'Peripherals: ACS712 Current Sensor, ZMPT101B Voltage Transformer, 4x Optocoupler Relays',
      'Protocol: MQTT over TLS, WebSockets with sub-50ms roundtrip latency',
      'Power: Onboard 5V/2A SMPS with thermal shutdown and surge protection'
    ],
    tags: ['ESP32', 'FreeRTOS', 'MQTT', 'AWS IoT', 'ACS712'],
    icon: 'fa-solid fa-house-signal',
    github: 'https://github.com',
    live: '#projects'
  },
  {
    id: 'p2',
    category: 'embedded',
    categoryLabel: 'Embedded Systems & LoRa',
    title: 'LoRa Long-Range Industrial Telemetry Node',
    subtitle: 'Ultra-Low-Power Sensor Node for 5+ km Sub-GHz Data Transmission',
    description: 'Developed an industrial-grade environmental monitoring node designed for harsh environments. Implemented adaptive data rate (ADR) algorithms and battery voltage telemetry to ensure up to 2 years of autonomous operation on a single Li-SOCl2 cell.',
    architecture: 'STM32F401 -> SPI -> Semtech SX1278 -> 868MHz RF Link -> LoRa Gateway',
    specs: [
      'MCU: STM32F401RE ARM Cortex-M4 @ 84MHz',
      'RF Module: Semtech SX1278 (868MHz, Spreading Factor SF7-SF12)',
      'Power Consumption: 15μA deep sleep, 120mA peak TX (+20dBm)',
      'Range: 5.4 km line-of-sight in urban testing environment'
    ],
    tags: ['STM32', 'LoRa SX1278', 'SPI', 'Low-Power', 'C/C++'],
    icon: 'fa-solid fa-tower-broadcast',
    github: 'https://github.com',
    live: '#projects'
  },
  {
    id: 'p3',
    category: 'robotics',
    categoryLabel: 'Robotics & Control Systems',
    title: 'Autonomous Obstacle Avoiding LiDAR Rover',
    subtitle: '4WD Mobile Robot with Reactive Pathfinding & Sensor Fusion',
    description: 'Constructed an autonomous ground vehicle capable of real-time 2D spatial mapping and dynamic obstacle avoidance. Programmed predictive turn vectors that eliminate corner traps and optimize transit time across cluttered indoor environments.',
    architecture: 'Arduino Mega 2560 -> HC-SR04 & LiDAR -> Reactive Path Algorithm -> Dual L298N H-Bridges',
    specs: [
      'Controller: ATmega2560 MCU with 54 digital I/O pins',
      'Sensing: Front 180° pan-tilt ultrasonic radar + 360° LiDAR telemetry',
      'Drive: 4x 12V High-Torque Geared DC Motors with optical encoders',
      'Control: Closed-loop PID velocity control with dead reckoning'
    ],
    tags: ['Arduino Mega', 'LiDAR', 'Ultrasonic', 'PID Control', 'Robotics'],
    icon: 'fa-solid fa-robot',
    github: 'https://github.com',
    live: '#projects'
  },
  {
    id: 'p4',
    category: 'communication',
    categoryLabel: 'Telecom & DSP',
    title: 'SDR Digital Communication & QPSK Modem',
    subtitle: 'Software-Defined Radio Pipeline with Carrier Recovery and BER Benchmarking',
    description: 'Designed and simulated an end-to-end digital communication transceiver. Accurately modeled wireless channel impairments including Rayleigh fading, Doppler shift, and additive white Gaussian noise (AWGN) to evaluate synchronization stability and forward error correction (FEC).',
    architecture: 'Bitstream -> QPSK Constellation Mapper -> RRC Pulse Shaping -> AWGN Channel -> Costas Loop Receiver',
    specs: [
      'Environment: MATLAB, Simulink & GNU Radio',
      'Modulation: QPSK / 16-QAM with Root-Raised Cosine (RRC) filtering (α=0.35)',
      'Synchronization: Costas Loop for carrier frequency/phase recovery, Gardner timing detector',
      'Evaluation: Monte Carlo BER vs. Eb/N0 curve verification against theoretical limits'
    ],
    tags: ['MATLAB', 'Simulink', 'DSP', 'QPSK Modem', 'SDR'],
    icon: 'fa-solid fa-satellite-dish',
    github: 'https://github.com',
    live: '#projects'
  },
  {
    id: 'p5',
    category: 'electronics',
    categoryLabel: 'PCB Design & Hardware Engineering',
    title: '4-Layer High-Speed ESP32 Carrier Board',
    subtitle: 'Custom Multi-Layer PCB with Controlled Impedance & Power Delivery',
    description: 'Designed a high-density 4-layer development board tailored for IoT deployment. Focused on return current path integrity, thermal dissipation vias under high-current LDOs, and high-frequency decoupling capacitor placement.',
    architecture: 'Schematic Capture -> Stackup Planning -> High-Speed Routing -> DRC & DFM -> SMT Assembly',
    specs: [
      'Layer Stackup: Signal / GND Plane / Power Plane / Signal (FR4, 1.6mm)',
      'EDA Tools: KiCad 7.0 & Altium Designer',
      'Features: 50Ω coplanar waveguide RF trace, USB-C ESD protection, LiPo charging IC',
      'Fabrication: Passed automated optical inspection (AOI) with zero DRC violations'
    ],
    tags: ['KiCad', 'Altium', '4-Layer PCB', 'RF Routing', 'SMT'],
    icon: 'fa-solid fa-microchip',
    github: 'https://github.com',
    live: '#projects'
  },
  {
    id: 'p6',
    category: 'iot',
    categoryLabel: 'IoT & Environmental Sensing',
    title: 'Smart Environmental & Air Quality Station',
    subtitle: 'Autonomous Solar-Powered Sensor Node with Multi-Gas AQI Computation',
    description: 'Deployed an autonomous weather and air quality monitoring station. Designed custom compensation algorithms to convert raw sensor resistance into standard European Air Quality Index (AQI) values with continuous cloud logging.',
    architecture: 'BME680 + PMS5003 -> I2C / UART -> ESP8266 -> MQTT -> Firebase Cloud',
    specs: [
      'Sensors: Bosch BME680 (Temp/Hum/Press/VOC) & Plantower PMS5003 (PM1.0/2.5/10)',
      'Display: 0.96-inch Monochrome OLED (I2C interface)',
      'Power: 5W Monocrystalline Solar Panel + TP4056 MPPT Charger + 18650 Battery',
      'Telemetry: Automatic calibration against humidity variations for accurate VOC AQI'
    ],
    tags: ['ESP8266', 'BME680', 'PMS5003', 'OLED', 'Solar MPPT'],
    icon: 'fa-solid fa-wind',
    github: 'https://github.com',
    live: '#projects'
  }
];
