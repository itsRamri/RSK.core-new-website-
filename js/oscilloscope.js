/**
 * RSK Portfolio - Virtual Oscilloscope Module
 * Interactive Signal Generator & CRT/LCD Oscilloscope Screen
 */

function initHeroMiniScope() {
  const canvas = document.getElementById('mini-scope-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let offset = 0;

  function renderMiniScope() {
    ctx.fillStyle = '#03080d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    ctx.beginPath();

    const midY = canvas.height / 2;
    const amp = 14;
    const period = 30;

    for (let x = 0; x < canvas.width; x++) {
      const pos = (x + offset) % period;
      const y = pos < period / 2 ? midY - amp : midY + amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;

    offset += 0.8;
    requestAnimationFrame(renderMiniScope);
  }

  renderMiniScope();
}

function initOscilloscopeStation() {
  const canvas = document.getElementById('interactive-oscilloscope');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const waveBtns = document.querySelectorAll('.wave-btn');
  const freqSlider = document.getElementById('freq-slider');
  const ampSlider = document.getElementById('amp-slider');
  const freqVal = document.getElementById('freq-val');
  const ampVal = document.getElementById('amp-val');

  const statFreq = document.getElementById('scope-stat-freq');
  const statVpp = document.getElementById('scope-stat-vpp');
  const statWave = document.getElementById('scope-stat-wave');

  let waveType = 'sine';
  let frequency = 1.0;
  let amplitude = 3.3;
  let phase = 0;

  waveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      waveBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      waveType = btn.getAttribute('data-wave');
      if (statWave) statWave.textContent = `Type: ${waveType.toUpperCase()}`;
    });
  });

  if (freqSlider) {
    freqSlider.addEventListener('input', (e) => {
      frequency = parseFloat(e.target.value);
      if (freqVal) freqVal.textContent = frequency.toFixed(1);
      if (statFreq) statFreq.textContent = `Freq: ${frequency.toFixed(2)} kHz`;
    });
  }

  if (ampSlider) {
    ampSlider.addEventListener('input', (e) => {
      amplitude = parseFloat(e.target.value);
      if (ampVal) ampVal.textContent = amplitude.toFixed(1);
      if (statVpp) statVpp.textContent = `Vpp: ${amplitude.toFixed(2)} V`;
    });
  }

  function resizeScope() {
    if (!canvas.parentElement) return;
    canvas.width = canvas.parentElement.clientWidth || 600;
    canvas.height = 220;
  }

  window.addEventListener('resize', resizeScope, { passive: true });
  resizeScope();

  function drawOscilloscope() {
    ctx.fillStyle = '#020813';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gridCols = 10;
    const gridRows = 8;
    const cellW = canvas.width / gridCols;
    const cellH = canvas.height / gridRows;

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.lineWidth = 0.5;

    for (let c = 0; c <= gridCols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cellW, 0);
      ctx.lineTo(c * cellW, canvas.height);
      ctx.stroke();
    }

    for (let r = 0; r <= gridRows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cellH);
      ctx.lineTo(canvas.width, r * cellH);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 10;
    ctx.beginPath();

    const midY = canvas.height / 2;
    const pxAmp = (amplitude / 5.0) * (canvas.height * 0.38);
    const freqFactor = (frequency * 0.035);

    for (let x = 0; x < canvas.width; x++) {
      let y = midY;
      const angle = (x * freqFactor) + phase;

      if (waveType === 'sine') {
        y = midY + Math.sin(angle) * pxAmp;
      } else if (waveType === 'square') {
        y = midY + (Math.sin(angle) >= 0 ? pxAmp : -pxAmp);
      } else if (waveType === 'triangle') {
        y = midY + (Math.asin(Math.sin(angle)) / (Math.PI / 2)) * pxAmp;
      } else if (waveType === 'noise') {
        y = midY + (Math.sin(angle) * 0.7 + (Math.random() - 0.5) * 0.6) * pxAmp;
      }

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.shadowBlur = 0;

    phase += 0.08 * frequency;
    requestAnimationFrame(drawOscilloscope);
  }

  drawOscilloscope();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHeroMiniScope();
    initOscilloscopeStation();
  });
} else {
  initHeroMiniScope();
  initOscilloscopeStation();
}
