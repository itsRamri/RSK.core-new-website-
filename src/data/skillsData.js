export const skillCategories = [
  { id: 'all', label: 'All Skills', icon: 'fa-solid fa-border-all' },
  { id: 'embedded', label: 'Embedded & MCU', icon: 'fa-solid fa-microchip' },
  { id: 'hardware', label: 'PCB & Hardware', icon: 'fa-solid fa-layer-group' },
  { id: 'comm', label: 'IoT & Telecom', icon: 'fa-solid fa-tower-broadcast' },
  { id: 'software', label: 'Software & Tools', icon: 'fa-solid fa-code' }
];

export const skillsData = [
  {
    id: 's1',
    category: 'embedded',
    title: 'Embedded Systems',
    level: 'ARM Cortex, RTOS, Firmware',
    percent: 92,
    icon: 'fa-solid fa-microchip',
    tags: ['FreeRTOS', 'Bare-Metal', 'Low Power']
  },
  {
    id: 's2',
    category: 'embedded',
    title: 'Microcontrollers',
    level: 'ESP32, STM32, Arduino, 8051',
    percent: 95,
    icon: 'fa-solid fa-memory',
    tags: ['ESP-IDF', 'STM32Cube', 'Arduino IDE']
  },
  {
    id: 's3',
    category: 'comm',
    title: 'IoT Architecture',
    level: 'MQTT, HTTP, BLE, LoRaWAN',
    percent: 88,
    icon: 'fa-solid fa-wifi',
    tags: ['Node-RED', 'AWS IoT', 'ThingsBoard']
  },
  {
    id: 's4',
    category: 'hardware',
    title: 'PCB Design & EDA',
    level: 'KiCad, Altium Designer, EasyEDA',
    percent: 90,
    icon: 'fa-solid fa-bezier-curve',
    tags: ['Multi-Layer', 'Schematic', 'Gerber']
  },
  {
    id: 's5',
    category: 'hardware',
    title: 'Analog & Digital Electronics',
    level: 'Op-Amps, Filters, Logic Design',
    percent: 86,
    icon: 'fa-solid fa-wave-square',
    tags: ['Verilog', 'CMOS', 'Power Circuits']
  },
  {
    id: 's6',
    category: 'comm',
    title: 'Communication Systems',
    level: 'Modulation, Antennas, RF Systems',
    percent: 84,
    icon: 'fa-solid fa-tower-cell',
    tags: ['SDR', 'Digital Comm', 'Signal Theory']
  },
  {
    id: 's7',
    category: 'software',
    title: 'C / C++ (Embedded)',
    level: 'Memory Management, Pointers, Bitwise',
    percent: 94,
    icon: 'fa-solid fa-code',
    tags: ['Embedded C', 'C++17', 'Data Structures']
  },
  {
    id: 's8',
    category: 'software',
    title: 'Python & MATLAB',
    level: 'Simulink, Signal Processing, Scripting',
    percent: 87,
    icon: 'fa-brands fa-python',
    tags: ['NumPy', 'Simulink', 'DSP']
  },
  {
    id: 's9',
    category: 'hardware',
    title: 'Circuit Simulation',
    level: 'LTspice, Proteus, Multisim',
    percent: 89,
    icon: 'fa-solid fa-sliders',
    tags: ['SPICE', 'Transient', 'AC Analysis']
  }
];
