import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/profile 2.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's inspect coordinates near (x: 930..980, y: 950..1050)
  for (let y = 950; y < 1050; y += 10) {
    for (let x = 900; x < 990; x += 10) {
      const idx = (y * width + x) * channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      if (Math.abs(r - g) <= 3 && Math.abs(g - b) <= 3 && r > 100 && r < 200) {
        console.log(`Watermark candidate at (${x}, ${y}): [${r}, ${g}, ${b}]`);
      }
    }
  }
}

main().catch(console.error);
