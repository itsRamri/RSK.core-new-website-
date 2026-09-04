import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const CircuitBackground = () => {
  const canvasRef = useRef(null);
  const { mode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let nodes = [];
    const mouse = { x: null, y: null, radius: 120 };
    let animationId = null;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createNodes();
    };

    const createNodes = () => {
      nodes = [];
      const count = Math.min(32, Math.max(16, Math.floor((width * height) / 45000)));
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 1
        });
      }
    };

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    resize();

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Theme-specific circuit colors (Dark: Grid/blue accent #12304A & Subtle blue glow #0A2A4A)
      const isDark = mode === 'dark';
      const traceRgb = isDark ? '18, 48, 74' : '0, 0, 0';
      const nodeRgb = isDark ? '56, 189, 248' : '0, 0, 0';
      const nodeAlpha = isDark ? 0.35 : 0.08;
      const lineAlpha = isDark ? 0.45 : 0.04;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 0.02;
            n.x += dx * force;
            n.y += dy * force;
          }
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${nodeRgb}, ${nodeAlpha})`;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n.x - n2.x;
          const dy = n.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            if (dist > 60) {
              ctx.lineTo(n.x, n2.y);
            }
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(${traceRgb}, ${(1 - dist / 110) * lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mode]);

  return (
    <canvas 
      id="circuit-canvas" 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }} 
    />
  );
};
