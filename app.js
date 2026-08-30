(function () {
  const TOTAL_FRAMES = 240;
  const BATCH_SIZE = 50;
  const FOLDER = 'ezgif-476a1f2348609364-jpg';
  const LERP_FACTOR = 0.085;

  const canvas = document.getElementById('animation-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');

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

      if (loaderProgress) {
        loaderProgress.style.width = `${Math.round((loadedFrames.size / TOTAL_FRAMES) * 100)}%`;
      }

      if (loadedFrames.size >= 5 && loader) {
        loader.classList.add('loaded');
      }

      if (onComplete) onComplete(i);
    };

    img.onerror = () => {
      loadingFrames.delete(i);
    };

    img.src = getFramePath(i + 1);
  }

  // Load in chunks of 50
  function loadBatch(startIdx) {
    if (startIdx >= TOTAL_FRAMES) return;

    const endIdx = Math.min(startIdx + BATCH_SIZE, TOTAL_FRAMES);
    let completedInBatch = 0;
    const batchTotal = endIdx - startIdx;

    for (let i = startIdx; i < endIdx; i++) {
      loadSingleFrame(i, () => {
        completedInBatch++;
        if (completedInBatch >= Math.floor(batchTotal * 0.4) && endIdx < TOTAL_FRAMES && !loadingFrames.has(endIdx)) {
          setTimeout(() => loadBatch(endIdx), 100);
        }
      });
    }
  }

  // Prioritize frames near scroll position
  function prioritizeNearbyFrames(centerFrame) {
    const range = 25;
    const start = Math.max(0, Math.floor(centerFrame - range));
    const end = Math.min(TOTAL_FRAMES - 1, Math.ceil(centerFrame + range));

    for (let i = start; i <= end; i++) {
      loadSingleFrame(i);
    }
  }

  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    lastRenderedFrame = -1;
    drawFrame(Math.round(currentFrame));
  }

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
    const imgRatio = imgW / imgH;
    const canvasRatio = canvasW / canvasH;

    let drawW, drawH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
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
  }

  function updateScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;

    if (maxScroll <= 0) {
      targetFrame = 0;
      return;
    }

    const scrollFraction = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    targetFrame = scrollFraction * (TOTAL_FRAMES - 1);

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

  function init() {
    setupCanvas();
    // Load frame 1 instantly
    loadSingleFrame(0, () => drawFrame(0));
    // Start progressive 50-by-50 chunk load
    loadBatch(0);
    updateScroll();
    requestAnimationFrame(renderLoop);
  }

  window.addEventListener('resize', setupCanvas, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });

  init();
})();