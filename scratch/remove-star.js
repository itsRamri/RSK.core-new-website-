import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/profile 2.jpeg');
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });

  console.log(`Image dimensions: ${width}x${height}`);

  // Find pixels where brightness or gradient indicates the star shape:
  // The star is a 4-pointed sparkle in the lower-right sleeve quadrant
  for (let y = Math.floor(height * 0.6); y < height; y++) {
    for (let x = Math.floor(width * 0.8); x < width; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      
      // Look for the star pixels which are lighter/darker than neighboring shirt cloth
      // In profile 2.jpeg, shirt cloth in this area is around [180..210, 180..210, 180..210]
      // Let's print candidate clusters
    }
  }

  // Let's do a complete clean inpainting for the entire bounding box x: 890..990, y: 920..1060
  // using seamless vertical & horizontal texture synthesis from the left shirt fabric (x: 840..885)
  for (let y = 920; y <= 1060; y++) {
    for (let x = 890; x <= 990; x++) {
      // Source x from authentic shirt cloth
      const srcX = x - 95;
      const srcIdx = (y * width + srcX) * 3;
      const dstIdx = (y * width + x) * 3;
      
      // If destination is inside the shirt (not black bg)
      if (data[dstIdx] > 20 || data[dstIdx+1] > 20 || data[dstIdx+2] > 20) {
        data[dstIdx] = data[srcIdx];
        data[dstIdx+1] = data[srcIdx+1];
        data[dstIdx+2] = data[srcIdx+2];
      }
    }
  }

  // Now create the cutout RGBA buffer
  const isBg = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
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
    const pIdx = curr * 3;
    const r = data[pIdx], g = data[pIdx+1], b = data[pIdx+2];

    if (r <= 12 && g <= 12 && b <= 12) {
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
      const srcIdx = idx * 3;
      const dstIdx = idx * 4;

      outData[dstIdx] = data[srcIdx];
      outData[dstIdx + 1] = data[srcIdx + 1];
      outData[dstIdx + 2] = data[srcIdx + 2];
      outData[dstIdx + 3] = isBg[idx] === 1 ? 0 : 255;
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

  console.log(`Saved completely clean cutout with zero watermark to ${outPath}`);
}

main().catch(console.error);
