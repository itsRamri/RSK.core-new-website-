import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/profile.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isBg = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);

  // In profile.jpeg:
  // Shirt core is at y >= 640, x: 260..760 (protected so white shirt is never treated as grey bg)
  // Neck core is at y >= 530 && y <= 640, x: 420..580
  // Face core is at y >= 220 && y <= 530, x: 400..600

  function isBackground(x, y, r, g, b) {
    // Face & neck core protection
    if (y >= 220 && y <= 530 && x >= 400 && x <= 600) return false;
    if (y >= 530 && y <= 640 && x >= 420 && x <= 580) return false;
    // Shirt core protection
    if (y >= 640 && x >= 260 && x <= 760) return false;

    // Right sleeve outer boundary is at x <= 920. Beyond x > 850 at y > 780, clear watermark icon
    if (x > 850 && y > 780) return true;
    // Left sleeve outer boundary is at x >= 120. Beyond x < 120, clear background
    if (x < 120 && y > 780) return true;

    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;

    // Background in profile.jpeg is light studio grey (185..240) with low saturation
    if (r >= 185 && r <= 245 && g >= 185 && g <= 245 && b >= 185 && b <= 245 && diff <= 12) {
      return true;
    }
    // Very faint shaded gradient
    if (r >= 180 && r <= 245 && g >= 180 && g <= 245 && b >= 180 && b <= 245 && diff <= 6) {
      return true;
    }

    return false;
  }

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
  for (let x = 0; x < 90; x++) {
    const idx = (height - 1) * width + x;
    queue.push(idx);
    visited[idx] = 1;
  }
  for (let x = width - 90; x < width; x++) {
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
    const r = data[pIdx], g = data[pIdx+1], b = data[pIdx+2];

    if (isBackground(cx, cy, r, g, b)) {
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

  // RGBA output
  const outData = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      outData[dstIdx] = data[srcIdx];
      outData[dstIdx + 1] = data[srcIdx + 1];
      outData[dstIdx + 2] = data[srcIdx + 2];

      if (isBg[idx] === 1 || (x > 850 && y > 780 && isBackground(x, y, data[srcIdx], data[srcIdx+1], data[srcIdx+2]))) {
        outData[dstIdx + 3] = 0;
      } else {
        outData[dstIdx + 3] = 255;
      }
    }
  }

  // 1-pixel feathering
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (outData[idx * 4 + 3] === 255) {
        let bgCount = 0;
        if (outData[(idx - 1) * 4 + 3] === 0) bgCount++;
        if (outData[(idx + 1) * 4 + 3] === 0) bgCount++;
        if (outData[(idx - width) * 4 + 3] === 0) bgCount++;
        if (outData[(idx + width) * 4 + 3] === 0) bgCount++;

        if (bgCount >= 2) {
          outData[idx * 4 + 3] = 140;
        } else if (bgCount === 1) {
          outData[idx * 4 + 3] = 210;
        }
      }
    }
  }

  const outPath = 'public/ezgif-476a1f2348609364-jpg/shubham-cutout.png';
  await sharp(outData, {
    raw: { width, height, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

  console.log(`Saved clean cutout from profile.jpeg to ${outPath}`);
}

main().catch(console.error);
