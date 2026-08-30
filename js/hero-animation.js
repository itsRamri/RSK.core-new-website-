/**
 * RSK Portfolio - 16:9 Landscape Hero Video Scroll Engine
 * 240 Frames smoothly scrubbed forward on scroll down & reversed on scroll up
 * Strict 16:9 Landscape Aspect Ratio (Edge-to-Edge Cover Fit)
 */

function initHero169ScrollAnimation() {
  const TOTAL_FRAMES = 240;
  const FOLDER = 'ezgif-476a1f2348609364-jpg';
  const LERP_FACTOR = 0.085;

  const canvas = document.getElementById('hero-16-9-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.getElementById('hero-video-loader');
  const frameCounter = document.getElementById('hero-frame-counter');
  const progressFill = document.getElementById('hero-progress-fill');
  const heroSection = document.getElementById('hero');

  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let lastRenderedFrame = -1;

  function getFramePath(index) {
    const num = String(index).padStart(3, '0');
    return `${FOLDER}/ezgif-frame-${num}.jpg`;
  }

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = rect.width || canvas.parentElement.clientWidth || 1280;
    const height = rect.height || canvas.parentElement.clientHeight || 720;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    lastRenderedFrame = -1;
    drawFrame(Math.round(currentFrame));
  }

  function drawFrame(frameIndex) {
    const clampedIndex = Math.min(Math.max(frameIndex, 0), TOTAL_FRAMES - 1);
    const img = images[clampedIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgRatio = imgW / imgH; // 16:9
    const canvasRatio = canvasW / canvasH;

    let drawW, drawH, offsetX, offsetY;

    // Edge-to-edge 16:9 landscape fill
    if (Math.abs(canvasRatio - imgRatio) < 0.02) {
      drawW = canvasW;
      drawH = canvasH;
      offsetX = 0;
      offsetY = 0;
    } else if (canvasRatio > imgRatio) {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
      offsetX = 0;
      offsetY = (canvasH - drawH) / 2;
    } else {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
      offsetX = (canvasW - drawW) / 2;
      offsetY = 0;
    }

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    lastRenderedFrame = clampedIndex;

    // Update HUD & Progress
    if (frameCounter) {
      const formatted = String(clampedIndex + 1).padStart(3, '0');
      frameCounter.textContent = `FRAME ${formatted}/240 (16:9)`;
    }

    if (progressFill) {
      const percent = ((clampedIndex / (TOTAL_FRAMES - 1)) * 100).toFixed(1);
      progressFill.style.width = `${percent}%`;
    }
  }

  function updateScroll() {
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const sectionTop = window.pageYOffset + rect.top;
    const sectionHeight = heroSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    const scrollDistance = sectionHeight - viewportHeight;
    const currentScroll = window.pageYOffset - sectionTop;

    if (scrollDistance <= 0) {
      targetFrame = 0;
      return;
    }

    const progress = Math.min(Math.max(currentScroll / scrollDistance, 0), 1);
    targetFrame = progress * (TOTAL_FRAMES - 1);
  }

  function renderLoop() {
    currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;
    const frameToDraw = Math.round(currentFrame);

    if (frameToDraw !== lastRenderedFrame) {
      drawFrame(frameToDraw);
    }

    requestAnimationFrame(renderLoop);
  }

  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameIndex = i - 1;

      img.onload = () => {
        loadedCount++;
        if (frameIndex === 0) {
          drawFrame(0);
        }
        if (loadedCount >= 10 && loader) {
          loader.classList.add('ready');
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount >= 10 && loader) {
          loader.classList.add('ready');
        }
      };

      img.src = getFramePath(i);
      images[frameIndex] = img;
    }
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });

  resizeCanvas();
  preloadFrames();
  updateScroll();
  requestAnimationFrame(renderLoop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero169ScrollAnimation);
} else {
  initHero169ScrollAnimation();
}
