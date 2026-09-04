import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log(`Image: ${width}x${height}, channels: ${channels}`);

  // Let's find background max brightness in outer margin (e.g. top 50px, left 50px, right 50px)
  let maxBgR = 0, maxBgG = 0, maxBgB = 0;
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 200; x++) {
      const idx = (y * width + x) * channels;
      maxBgR = Math.max(maxBgR, data[idx]);
      maxBgG = Math.max(maxBgG, data[idx+1]);
      maxBgB = Math.max(maxBgB, data[idx+2]);
    }
  }
  console.log(`Top-left 200x100 max: [${maxBgR}, ${maxBgG}, ${maxBgB}]`);

  // Top-right 200x100
  let trMaxR = 0, trMaxG = 0, trMaxB = 0;
  for (let y = 0; y < 100; y++) {
    for (let x = width - 200; x < width; x++) {
      const idx = (y * width + x) * channels;
      trMaxR = Math.max(trMaxR, data[idx]);
      trMaxG = Math.max(trMaxG, data[idx+1]);
      trMaxB = Math.max(trMaxB, data[idx+2]);
    }
  }
  console.log(`Top-right 200x100 max: [${trMaxR}, ${trMaxG}, ${trMaxB}]`);

  // Check head boundaries:
  // Let's find where the head top starts (scanning from y=0 downwards at center x=627)
  for (let y = 0; y < height; y++) {
    const idx = (y * width + 627) * channels;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    if (r > 45 || g > 45 || b > 45) {
      console.log(`Head top at y=${y}: [${r}, ${g}, ${b}]`);
      break;
    }
  }

  // Check left and right shoulders at y = 800, 900, 1000
  for (const testY of [700, 800, 900, 1000, 1100, 1200]) {
    let leftX = 0, rightX = width - 1;
    for (let x = 0; x < width; x++) {
      const idx = (testY * width + x) * channels;
      if (data[idx] > 50 || data[idx+1] > 50 || data[idx+2] > 50) {
        leftX = x;
        break;
      }
    }
    for (let x = width - 1; x >= 0; x--) {
      const idx = (testY * width + x) * channels;
      if (data[idx] > 50 || data[idx+1] > 50 || data[idx+2] > 50) {
        rightX = x;
        break;
      }
    }
    console.log(`y=${testY}: leftX=${leftX}, rightX=${rightX}, widthSpan=${rightX - leftX}`);
  }
}

main().catch(console.error);
