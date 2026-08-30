/**
 * RSK Portfolio - 16:9 Landscape Hero Video Scroll Engine
 * Smart Progressive 50-Frame Batching & On-Demand Scroll Preloader
 */

function initHero169ScrollAnimation() {
  const TOTAL_FRAMES = 240;
  const BATCH_SIZE = 50;
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
  const loadedFrames = new Set();
  const loadingFrames = new Set();

  let currentFrame = 0;
  let targetFrame = 0;
  let lastRenderedFrame = -1;

  function getFramePath(index) {
    const num = String(index).padStart(3, '0');
    return `${FOLDER}/ezgif-frame-${num}.jpg`;
  }

  // Load a single frame on demand
  function loadSingleFrame(i, onComplete) {
    if (i < 0 || i >= TOTAL_FRAMES) return;
    if (loadedFrames.has(i) || loadingFrames.has(i)) return;

    loadingFrames.add(i);
    const img = new Image();

    img.onload = () => {
      images[i] = img;
      loadedFrames.add(i);
      loadingFrames.delete(i);

      if (i === 0) {
        drawFrame(0);
      }
      if (loadedFrames.size >= 5 && loader) {
        loader.classList.add('ready');
      }
      if (onComplete) onComplete(i);
    };

    img.onerror = () => {
      loadingFrames.delete(i);
    };

    img.src = getFramePath(i + 1); // 1-indexed filenames
  }

  // Progressive Batch Loader: loads 50 frames at a time in chunks
  function loadBatch(startIdx) {
    if (startIdx >= TOTAL_FRAMES) return;

    const endIdx = Math.min(startIdx + BATCH_SIZE, TOTAL_FRAMES);
    let completedInBatch = 0;
    const batchTotal = endIdx - startIdx;

    for (let i = startIdx; i < endIdx; i++) {
      loadSingleFrame(i, () => {
        completedInBatch++;
        // When 40% of the current batch is loaded, queue next batch of 50 gently
        if (completedInBatch >= Math.floor(batchTotal * 0.4) && endIdx < TOTAL_FRAMES && !loadingFrames.has(endIdx)) {
          setTimeout(() => loadBatch(endIdx), 120);
        }
      });
    }
  }

  // Prioritize frames around current scroll position
  function prioritizeNearbyFrames(centerFrame) {
    const range = 25; // 25 frames ahead & behind
    const start = Math.max(0, Math.floor(centerFrame - range));
    const end = Math.min(TOTAL_FRAMES - 1, Math.ceil(centerFrame + range));

    for (let i = start; i <= end; i++) {
      loadSingleFrame(i);
    }
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

  // Find nearest loaded frame if exact frame is still downloading
  function getNearestLoadedFrame(targetIdx) {
    if (images[targetIdx] && images[targetIdx].complete) {
      return targetIdx;
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const left = targetIdx - offset;
      const right = targetIdx + offset;

      if (left >= 0 && images[left] && images[left].complete) return left;
      if (right < TOTAL_FRAMES && images[right] && images[right].complete) return right;
    }

    return 0;
  }

  function drawFrame(frameIndex) {
    const clampedIndex = Math.min(Math.max(frameIndex, 0), TOTAL_FRAMES - 1);
    const renderIndex = getNearestLoadedFrame(clampedIndex);
    const img = images[renderIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgRatio = imgW / imgH; // 16:9
    const canvasRatio = canvasW / canvasH;

    let drawW, drawH, offsetX, offsetY;

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

    // On-demand load surrounding frames as the user scrolls
    prioritizeNearbyFrames(targetFrame);
  }

  function renderLoop() {
    currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;
    const frameToDraw = Math.round(currentFrame);

    if (frameToDraw !== lastRenderedFrame) {
      drawFrame(frameToDraw);
    }

    requestAnimationFrame(renderLoop);
  }

  // Initialize: Load Frame 1 immediately, then start 50-by-50 progressive batches
  function initLoadingStrategy() {
    // 1. Immediately fetch first frame for instant display
    loadSingleFrame(0, () => {
      drawFrame(0);
    });

    // 2. Load first batch (0 to 50)
    loadBatch(0);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });

  resizeCanvas();
  initLoadingStrategy();
  updateScroll();
  requestAnimationFrame(renderLoop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero169ScrollAnimation);
} else {
  initHero169ScrollAnimation();
}
