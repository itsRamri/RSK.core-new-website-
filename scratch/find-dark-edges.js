import sharp from 'sharp';

async function main() {
  const image = sharp('public/ezgif-476a1f2348609364-jpg/shubham-cutout.png');
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const { data } = await image.raw().toBuffer({ resolveWithObject: true });

  console.log(`Checking boundary pixels for dark lines/edges in ${width}x${height}...`);

  // Scan boundary: for each non-transparent pixel that touches transparency (alpha == 0 neighbor):
  let darkEdgeCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const a = data[idx + 3];

      if (a > 50) {
        // check if boundary pixel (has a neighbor with a == 0)
        let isBoundary = false;
        const neighbors = [
          [x-1, y], [x+1, y], [x, y-1], [x, y+1],
          [x-2, y], [x+2, y], [x, y-2], [x, y+2]
        ];
        for (const [nx, ny] of neighbors) {
          if (nx < 0 || nx >= width || ny < 0 || ny >= height || data[(ny * width + nx) * 4 + 3] === 0) {
            isBoundary = true;
            break;
          }
        }

        if (isBoundary) {
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          // Check if dark fringe/line: max(r,g,b) <= 20
          if (r <= 20 && g <= 20 && b <= 20) {
            darkEdgeCount++;
            if (darkEdgeCount <= 15) {
              console.log(`Dark edge pixel at (${x}, ${y}): RGB=[${r}, ${g}, ${b}], Alpha=${a}`);
            }
          }
        }
      }
    }
  }

  console.log(`Total dark boundary pixels found: ${darkEdgeCount}`);
}

main().catch(console.error);
