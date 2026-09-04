import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/profile.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  function isAchromaticBg(r, g, b) {
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const diff = maxVal - minVal;

    // Background in profile.jpeg is [210..216, 210..216, 210..216]
    if (r >= 195 && r <= 230 && g >= 195 && g <= 230 && b >= 195 && b <= 230 && diff <= 6) {
      return true;
    }
    return false;
  }

  for (let y = 60; y <= 1020; y += 30) {
    let leftX = -1;
    for (let x = 0; x < 500; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (!isAchromaticBg(r, g, b)) {
        leftX = x;
        break;
      }
    }

    let rightX = -1;
    for (let x = width - 1; x >= 500; x--) {
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
