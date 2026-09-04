const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/save-cutout' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const base64Data = data.image.replace(/^data:image\/png;base64,/, '');
        const outputPath = path.join(__dirname, '../public/ezgif-476a1f2348609364-jpg/shubham-cutout.png');
        fs.writeFileSync(outputPath, Buffer.from(base64Data, 'base64'));
        console.log('Successfully saved cutout PNG to:', outputPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, path: outputPath }));
      } catch (err) {
        console.error('Error saving image:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.url === '/test-page' && req.method === 'GET') {
    const html = `
<!DOCTYPE html>
<html>
<head><title>Cutout Processor</title></head>
<body>
<h1>Processing Cutout...</h1>
<canvas id="c"></canvas>
<script>
async function process() {
  const img = new Image();
  img.src = '/ezgif-476a1f2348609364-jpg/shubham%20profile.jpeg';
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.getElementById('c');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;

  // Segment Shubham Kumar:
  // Background: dark backdrop with wireframes and top-left dots.
  // The silhouette of Shubham:
  // - Hair/Head top starts around y: 70, x: 340 to 860.
  // - Below y: 70, everything is background.
  // - Outside x: 300..890 for y < 580 (head) is background.
  // - Left shoulder extends to x: 100 at y: 1200.
  // - Right shoulder extends to x: 1150 at y: 1200.

  // High precision segmentation:
  // Check if pixel belongs to subject (skin, white shirt, lanyard, hair with cyan/warm rim)
  const isSubject = (x, y) => {
    // Anything above y = 60 is background (above hair)
    if (y < 65) return false;
    // Top-left area (where the dots are)
    if (x < 320 && y < 620) return false;
    // Top-right area (wireframe boxes)
    if (x > 880 && y < 620) return false;

    const idx = (y * w + x) * 4;
    const r = d[idx];
    const g = d[idx + 1];
    const b = d[idx + 2];

    const luma = 0.299 * r + 0.587 * g + 0.114 * b;

    // Background is generally dark luma < 45, or wireframe line/dots
    // White shirt: very high luma
    const isShirt = (r > 120 && g > 120 && b > 120) || (r + g + b > 360);
    if (isShirt) return true;

    // Skin tones
    const isSkin = r > 85 && g > 50 && b > 30 && r > b + 8 && (r > g);
    if (isSkin) return true;

    // Lanyard (blue)
    const isLanyard = b > 80 && b > r + 15;
    if (isLanyard) return true;

    // Cyan rim on left hair / ear
    const isCyanRim = b > 45 && g > 35 && b > r + 10;
    if (isCyanRim && x < 600) return true;

    // Warm rim on right hair / ear
    const isWarmRim = r > 55 && g > 30 && r > b + 20;
    if (isWarmRim && x > 600) return true;

    // Hair core (inside head boundary)
    if (x >= 340 && x <= 860 && y >= 65 && y <= 350) {
      if (luma > 8) return true;
    }

    // Inside body torso (shirt interior)
    if (y >= 620 && x >= 140 && x <= 1120) {
      if (luma > 30) return true;
    }

    return false;
  };

  // Build mask
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      mask[y * w + x] = isSubject(x, y) ? 1 : 0;
    }
  }

  // Morphological cleanup: remove small isolated noise outside body
  // Fill small holes inside hair/skin
  const cleanedMask = new Uint8Array(w * h);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          count += mask[(y + dy) * w + (x + dx)];
        }
      }
      cleanedMask[y * w + x] = count >= 4 ? 1 : 0;
    }
  }

  // Feather edges (2px)
  const alpha = new Float32Array(w * h);
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      let sum = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          sum += cleanedMask[(y + dy) * w + (x + dx)];
        }
      }
      alpha[y * w + x] = sum / 25;
    }
  }

  // Apply alpha to d
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const a = alpha[y * w + x];
      d[idx + 3] = Math.round(255 * a);
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const pngDataUrl = canvas.toDataURL('image/png');
  await fetch('http://localhost:4499/save-cutout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: pngDataUrl })
  });

  document.body.innerHTML += '<h2>DONE!</h2>';
}
process().catch(e => {
  document.body.innerHTML += '<h2 style="color:red">' + e.message + '</h2>';
});
</script>
</body>
</html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // Serve static files for ezgif folder
  if (req.url.startsWith('/ezgif-476a1f2348609364-jpg/')) {
    const filePath = path.join(__dirname, '../public', decodeURIComponent(req.url));
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(4499, () => {
  console.log('Cutout processor server listening on port 4499');
});
