import React, { useRef, useEffect, useState } from 'react';

const TOTAL_FRAMES = 240;
const CHUNK_SIZE = 50;
const FOLDER = '/ezgif-476a1f2348609364-jpg';
const LERP_FACTOR = 0.085;

export const HeroVideoCanvas = () => {
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    const heroSection = document.getElementById('hero');

    const images = new Array(TOTAL_FRAMES);
    const loadedFrames = new Set();
    const loadingFrames = new Set();
    const loadedChunks = new Set();

    // Start on front-facing portrait frame (Frame 240)
    let currentFrame = TOTAL_FRAMES - 1;
    let targetFrame = TOTAL_FRAMES - 1;
    let lastRenderedFrame = -1;
    let animId = null;

    const getFramePath = (index) => {
      const num = String(index).padStart(3, '0');
      return `${FOLDER}/ezgif-frame-${num}.jpg`;
    };

    const drawPlaceholderGrid = () => {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    };

    const loadSingleFrame = (i, onComplete) => {
      if (i < 0 || i >= TOTAL_FRAMES) return;
      if (loadedFrames.has(i) || loadingFrames.has(i)) return;

      loadingFrames.add(i);
      const img = new Image();

      img.onload = () => {
        images[i] = img;
        loadedFrames.add(i);
        loadingFrames.delete(i);

        if (i === (TOTAL_FRAMES - 1) || lastRenderedFrame === -1) {
          drawFrame(Math.round(currentFrame));
        }
        setIsReady(true);
        if (onComplete) onComplete(i);
      };

      img.onerror = () => {
        loadingFrames.delete(i);
        setIsReady(true);
      };

      img.src = getFramePath(i + 1);
    };

    const loadChunk = (chunkIndex) => {
      if (loadedChunks.has(chunkIndex)) return;
      loadedChunks.add(chunkIndex);

      const startIdx = chunkIndex * CHUNK_SIZE;
      const endIdx = Math.min(startIdx + CHUNK_SIZE, TOTAL_FRAMES);

      for (let i = startIdx; i < endIdx; i++) {
        loadSingleFrame(i);
      }
    };

    const triggerScrollLoading = (currentProgressIndex) => {
      const windowStart = Math.max(0, Math.floor(currentProgressIndex - 20));
      const windowEnd = Math.min(TOTAL_FRAMES - 1, Math.ceil(currentProgressIndex + 20));

      for (let i = windowStart; i <= windowEnd; i++) {
        loadSingleFrame(i);
      }

      const currentChunk = Math.floor(currentProgressIndex / CHUNK_SIZE);
      loadChunk(currentChunk);

      if (currentChunk > 0) {
        loadChunk(currentChunk - 1);
      }
      if ((currentChunk + 1) * CHUNK_SIZE < TOTAL_FRAMES) {
        loadChunk(currentChunk + 1);
      }
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const width = rect.width || canvas.parentElement?.clientWidth || 1280;
      const height = rect.height || canvas.parentElement?.clientHeight || 720;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      lastRenderedFrame = -1;
      if (loadedFrames.size > 0) {
        drawFrame(Math.round(currentFrame));
      } else {
        drawPlaceholderGrid();
      }
    };

    const getNearestLoadedFrame = (targetIdx) => {
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
    };

    const drawFrame = (frameIndex) => {
      const clampedIndex = Math.min(Math.max(frameIndex, 0), TOTAL_FRAMES - 1);
      const renderIndex = getNearestLoadedFrame(clampedIndex);
      const img = images[renderIndex];

      if (!img || !img.complete || img.naturalWidth === 0) {
        drawPlaceholderGrid();
        return;
      }

      const canvasW = canvas.width;
      const canvasH = canvas.height;

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;

      // Edge-to-Edge Cover Math: Eliminates all extra space and black letterbox gaps around the photo
      const isMobile = window.innerWidth <= 768;
      const zoom = isMobile ? 1.04 : 1.08;
      const scale = Math.max(canvasW / imgW, canvasH / imgH) * zoom;

      const finalW = imgW * scale;
      const finalH = imgH * scale;

      // Center horizontally on the character
      const offsetX = (canvasW - finalW) / 2;

      // Safe top-proportional vertical alignment: preserves full hair and displays face & shoulders cleanly
      const offsetY = Math.min(0, (canvasH - finalH) * 0.16);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvasW, canvasH);
      ctx.drawImage(img, offsetX, offsetY, finalW, finalH);
      lastRenderedFrame = clampedIndex;
    };

    const updateScroll = () => {
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      const sectionTop = window.pageYOffset + rect.top;
      const sectionHeight = heroSection.offsetHeight;
      const viewportHeight = window.innerHeight;

      const scrollDistance = sectionHeight - viewportHeight;
      const currentScroll = window.pageYOffset - sectionTop;

      if (scrollDistance <= 0) {
        targetFrame = TOTAL_FRAMES - 1;
        return;
      }

      // Scroll Down = smooth front-to-back rotation (Frame 240 -> Frame 1)
      // Scroll Up = smooth back-to-front reversal (Frame 1 -> Frame 240)
      const progress = Math.min(Math.max(currentScroll / scrollDistance, 0), 1);
      targetFrame = (1 - progress) * (TOTAL_FRAMES - 1);

      triggerScrollLoading(targetFrame);
    };

    const renderLoop = () => {
      currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;
      const frameToDraw = Math.round(currentFrame);

      if (frameToDraw !== lastRenderedFrame) {
        drawFrame(frameToDraw);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    // Initialize with real front-facing portrait frame
    drawPlaceholderGrid();

    loadSingleFrame(TOTAL_FRAMES - 1, () => {
      drawFrame(TOTAL_FRAMES - 1);
      setIsReady(true);
    });

    for (let i = TOTAL_FRAMES - 2; i >= TOTAL_FRAMES - 10; i--) {
      loadSingleFrame(i);
    }

    const fallbackTimeout = setTimeout(() => {
      setIsReady(true);
    }, 400);

    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });

    resizeCanvas();
    updateScroll();
    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(fallbackTimeout);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', updateScroll);
    };
  }, []);

  return (
    <>
      {/* 16:9 Canvas */}
      <canvas id="hero-16-9-canvas" ref={canvasRef}></canvas>

      {/* Video Loading Indicator */}
      <div id="hero-video-loader" className={`hero-video-loader ${isReady ? 'ready' : ''}`}>
        <div className="hero-loader-ring"></div>
      </div>
    </>
  );
};
