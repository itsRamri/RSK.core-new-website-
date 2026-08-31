/**
 * RSK Portfolio - 16:9 Landscape Hero Video Scroll Engine
 * Smart On-Demand Scroll Preloader & 50-Frame Chunk Manager
 * Only loads frames when the user scrolls, in 50-frame progressive chunks
 */

function initHero169ScrollAnimation() {
  const TOTAL_FRAMES = 240;
  const CHUNK_SIZE = 50;
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
  const loadedChunks = new Set(); // Track loaded 50-frame chunks

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

      if (i === 0 || lastRenderedFrame === -1) {
        drawFrame(Math.round(currentFrame));
      }
      if (loader) {
        loader.classList.add('ready');
      }
      if (onComplete) onComplete(i);
    };

    img.onerror = () => {
      loadingFrames.delete(i);
      if (loader) {
        loader.classList.add('ready');
      }
    };

    img.src = getFramePath(i + 1); // 1-indexed filenames (1 to 240)
  }

  // Load specific 50-frame chunk (e.g. chunk 0 = 0..49, chunk 1 = 50..99)
  function loadChunk(chunkIndex) {
    if (loadedChunks.has(chunkIndex)) return;
    loadedChunks.add(chunkIndex);

    const startIdx = chunkIndex * CHUNK_SIZE;
    const endIdx = Math.min(startIdx + CHUNK_SIZE, TOTAL_FRAMES);

    for (let i = startIdx; i < endIdx; i++) {
      loadSingleFrame(i);
    }
  }

  // On-demand loader when user scrolls:
  // 1. Immediately loads closest 15 frames for ultra-fast response
  // 2. Loads the 50-frame chunk corresponding to the scroll region
  function triggerScrollLoading(currentProgressIndex) {
    // 1. Load active window around current frame (+/- 15 frames)
    const windowStart = Math.max(0, Math.floor(currentProgressIndex - 15));
    const windowEnd = Math.min(TOTAL_FRAMES - 1, Math.ceil(currentProgressIndex + 15));

    for (let i = windowStart; i <= windowEnd; i++) {
      loadSingleFrame(i);
    }

    // 2. Load the current 50-frame chunk
    const currentChunk = Math.floor(currentProgressIndex / CHUNK_SIZE);
    loadChunk(currentChunk);

    // 3. Preload next chunk if nearing boundary
    const chunkOffset = currentProgressIndex % CHUNK_SIZE;
    if (chunkOffset > 30 && (currentChunk + 1) * CHUNK_SIZE < TOTAL_FRAMES) {
      loadChunk(currentChunk + 1);
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

  // Find nearest loaded frame if current frame is still fetching
  function getNearestLoadedFrame(targetIdx) {
    if (images[targetIdx] && images[targetIdx].complete && images[targetIdx].naturalWidth > 0) {
      return targetIdx;
    }

    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const left = targetIdx - offset;
      const right = targetIdx + offset;

      if (left >= 0 && images[left] && images[left].complete && images[left].naturalWidth > 0) return left;
      if (right < TOTAL_FRAMES && images[right] && images[right].complete && images[right].naturalWidth > 0) return right;
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
    const imgRatio = imgW / imgH;
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

    // On scroll: load surrounding frames and active 50-frame chunk
    triggerScrollLoading(targetFrame);
  }

  function renderLoop() {
    currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;
    const frameToDraw = Math.round(currentFrame);

    if (frameToDraw !== lastRenderedFrame) {
      drawFrame(frameToDraw);
    }

    requestAnimationFrame(renderLoop);
  }

  // Initial Load Strategy:
  // ONLY load Frame 0 immediately. Do NOT load all 240 frames up front!
  function initLoadingStrategy() {
    // 1. Fetch only the first frame (Frame 0) for instant startup
    loadSingleFrame(0, () => {
      drawFrame(0);
      if (loader) loader.classList.add('ready');
    });

    // 2. Preload first 5 frames so initial gentle scroll is seamless
    for (let i = 1; i < 5; i++) {
      loadSingleFrame(i);
    }

    // 3. Failsafe timeout: hide loader after 1s no matter what
    setTimeout(() => {
      if (loader && !loader.classList.contains('ready')) {
        loader.classList.add('ready');
      }
    }, 1000);
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
