import React, { useRef, useEffect, useState } from 'react';

export const OscilloscopeStation = () => {
  const canvasRef = useRef(null);
  const [waveType, setWaveType] = useState('sine');
  const [frequency, setFrequency] = useState(1.0);
  const [amplitude, setAmplitude] = useState(3.3);

  const waveTypeRef = useRef(waveType);
  const freqRef = useRef(frequency);
  const ampRef = useRef(amplitude);

  useEffect(() => {
    waveTypeRef.current = waveType;
  }, [waveType]);

  useEffect(() => {
    freqRef.current = frequency;
  }, [frequency]);

  useEffect(() => {
    ampRef.current = amplitude;
  }, [amplitude]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;
    let animId = null;

    const resizeScope = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 600;
      canvas.height = 220;
    };

    window.addEventListener('resize', resizeScope, { passive: true });
    resizeScope();

    const drawOscilloscope = () => {
      ctx.fillStyle = '#020813';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gridCols = 10;
      const gridRows = 8;
      const cellW = canvas.width / gridCols;
      const cellH = canvas.height / gridRows;

      // Background grid lines
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

      // Center crosshairs
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Glow Waveform
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();

      const midY = canvas.height / 2;
      const curAmp = ampRef.current;
      const curFreq = freqRef.current;
      const curType = waveTypeRef.current;

      const pxAmp = (curAmp / 5.0) * (canvas.height * 0.38);
      const freqFactor = curFreq * 0.035;

      for (let x = 0; x < canvas.width; x++) {
        let y = midY;
        const angle = (x * freqFactor) + phase;

        if (curType === 'sine') {
          y = midY + Math.sin(angle) * pxAmp;
        } else if (curType === 'square') {
          y = midY + (Math.sin(angle) >= 0 ? pxAmp : -pxAmp);
        } else if (curType === 'triangle') {
          y = midY + (Math.asin(Math.sin(angle)) / (Math.PI / 2)) * pxAmp;
        } else if (curType === 'noise') {
          y = midY + (Math.sin(angle) * 0.7 + (Math.random() - 0.5) * 0.6) * pxAmp;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += 0.08 * curFreq;
      animId = requestAnimationFrame(drawOscilloscope);
    };

    drawOscilloscope();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeScope);
    };
  }, []);

  const waveOptions = [
    { type: 'sine', label: 'Sine Wave', icon: 'fa-solid fa-wave-square' },
    { type: 'square', label: 'Square Wave', icon: 'fa-solid fa-square-full' },
    { type: 'triangle', label: 'Triangle Wave', icon: 'fa-solid fa-mountain' },
    { type: 'noise', label: 'RF Noise', icon: 'fa-solid fa-shuffle' }
  ];

  return (
    <div className="interactive-scope-station glass-card" data-reveal>
      <div className="scope-crt-wrapper">
        <div className="scope-hud-top">
          <span className="scope-stat-pill" id="scope-stat-freq">Freq: {frequency.toFixed(2)} kHz</span>
          <span className="scope-stat-pill" id="scope-stat-vpp">Vpp: {amplitude.toFixed(2)} V</span>
          <span className="scope-stat-pill" id="scope-stat-wave">Type: {waveType.toUpperCase()}</span>
          <span className="scope-stat-pill scope-stat-live"><span className="live-dot-green"></span> CH1 ACTIVE</span>
        </div>

        <canvas id="interactive-oscilloscope" ref={canvasRef}></canvas>
      </div>

      <div className="scope-control-panel">
        <h4 className="control-panel-title">
          <i className="fa-solid fa-sliders"></i> Signal Generator Controls
        </h4>

        <div className="controls-grid">
          {/* Waveform Selector */}
          <div className="control-group wave-type-group">
            <label>Waveform Type</label>
            <div className="wave-btn-row">
              {waveOptions.map(opt => (
                <button
                  key={opt.type}
                  className={`wave-btn ${waveType === opt.type ? 'active' : ''}`}
                  onClick={() => setWaveType(opt.type)}
                >
                  <i className={opt.icon}></i> {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Slider */}
          <div className="control-group">
            <label htmlFor="freq-slider">Frequency ({frequency.toFixed(1)} kHz)</label>
            <input
              type="range"
              id="freq-slider"
              min="0.2"
              max="5.0"
              step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="neon-slider"
            />
          </div>

          {/* Amplitude Slider */}
          <div className="control-group">
            <label htmlFor="amp-slider">Amplitude ({amplitude.toFixed(1)} V)</label>
            <input
              type="range"
              id="amp-slider"
              min="0.5"
              max="5.0"
              step="0.1"
              value={amplitude}
              onChange={(e) => setAmplitude(parseFloat(e.target.value))}
              className="neon-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
