import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's create an array of boolean flags: isBg[y * width + x]
  const isBg = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);

  // Hair contour definition:
  // Top of head apex is at (x=590, y=86)
  // Left hair boundary goes from (x=380, y=200) to (590, 86)
  // Right hair boundary goes from (800, 200) to (590, 86)
  // Let's check if a point (x,y) is strictly above the hair dome:
  function isAboveHairDome(x, y) {
    if (y < 84) return true;
    if (y > 220) return false;
    
    // Parabolic / elliptical top dome
    // Apex at (580, 86). At y = 200, width spans from 380 to 790.
    const hCenter = 580;
    const dy = y - 84;
    // Semi-major axis along x: at dy=120, rx ~ 205
    const rx = 1.9 * Math.sqrt(Math.max(0, dy * 115));
    if (x < hCenter - rx || x > hCenter + rx) {
      return true; // outside dome -> can be background
    }
    return false; // inside hair dome -> protected foreground
  }

  function isBackgroundPixel(x, y, r, g, b) {
    // If inside protected person region (e.g. head/face/torso interior), it cannot be background
    // Head interior: y between 90 and 700, x between 420 and 760
    if (y >= 90 && y <= 680 && x >= 420 && x <= 760) {
      return false;
    }
    // Neck & Torso interior: y between 680 and 1253, x between 300 and 950
    if (y >= 680 && x >= 300 && x <= 950) {
      return false;
    }
    // If inside hair dome
    if (!isAboveHairDome(x, y) && y >= 84 && y <= 220 && x >= 380 && x <= 800) {
      return false;
    }

    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;

    // Dark neutral background
    if (maxVal <= 35) return true;

    // Dark grey wireframes (achromatic lines on dark bg)
    if (maxVal <= 65 && diff <= 12) return true;

    // Slightly brighter wireframe intersections
    if (maxVal <= 75 && diff <= 8) return true;

    return false;
  }

  // Multi-source BFS flood-fill from exterior borders:
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
  for (let x = 0; x < 120; x++) {
    const idx = (height - 1) * width + x;
    queue.push(idx);
    visited[idx] = 1;
  }
  for (let x = width - 120; x < width; x++) {
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

    if (isBackgroundPixel(cx, cy, r, g, b)) {
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

  // Ensure top-most area y < 84 is 100% background
  for (let y = 0; y < 84; y++) {
    for (let x = 0; x < width; x++) {
      isBg[y * width + x] = 1;
    }
  }

  // Create RGBA output buffer
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
        outData[dstIdx + 3] = 0; // transparent
      } else {
        outData[dstIdx + 3] = 255; // solid foreground
      }
    }
  }

  // Apply subtle anti-aliasing / alpha feathering on the 1-pixel boundary
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (outData[idx * 4 + 3] === 255) {
        let bgCount = 0;
        if (isBg[idx - 1]) bgCount++;
        if (isBg[idx + 1]) bgCount++;
        if (isBg[idx - width]) bgCount++;
        if (isBg[idx + width]) bgCount++;

        if (bgCount >= 2) {
          outData[idx * 4 + 3] = 160;
        } else if (bgCount === 1) {
          outData[idx * 4 + 3] = 215;
        }
      }
    }
  }

  const outPath = 'public/ezgif-476a1f2348609364-jpg/shubham-cutout.png';
  await sharp(outData, {
    raw: {
      width,
      height,
      channels: 4
    }
  })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

  console.log(`Saved flawless cutout to ${outPath}`);
}

main().catch(console.error);
