import sharp from 'sharp';
import fs from 'fs';

async function generateCutout() {
  const img = sharp('public/ezgif-476a1f2348609364-jpg/profile.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // We want to segment the person from the wall background.
  // The person's bounds:
  // - Top of hair is around y = 140, x = 370..740
  // - Left boundary of body: from x = 380 at y=200 down to x=180 at y=900, x=300 at y=1300
  // - Right boundary of body: from x=740 at y=200 down to x=940 at y=900, x=880 at y=1300
  // - Background is exterior: top left, top, top right, bottom left, bottom right.

  const isBg = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);

  function isBgPixel(x, y, r, g, b) {
    // Core protection for the person
    // Head & face
    if (y >= 145 && y <= 560 && x >= 370 && x <= 740) return false;
    // Torso & shirt
    if (y > 560 && y <= 1100 && x >= 220 && x <= 900) return false;
    // Lower torso, arms & hands
    if (y > 1100 && x >= 280 && x <= 880) return false;

    // Background in profile.jpeg is the wall:
    // Left/top wall is warm grey/beige: r ~ 190..230, g ~ 180..220, b ~ 170..210
    // Right wall (sunlit area) is warm golden cream: r ~ 230..255, g ~ 210..245, b ~ 180..220
    // Shaded areas: r, g, b with low color variance or characteristic wall tone
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;

    // Dark hair protection: if very dark (r<70, g<70, b<70), it's definitely hair/beard/collar
    if (r < 65 && g < 65 && b < 65) return false;

    // Skin tones protection: r > g > b with healthy red/yellow tint
    if (r > 100 && g > 60 && b > 40 && (r - b) > 25 && y > 150 && y < 1400) {
      if (x >= 320 && x <= 780) return false; // face/neck/hands
    }

    // Wall characteristics
    // 1. Shaded wall (left & upper left)
    if (r >= 140 && r <= 230 && g >= 130 && g <= 220 && b >= 120 && b <= 210 && diff < 35) {
      return true;
    }

    // 2. Bright sunlit wall (upper right & right)
    if (r >= 200 && g >= 180 && b >= 140 && (r - b) < 60) {
      return true;
    }

    // 3. Ambient wall general
    if (diff < 30 && minVal > 110) {
      return true;
    }

    return false;
  }

  // Flood fill from boundaries
  const queue = [];
  for (let x = 0; x < width; x++) {
    queue.push(0 * width + x);
    visited[0 * width + x] = 1;
  }
  for (let y = 0; y < height; y++) {
    queue.push(y * width + 0);
    visited[y * width + 0] = 1;
    queue.push(y * width + (width - 1));
    visited[y * width + (width - 1)] = 1;
  }
  for (let x = 0; x < 200; x++) {
    const idx = (height - 1) * width + x;
    queue.push(idx);
    visited[idx] = 1;
  }
  for (let x = width - 200; x < width; x++) {
    const idx = (height - 1) * width + x;
    queue.push(idx);
    visited[idx] = 1;
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);
    const pIdx = curr * channels;
    const r = data[pIdx], g = data[pIdx + 1], b = data[pIdx + 2];

    if (isBgPixel(cx, cy, r, g, b)) {
      isBg[curr] = 1;

      const neighbors = [
        [cx + 1, cy],
        [cx - 1, cy],
        [cx, cy + 1],
        [cx, cy - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx = ny * width + nx;
          if (!visited[nIdx]) {
            visited[nIdx] = 1;
            queue.push(nIdx);
          }
        }
      }
    }
  }

  const outData = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      outData[dstIdx] = data[srcIdx];
      outData[dstIdx + 1] = data[srcIdx + 1];
      outData[dstIdx + 2] = data[srcIdx + 2];

      if (isBg[idx] === 1) {
        outData[dstIdx + 3] = 0; // transparent background
      } else {
        outData[dstIdx + 3] = 255;
      }
    }
  }

  // Smooth edges with simple 1px anti-aliasing
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const dstIdx = idx * 4;

      if (outData[dstIdx + 3] === 255) {
        // Count transparent neighbors
        let bgNeighbors = 0;
        const nArr = [
          (y - 1) * width + x,
          (y + 1) * width + x,
          y * width + (x - 1),
          y * width + (x + 1)
        ];
        for (const n of nArr) {
          if (isBg[n] === 1) bgNeighbors++;
        }
        if (bgNeighbors === 1) outData[dstIdx + 3] = 210;
        else if (bgNeighbors === 2) outData[dstIdx + 3] = 150;
        else if (bgNeighbors >= 3) outData[dstIdx + 3] = 80;
      }
    }
  }

  const outPath = 'public/ezgif-476a1f2348609364-jpg/shubham-cutout-arms.png';
  await sharp(outData, {
    raw: { width, height, channels: 4 }
  })
  .png({ compressionLevel: 8 })
  .toFile(outPath);

  console.log('Saved cutout with folded arms to:', outPath);
}

generateCutout().catch(console.error);
