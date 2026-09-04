import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/profile.jpeg');
  const metadata = await image.metadata();
  console.log('Metadata:', metadata);

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  function getPixel(x, y) {
    const idx = (y * width + x) * channels;
    return [data[idx], data[idx+1], data[idx+2]];
  }

  console.log('Top-Left (10, 10):', getPixel(10, 10));
  console.log('Top-Right (width-10, 10):', getPixel(width - 10, 10));
  console.log('Mid-Left (10, height/2):', getPixel(10, Math.floor(height/2)));
  console.log('Mid-Right (width-10, height/2):', getPixel(width - 10, Math.floor(height/2)));
}

main().catch(console.error);
