import sharp from 'sharp';

async function extractProfile() {
  const img = sharp('public/ezgif-476a1f2348609364-jpg/profile.jpeg');
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  function isLeftWall(r, g, b) {
    // Left wall signature: r in 140..200, g in 120..175, b in 100..150, (r-g) between 15 and 35, (g-b) between 15 and 35
    const rg = r - g;
    const gb = g - b;
    const rb = r - b;
    if (r >= 140 && r <= 205 && g >= 120 && g <= 178 && b >= 100 && b <= 152) {
      if (rg >= 12 && rg <= 38 && gb >= 12 && gb <= 38 && rb >= 30 && rb <= 70) {
        return true;
      }
    }
    return false;
  }

  function isRightWall(r, g, b) {
    // Right wall bright signature: r in 220..255, g in 190..235, b in 145..190
    if (r >= 220 && g >= 185 && b >= 140) {
      const rg = r - g;
      const gb = g - b;
      if (rg >= 15 && rg <= 45 && gb >= 20 && gb <= 55) {
        return true;
      }
    }
    // Right wall diagonal shadow signature
    const rb = r - b;
    if (r >= 140 && r <= 215 && g >= 115 && g <= 180 && b >= 95 && b <= 155) {
      if ((r - g) >= 15 && (g - b) >= 15 && rb >= 35 && rb <= 70) {
        return true;
      }
    }
    return false;
  }

  const topY = 195; // Top of hair
  const leftEdge = new Array(height).fill(-1);
  const rightEdge = new Array(height).fill(-1);

  for (let y = topY; y < height; y++) {
    // Left edge: start from x=0 and go right
    for (let x = 0; x < width / 2; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (!isLeftWall(r, g, b)) {
        leftEdge[y] = x;
        break;
      }
    }

    // Right edge: start from x=width-1 and go left
    for (let x = width - 1; x >= width / 2; x--) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      if (!isRightWall(r, g, b)) {
        rightEdge[y] = x;
        break;
      }
    }
  }

  // Smooth boundaries with 5-pixel median filter
  const sLeft = new Array(height).fill(-1);
  const sRight = new Array(height).fill(-1);
  for (let y = topY; y < height; y++) {
    const lW = [], rW = [];
    for (let dy = -4; dy <= 4; dy++) {
      const ny = y + dy;
      if (ny >= topY && ny < height) {
        if (leftEdge[ny] > 0) lW.push(leftEdge[ny]);
        if (rightEdge[ny] > 0) rW.push(rightEdge[ny]);
      }
    }
    if (lW.length) {
      lW.sort((a,b)=>a-b);
      sLeft[y] = lW[Math.floor(lW.length/2)];
    }
    if (rW.length) {
      rW.sort((a,b)=>a-b);
      sRight[y] = rW[Math.floor(rW.length/2)];
    }
  }

  const outData = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const lx = sLeft[y];
    const rx = sRight[y];
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      outData[dstIdx] = data[srcIdx];
      outData[dstIdx + 1] = data[srcIdx + 1];
      outData[dstIdx + 2] = data[srcIdx + 2];

      if (y < topY || lx === -1 || rx === -1 || x < lx || x > rx) {
        outData[dstIdx + 3] = 0;
      } else {
        const dist = Math.min(x - lx, rx - x, y - topY);
        if (dist === 0) outData[dstIdx + 3] = 120;
        else if (dist === 1) outData[dstIdx + 3] = 200;
        else outData[dstIdx + 3] = 255;
      }
    }
  }

  const outPath = 'public/ezgif-476a1f2348609364-jpg/profile-cutout.png';
  await sharp(outData, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 8 })
    .toFile(outPath);
  console.log('Saved perfect profile-cutout.png');
}

extractProfile().catch(console.error);
