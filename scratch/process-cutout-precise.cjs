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
<head><title>Precise Cutout Processor</title></head>
<body>
<h1>Processing Precise Cutout...</h1>
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

  // Draw smooth path around Shubham's silhouette
  // Points:
  // (x, y) coordinates along hair top, left hair, left ear, left neck, left shoulder,
  // bottom edge, right shoulder, right neck, right ear, right hair, hair top
  const path = new Path2D();
  path.moveTo(430, 80);
  path.bezierCurveTo(490, 68, 710, 68, 770, 85);
  path.bezierCurveTo(830, 110, 865, 175, 865, 270);
  path.bezierCurveTo(865, 330, 885, 370, 875, 450); // right ear
  path.bezierCurveTo(865, 520, 835, 560, 805, 595); // right jaw/neck
  path.bezierCurveTo(830, 615, 870, 640, 920, 675); // right shoulder start
  path.bezierCurveTo(1020, 750, 1120, 890, 1175, 1050); // right shoulder mid
  path.bezierCurveTo(1205, 1140, 1220, 1210, 1220, 1254); // right bottom
  path.lineTo(30, 1254); // bottom line
  path.bezierCurveTo(30, 1210, 45, 1140, 75, 1050); // left bottom
  path.bezierCurveTo(130, 890, 230, 750, 330, 675); // left shoulder mid
  path.bezierCurveTo(380, 640, 420, 615, 445, 595); // left shoulder start
  path.bezierCurveTo(415, 560, 385, 520, 375, 450); // left jaw/neck
  path.bezierCurveTo(365, 370, 385, 330, 385, 270); // left ear
  path.bezierCurveTo(385, 175, 420, 110, 430, 80); // left hair
  path.closePath();

  // Clip directly to the smooth natural silhouette of Shubham Kumar!
  ctx.save();
  ctx.clip(path);
  // Draw the 100% UNTOUCHED, ORIGINAL full-quality photo inside the silhouette!
  ctx.drawImage(img, 0, 0, w, h);
  ctx.restore();

  const pngDataUrl = canvas.toDataURL('image/png');
  await fetch('http://localhost:4500/save-cutout', {
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

server.listen(4500, () => {
  console.log('Precise Cutout server on 4500');
});
