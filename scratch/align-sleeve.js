import sharp from 'sharp';

async function main() {
  const orig = sharp('public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg');
  const cutout = sharp('public/ezgif-476a1f2348609364-jpg/shubham-cutout.png');

  const { data: origData, info: origInfo } = await orig.raw().toBuffer({ resolveWithObject: true });
  const { data: cutoutData, info: cutoutInfo } = await cutout.raw().toBuffer({ resolveWithObject: true });

  const cW = cutoutInfo.width;
  const cH = cutoutInfo.height;
  const oW = origInfo.width;

  // Exact alignment offset from shubham profile.jpeg (1254x1254) to cutout (1016x1168):
  // Let's sample the right sleeve at (x, y) in cutout:
  // in orig: ox = x + 138, oy = y + 78
  const dx = 138;
  const dy = 78;

  for (let y = 680; y < cH; y++) {
    for (let x = 840; x < cW; x++) {
      const cIdx = (y * cW + x) * 4;
      const ox = x + dx;
      const oy = y + dy;

      if (ox >= 0 && ox < oW && oy >= 0 && oy < origInfo.height) {
        const oIdx = (oy * oW + ox) * 3;
        const oR = origData[oIdx], oG = origData[oIdx+1], oB = origData[oIdx+2];

        // If it's shirt fabric (not dark bg)
        if (oR > 50 || oG > 50 || oB > 50) {
          if (cutoutData[cIdx + 3] > 0) {
            cutoutData[cIdx] = oR;
            cutoutData[cIdx + 1] = oG;
            cutoutData[cIdx + 2] = oB;
          }
        }
      }
    }
  }

  const outPath = 'public/ezgif-476a1f2348609364-jpg/shubham-cutout.png';
  await sharp(cutoutData, {
    raw: { width: cW, height: cH, channels: 4 }
  })
  .png({ compressionLevel: 9 })
  .toFile(outPath);

  console.log(`Saved pixel-perfect alignment cutout to ${outPath}`);
}

main().catch(console.error);
