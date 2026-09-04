import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  function isAchromaticBg(r, g, b) {
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;

    // Dark neutral bg
    if (maxVal <= 30) return true;
    // Dark wireframe
    if (maxVal <= 65 && diff <= 12) return true;
    return false;
  }

  for (let y = 70; y <= 1250; y += 30) {
    // Scan from left to center (x=600)
    let leftX = -1;
    for (let x = 0; x < 600; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (!isAchromaticBg(r, g, b)) {
        leftX = x;
        break;
      }
    }

    // Scan from right (width-1) to center (x=600)
    let rightX = -1;
    for (let x = width - 1; x >= 600; x--) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (!isAchromaticBg(r, g, b)) {
        rightX = x;
        break;
      }
    }

    console.log(`y=${y.toString().padStart(4)}: leftX=${leftX.toString().padStart(4)}, rightX=${rightX.toString().padStart(4)} | span=${rightX - leftX}`);
  }
}

main().catch(console.error);
