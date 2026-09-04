import sharp from 'sharp';
import fs from 'fs';

async function main() {
  const inputPath = 'public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg';
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  console.log(`Image size: ${width}x${height}`);

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  console.log(`Channels: ${info.channels}`);

  // Let's sample corners to understand the background:
  // (0,0), (width-1, 0), (0, 500), (width-1, 500)
  function getPixel(x, y) {
    const idx = (y * width + x) * info.channels;
    return [data[idx], data[idx+1], data[idx+2]];
  }

  console.log('Top-Left (10,10):', getPixel(10, 10));
  console.log('Top-Right (width-10, 10):', getPixel(width - 10, 10));
  console.log('Mid-Left (10, 500):', getPixel(10, 500));
  console.log('Mid-Right (width-10, 500):', getPixel(width - 10, 500));
  console.log('Center Face (512, 400):', getPixel(512, 400));
  console.log('Center Shirt (512, 900):', getPixel(512, 900));
  console.log('Hair Top (512, 100):', getPixel(512, 100));
  console.log('Hair Left (360, 200):', getPixel(360, 200));
  console.log('Hair Right (630, 200):', getPixel(630, 200));
}

main().catch(console.error);
