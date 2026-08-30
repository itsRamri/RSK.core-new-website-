/**
 * RSK Portfolio - Optimized Lightweight Circuit Background
 */

function initCircuitBackground() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let nodes = [];
  let mouse = { x: null, y: null, radius: 120 };
  let animationId = null;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createNodes();
  }

  function createNodes() {
    nodes = [];
    const count = Math.min(40, Math.max(18, Math.floor((width * height) / 35000)));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 1.5 + 1.5
      });
    }
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 150);
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const theme = document.body.getAttribute('data-theme') || 'cyan';
    let traceColor = '0, 240, 255';
    if (theme === 'purple') traceColor = '192, 132, 252';
    if (theme === 'green') traceColor = '16, 185, 129';
    if (theme === 'orange') traceColor = '245, 158, 11';

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
          const force = (1 - dist / mouse.radius) * 0.03;
          n.x += dx * force;
          n.y += dy * force;
        }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${traceColor}, 0.7)`;
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
          ctx.strokeStyle = `rgba(${traceColor}, ${(1 - dist / 110) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCircuitBackground);
} else {
  initCircuitBackground();
}
