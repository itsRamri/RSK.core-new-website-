import sharp from 'sharp';

async function main() {
  const orig = sharp('public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg');
  const cutout = sharp('public/ezgif-476a1f2348609364-jpg/shubham-cutout.png');

  const metaCutout = await cutout.metadata();
  const { width, height } = metaCutout;
  const { data: cutoutData } = await cutout.raw().toBuffer({ resolveWithObject: true });

  // Scale original to match cutout dimensions exactly: 1016x1168
  const origResized = await orig.resize(width, height, { fit: 'cover' }).raw().toBuffer({ resolveWithObject: true });
  const origData = origResized.data;

  // Replace region (x: 860..980, y: 820..940) with authentic fabric pixels from origData
  for (let y = 800; y < 960; y++) {
    for (let x = 860; x < 985; x++) {
      const idx = (y * width + x);
      const cIdx = idx * 4;
      const oIdx = idx * 3;

      if (cutoutData[cIdx + 3] > 0) {
        cutoutData[cIdx] = origData[oIdx];
        cutoutData[cIdx + 1] = origData[oIdx + 1];
        cutoutData[cIdx + 2] = origData[oIdx + 2];
      }
    }
  }

  const outPath = 'public/ezgif-476a1f2348609364-jpg/shubham-cutout.png';
  await sharp(cutoutData, {
    raw: { width, height, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

  console.log(`Saved completely clean, natural fabric texture to ${outPath}`);
}

main().catch(console.error);
