(function () {
  const TOTAL_FRAMES = 240;
  const FOLDER = 'ezgif-476a1f2348609364-jpg';
  const LERP_FACTOR = 0.08; // Smoothness inertia factor

  const canvas = document.getElementById('animation-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');

  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let lastRenderedFrame = -1;
  let isReady = false;

  // Format frame filename with 3-digit zero-padding
  function getFramePath(index) {
    const num = String(index).padStart(3, '0');
    return `${FOLDER}/ezgif-frame-${num}.jpg`;
  }

  // Handle responsive High-DPI canvas resizing
  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    lastRenderedFrame = -1;
    drawFrame(Math.round(currentFrame));
  }

  // Draw current frame to canvas (full photo visible without cropping)
  function drawFrame(frameIndex) {
    const clampedIndex = Math.min(Math.max(frameIndex, 0), TOTAL_FRAMES - 1);
    const img = images[clampedIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = window.innerWidth;
    const canvasH = window.innerHeight;

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    // Clear with dark background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Full photo fit (contain)
    const scale = Math.min(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (canvasW - drawW) / 2;
    const offsetY = (canvasH - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    lastRenderedFrame = clampedIndex;
  }

  // Calculate target frame from scroll position
  function updateScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;

    if (maxScroll <= 0) {
      targetFrame = 0;
      return;
    }

    const scrollFraction = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    targetFrame = scrollFraction * (TOTAL_FRAMES - 1);
  }

  // Main animation loop with smooth LERP interpolation
  function renderLoop() {
    currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;

    const frameToDraw = Math.round(currentFrame);

    if (frameToDraw !== lastRenderedFrame) {
      drawFrame(frameToDraw);
    }

    requestAnimationFrame(renderLoop);
  }

  // Preload all 240 frames
  function preloadImages() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameIndex = i - 1;

      img.onload = () => {
        loadedCount++;
        if (loaderProgress) {
          loaderProgress.style.width = `${Math.round((loadedCount / TOTAL_FRAMES) * 100)}%`;
        }

        // Render first frame immediately
        if (frameIndex === 0) {
          drawFrame(0);
        }

        if (loadedCount === TOTAL_FRAMES) {
          isReady = true;
          if (loader) {
            loader.classList.add('loaded');
          }
        }
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          isReady = true;
          if (loader) {
            loader.classList.add('loaded');
          }
        }
      };

      img.src = getFramePath(i);
      images[frameIndex] = img;
    }
  }

  // Event Listeners
  window.addEventListener('resize', setupCanvas);
  window.addEventListener('orientationchange', () => {
    setTimeout(setupCanvas, 100);
  });
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('DOMContentLoaded', () => {
    updateScroll();
    setupCanvas();
  });

  // Setup & Start
  setupCanvas();
  preloadImages();
  updateScroll();
  requestAnimationFrame(renderLoop);
})();