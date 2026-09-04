import sharp from 'sharp';

async function testFontOutline(fontFamily) {
  const svg = `
    <svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
      <style>
        .outline {
          font-family: ${fontFamily};
          font-size: 100px;
          font-weight: 800;
          fill: none;
          stroke: black;
          stroke-width: 3px;
        }
      </style>
      <text x="50" y="140" class="outline">SHUBHAM</text>
    </svg>
  `;

  const fileName = `scratch/font-test-${fontFamily.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
  await sharp(Buffer.from(svg)).png().toFile(fileName);
  console.log(`Rendered: ${fileName}`);
}

async function main() {
  await testFontOutline('Arial');
  await testFontOutline('Helvetica');
  await testFontOutline('Impact');
  await testFontOutline('Segoe UI');
}

main().catch(console.error);
