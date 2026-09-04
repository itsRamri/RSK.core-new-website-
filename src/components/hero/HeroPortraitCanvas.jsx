import React, { useEffect, useRef, useState } from 'react';

export const HeroPortraitCanvas = () => {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/ezgif-476a1f2348609364-jpg/shubham%20profile.jpeg';

    img.onload = () => {
      const w = img.naturalWidth || 1254;
      const h = img.naturalHeight || 1254;

      canvas.width = w;
      canvas.height = h;

      // Draw original image
      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;

      // Create segmentation mask: 0 = background, 1 = foreground (Shubham Kumar)
      const mask = new Uint8Array(w * h);

      // Queue for BFS flood fill from all 4 perimeter edges
      const queue = new Int32Array(w * h);
      let head = 0;
      let tail = 0;

      // Background threshold test: dark background with wireframes
      const isBackgroundPixel = (x, y) => {
        const idx = (y * w + x) * 4;
        const r = d[idx];
        const g = d[idx + 1];
        const b = d[idx + 2];

        // Cyan / Warm rim lighting on Shubham's hair/ears/shoulders
        const isCyanRim = b > 60 && g > 40 && b > r + 15;
        const isWarmRim = r > 70 && g > 35 && r > b + 25;
        const isSkin = r > 95 && g > 55 && b > 35 && r > b + 10;
        const isShirt = (r + g + b) > 360 || (r > 130 && g > 130 && b > 130);
        const isLanyard = b > 85 && b > r + 20;

        if (isSkin || isShirt || isLanyard || isCyanRim || isWarmRim) {
          return false;
        }

        // Dark background or wireframe line
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        return luma < 52;
      };

      // Seed from top, left, and right borders
      const visited = new Uint8Array(w * h);

      for (let x = 0; x < w; x++) {
        // Top edge
        if (isBackgroundPixel(x, 0)) {
          const p = x;
          visited[p] = 1;
          queue[tail++] = p;
        }
      }

      for (let y = 0; y < h; y++) {
        // Left edge
        if (isBackgroundPixel(0, y)) {
          const p = y * w;
          if (!visited[p]) {
            visited[p] = 1;
            queue[tail++] = p;
          }
        }
        // Right edge
        if (isBackgroundPixel(w - 1, y)) {
          const p = y * w + (w - 1);
          if (!visited[p]) {
            visited[p] = 1;
            queue[tail++] = p;
          }
        }
      }

      // BFS flood fill to find all connected background pixels
      while (head < tail) {
        const p = queue[head++];
        const x = p % w;
        const y = Math.floor(p / w);

        // 4-way neighbors
        const neighbors = [
          x > 0 ? p - 1 : -1,
          x < w - 1 ? p + 1 : -1,
          y > 0 ? p - w : -1,
          y < h - 1 ? p + w : -1
        ];

        for (let i = 0; i < 4; i++) {
          const np = neighbors[i];
          if (np !== -1 && !visited[np]) {
            const nx = np % w;
            const ny = Math.floor(np / w);
            if (isBackgroundPixel(nx, ny)) {
              visited[np] = 1;
              queue[tail++] = np;
            }
          }
        }
      }

      // Fill mask: foreground = 255 where not visited by background flood
      for (let i = 0; i < w * h; i++) {
        mask[i] = visited[i] ? 0 : 255;
      }

      // Smooth mask edges (box blur / morphological feathering)
      const smoothed = new Uint8Array(w * h);
      const radius = 2;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let sum = 0;
          let count = 0;

          for (let dy = -radius; dy <= radius; dy++) {
            const ny = y + dy;
            if (ny >= 0 && ny < h) {
              for (let dx = -radius; dx <= radius; dx++) {
                const nx = x + dx;
                if (nx >= 0 && nx < w) {
                  sum += mask[ny * w + nx];
                  count++;
                }
              }
            }
          }
          smoothed[y * w + x] = Math.round(sum / count);
        }
      }

      // Apply alpha channel to image data with smooth bottom torso fade
      const bottomFadeStart = Math.floor(h * 0.82);

      for (let y = 0; y < h; y++) {
        let bottomFactor = 1.0;
        if (y > bottomFadeStart) {
          bottomFactor = Math.max(0, 1 - (y - bottomFadeStart) / (h - bottomFadeStart));
          // smooth step curve
          bottomFactor = bottomFactor * bottomFactor * (3 - 2 * bottomFactor);
        }

        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const mAlpha = smoothed[y * w + x] / 255;
          d[idx + 3] = Math.round(255 * mAlpha * bottomFactor);
        }
      }

      // Write processed cutout to canvas
      ctx.putImageData(imgData, 0, 0);
      setIsLoaded(true);
    };
  }, []);

  return (
    <div className={`hero-cutout-wrapper ${isLoaded ? 'loaded' : ''}`}>
      <canvas
        ref={canvasRef}
        className="hero-cutout-canvas"
        aria-label="Shubham Kumar - Portfolio Portrait"
      />
    </div>
  );
};
