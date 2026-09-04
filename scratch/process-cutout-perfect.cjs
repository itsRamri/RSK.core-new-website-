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
        console.log('Successfully saved PRISTINE cutout PNG to:', outputPath);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
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
<head><title>Pristine Cutout</title></head>
<body>
<h1>Processing Pristine Cutout...</h1>
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

  // Clip to general body polygon
  const path = new Path2D();
  path.moveTo(540, 68);
  path.bezierCurveTo(620, 68, 700, 75, 750, 95);
  path.bezierCurveTo(790, 115, 830, 155, 845, 220);
  path.bezierCurveTo(855, 260, 855, 310, 858, 355);
  path.bezierCurveTo(862, 390, 860, 425, 850, 450);
  path.bezierCurveTo(835, 485, 805, 530, 785, 565);
  path.bezierCurveTo(775, 585, 785, 605, 805, 620);
  path.bezierCurveTo(860, 650, 935, 700, 1000, 770);
  path.bezierCurveTo(1065, 845, 1115, 960, 1145, 1100);
  path.bezierCurveTo(1155, 1160, 1160, 1210, 1160, 1254);
  path.lineTo(95, 1254);
  path.bezierCurveTo(95, 1210, 100, 1160, 110, 1100);
  path.bezierCurveTo(135, 960, 185, 845, 250, 770);
  path.bezierCurveTo(315, 700, 390, 650, 445, 620);
  path.bezierCurveTo(465, 605, 475, 585, 465, 565);
  path.bezierCurveTo(445, 530, 415, 485, 400, 450);
  path.bezierCurveTo(388, 425, 388, 390, 392, 355);
  path.bezierCurveTo(395, 310, 395, 260, 405, 220);
  path.bezierCurveTo(420, 155, 460, 115, 500, 95);
  path.bezierCurveTo(515, 80, 530, 70, 540, 68);
  path.closePath();

  ctx.save();
  ctx.clip(path);
  ctx.drawImage(img, 0, 0, w, h);
  ctx.restore();

  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;

  // Scan and clean dark background pixels outside the subject:
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = d[idx];
      const g = d[idx + 1];
      const b = d[idx + 2];
      const a = d[idx + 3];

      if (a === 0) continue;

      const luma = 0.299 * r + 0.587 * g + 0.114 * b;

      // Check if inside the head/face core (never touch face)
      const isFaceCore = (x >= 420 && x <= 820 && y >= 140 && y <= 600);
      if (isFaceCore) continue;

      // Outside shirt / shoulders: white shirt has high luma
      if (y >= 620) {
        if (luma < 60 && r < 75 && g < 75 && b < 75) {
          d[idx + 3] = 0;
        }
      } else {
        // Upper background around hair / neck / ears
        const isCyanRim = b > 45 && b > r + 10;
        const isWarmRim = r > 55 && r > b + 15;
        const isHairCenter = (x >= 430 && x <= 800 && y >= 68 && y <= 300);

        if (!isCyanRim && !isWarmRim && !isHairCenter) {
          if (luma < 40 && r < 45 && g < 45 && b < 45) {
            d[idx + 3] = 0;
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const pngDataUrl = canvas.toDataURL('image/png');
  await fetch('http://localhost:4508/save-cutout', {
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

server.listen(4508, () => {
  console.log('Pristine Cutout server on 4508');
});
