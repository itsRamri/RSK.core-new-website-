import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  function isBackground(r, g, b) {
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;

    // Any dark pixel is background
    if (maxVal <= 35) return true;

    // Wireframes (grey / low saturation lines)
    if (maxVal <= 75 && diff <= 16) return true;
    if (maxVal <= 90 && diff <= 10) return true;

    return false;
  }

  const topY = 84;
  const rawLeft = new Array(height).fill(-1);
  const rawRight = new Array(height).fill(-1);

  for (let y = topY; y < height; y++) {
    const centerX = 590;

    // Search left from centerX
    for (let x = 0; x < centerX; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (!isBackground(r, g, b)) {
        rawLeft[y] = x;
        break;
      }
    }

    // Search right from centerX
    for (let x = width - 1; x >= centerX; x--) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (!isBackground(r, g, b)) {
        rawRight[y] = x;
        break;
      }
    }
  }

  // Smooth boundaries using median filter (radius = 3) to remove any isolated wireframe spikes
  const leftBounds = new Array(height).fill(-1);
  const rightBounds = new Array(height).fill(-1);

  for (let y = topY; y < height; y++) {
    const lWin = [], rWin = [];
    for (let dy = -3; dy <= 3; dy++) {
      const ny = y + dy;
      if (ny >= topY && ny < height) {
        if (rawLeft[ny] !== -1) lWin.push(rawLeft[ny]);
        if (rawRight[ny] !== -1) rWin.push(rawRight[ny]);
      }
    }
    lWin.sort((a, b) => a - b);
    rWin.sort((a, b) => a - b);

    leftBounds[y] = lWin.length > 0 ? lWin[Math.floor(lWin.length / 2)] : rawLeft[y];
    rightBounds[y] = rWin.length > 0 ? rWin[Math.floor(rWin.length / 2)] : rawRight[y];
  }

  // Create RGBA output
  const outData = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    const lx = leftBounds[y];
    const rx = rightBounds[y];

    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      outData[dstIdx] = data[srcIdx];
      outData[dstIdx + 1] = data[srcIdx + 1];
      outData[dstIdx + 2] = data[srcIdx + 2];

      if (y < topY || lx === -1 || rx === -1 || x < lx || x > rx) {
        outData[dstIdx + 3] = 0; // Transparent
      } else {
        const distToEdge = Math.min(x - lx, rx - x, y - topY);
        if (distToEdge === 0) {
          outData[dstIdx + 3] = 140;
        } else if (distToEdge === 1) {
          outData[dstIdx + 3] = 210;
        } else {
          outData[dstIdx + 3] = 255; // Solid
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

  console.log(`Generated polished cutout: ${outPath}`);
}

main().catch(console.error);
