import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/shubham-cutout.png');
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });

  const outData = Buffer.from(data);

  // 1. Erode pure dark background fringe (pixels with r <= 25 && g <= 25 && b <= 25 that touch transparency)
  for (let pass = 0; pass < 3; pass++) {
    const toClear = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const a = outData[idx + 3];

        if (a > 0) {
          const r = outData[idx], g = outData[idx + 1], b = outData[idx + 2];
          const maxVal = Math.max(r, g, b);

          // If dark fringe pixel
          if (maxVal <= 30) {
            // Check if touching alpha == 0
            const hasTransparentNeighbor =
              (x > 0 && outData[(y * width + (x - 1)) * 4 + 3] === 0) ||
              (x < width - 1 && outData[(y * width + (x + 1)) * 4 + 3] === 0) ||
              (y > 0 && outData[((y - 1) * width + x) * 4 + 3] === 0) ||
              (y < height - 1 && outData[((y + 1) * width + x) * 4 + 3] === 0);

            if (hasTransparentNeighbor) {
              toClear.push(idx + 3);
            }
          }
        }
      }
    }
    for (const alphaIdx of toClear) {
      outData[alphaIdx] = 0;
    }
  }

  // 2. Smooth alpha feathering on the fresh boundary
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      if (outData[idx + 3] > 0) {
        let zeroCount = 0;
        if (outData[((y - 1) * width + x) * 4 + 3] === 0) zeroCount++;
        if (outData[((y + 1) * width + x) * 4 + 3] === 0) zeroCount++;
        if (outData[(y * width + (x - 1)) * 4 + 3] === 0) zeroCount++;
        if (outData[(y * width + (x + 1)) * 4 + 3] === 0) zeroCount++;

        if (zeroCount >= 2) {
          outData[idx + 3] = 160;
        } else if (zeroCount === 1) {
          outData[idx + 3] = 220;
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

  console.log(`Saved defringed cutout with zero black lines to ${outPath}`);
}

main().catch(console.error);
