import sharp from 'sharp';

async function floodFillCutout() {
  const img = sharp('public/ezgif-476a1f2348609364-jpg/profile.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's create an alpha mask buffer
  const mask = new Uint8Array(width * height); // 0 = bg, 255 = fg
  mask.fill(255); // start by assuming all is foreground

  const visited = new Uint8Array(width * height);
  const queue = [];

  // Wall color characteristics:
  // In profile.jpeg:
  // - Person's hair: very dark (maxVal < 100)
  // - Person's face: skin tone (r: 150..255, g: 80..180, b: 50..150, (r-b) > 40, (r-g) > 25)
  // - Person's shirt: light neutral (r: 170..235, g: 160..220, b: 150..210, (r-b) < 25, (g-b) < 15)
  // - Person's blue lanyard: deep blue (b > r, b > g)
  // - Person's arms/hands: skin tone (r: 160..230, g: 100..170, b: 60..130, (r-b) > 40)
  
  // Wall is either:
  // 1. Shaded left wall: r: 130..195, g: 110..170, b: 90..145, (r-b) in 30..60, (g-b) in 15..35
  // 2. Bright sunlit right wall: r: 210..255, g: 180..240, b: 135..190, (r-b) in 45..85, (g-b) in 25..55
  // 3. Dark diagonal shadow on right wall: r: 130..180, g: 105..150, b: 80..120

  function isPersonPixel(x, y, r, g, b) {
    // Hair
    if (r < 95 && g < 85 && b < 75 && y < 500 && x > 340 && x < 760) return true;
    // Blue lanyard
    if (b > r + 15 || b > g + 10) return true;
    // Red thread / necklace
    if (r > 150 && g < 60 && b < 60) return true;
    // Gold pendant
    if (r > 180 && g > 150 && b < 80) return true;
    // Skin (Face / Neck / Hands)
    if (r > 130 && g > 70 && b > 40 && (r - b) > 42 && (r - g) > 20) {
      // make sure it's inside the person's x-range
      if (x > 320 && x < 890) return true;
    }
    // Shirt (Cool grey-white, low saturation compared to warm yellow wall)
    if (y > 540 && x > 160 && x < 960) {
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const diff = maxVal - minVal;
      // Shirt fabric is neutral: diff <= 28, r-b <= 24
      if (diff <= 28 && (r - b) <= 24 && minVal > 120) {
        return true;
      }
      // Shadow folds in shirt
      if (r < 150 && g < 145 && b < 140 && diff < 20) {
        return true;
      }
    }
    return false;
  }

  // Push all image boundaries (top, left, right, bottom corners)
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
  for (let x = 0; x < 150; x++) {
    const idx = (height - 1) * width + x;
    if (!visited[idx]) { queue.push(idx); visited[idx] = 1; }
  }
  for (let x = width - 150; x < width; x++) {
    const idx = (height - 1) * width + x;
    if (!visited[idx]) { queue.push(idx); visited[idx] = 1; }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);
    const pIdx = curr * channels;
    const r = data[pIdx], g = data[pIdx + 1], b = data[pIdx + 2];

    if (!isPersonPixel(cx, cy, r, g, b)) {
      mask[curr] = 0; // It's background!

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

  // RGBA output buffer
  const outData = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      outData[dstIdx] = data[srcIdx];
      outData[dstIdx + 1] = data[srcIdx + 1];
      outData[dstIdx + 2] = data[srcIdx + 2];

      if (mask[idx] === 0) {
        outData[dstIdx + 3] = 0;
      } else {
        outData[dstIdx + 3] = 255;
      }
    }
  }

  // Smooth mask boundaries with 2px anti-aliasing
  for (let y = 2; y < height - 2; y++) {
    for (let x = 2; x < width - 2; x++) {
      const idx = y * width + x;
      const dstIdx = idx * 4;
      if (outData[dstIdx + 3] === 255) {
        let bgCount = 0;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (mask[(y + dy) * width + (x + dx)] === 0) bgCount++;
          }
        }
        if (bgCount > 0) {
          const alphaFactor = 1 - (bgCount / 25);
          outData[dstIdx + 3] = Math.max(30, Math.round(255 * alphaFactor));
        }
      }
    }
  }

  const outPath = 'public/ezgif-476a1f2348609364-jpg/shubham-folded-cutout.png';
  await sharp(outData, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 8 })
    .toFile(outPath);

  console.log('Successfully saved cutout to:', outPath);
}

floodFillCutout().catch(console.error);
