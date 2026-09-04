import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's create an RGBA output buffer
  const outData = Buffer.alloc(width * height * 4);

  // We can trace the exact boundary of the person
  // Head center: x ~ 627, y from ~100 to ~650
  // Neck: y ~ 650 to 750
  // Torso / Shirt: y ~ 750 to 1253
  
  // Let's inspect vertical scanline at x=627:
  // Top of hair starts where brightness / color changes from dark bg to hair
  // In shubham profile.jpeg, hair starts around y=90
  
  // Let's print out the exact scanlines around the hair, ears, shoulders
  for (let y = 80; y <= 750; y += 50) {
    let rowVals = [];
    for (let x = 300; x <= 950; x += 30) {
      const idx = (y * width + x) * channels;
      rowVals.push(`(${x}:${data[idx]},${data[idx+1]},${data[idx+2]})`);
    }
    console.log(`y=${y}:`, rowVals.slice(0, 5).join(' '), '...', rowVals.slice(-5).join(' '));
  }
}

main().catch(console.error);
