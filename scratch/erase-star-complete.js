import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/shubham-cutout.png');
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });

  // Let's find the star: The star has whitish pixels on a grey sleeve
  // In the area x: 880..1010, y: 950..1160:
  // Let's print out the exact rectangle:
  for (let y = 950; y < 1160; y++) {
    for (let x = 880; x < 1010; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      // Star pixels have brighter intensity than surrounding fabric (which is ~170..200)
      if (r > 215 && g > 215 && b > 215) {
        // Replace with sleeve pixel from (x - 70, y)
        const srcIdx = (y * width + (x - 70)) * 4;
        data[idx] = data[srcIdx];
        data[idx+1] = data[srcIdx+1];
        data[idx+2] = data[srcIdx+2];
      }
    }
  }

  // Also in region x: 910..975, y: 980..1080, blend smoothly with horizontal lines
  for (let y = 980; y <= 1080; y++) {
    const leftX = 905, rightX = 980;
    const lIdx = (y * width + leftX) * 4;
    const rIdx = (y * width + rightX) * 4;
    const rL = data[lIdx], gL = data[lIdx+1], bL = data[lIdx+2];
    const rR = data[rIdx], gR = data[rIdx+1], bR = data[rIdx+2];

    for (let x = leftX; x <= rightX; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] > 0) {
        const t = (x - leftX) / (rightX - leftX);
        data[idx] = Math.round(rL * (1 - t) + rR * t);
        data[idx+1] = Math.round(gL * (1 - t) + gR * t);
        data[idx+2] = Math.round(bL * (1 - t) + bR * t);
      }
    }
  }

  const outPath = 'public/ezgif-476a1f2348609364-jpg/shubham-cutout.png';
  await sharp(data, {
    raw: { width, height, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

  console.log(`Saved completely star-free cutout to ${outPath}`);
}

main().catch(console.error);
