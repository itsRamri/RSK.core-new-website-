import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>BG Removal</title>
</head>
<body style="font-family: sans-serif; padding: 20px; background: #222; color: #fff;">
  <h2>Processing Shubham Profile Cutout...</h2>
  <div id="status" style="font-size: 1.2rem; margin: 15px 0;">Initializing...</div>
  <canvas id="out" style="max-width: 400px; background: repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px;"></canvas>

  <script type="module">
    import { removeBackground } from 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.5.7/+esm';

    async function run() {
      const status = document.getElementById('status');
      try {
        status.innerText = 'Loading AI model & processing image...';
        
        const config = {
          publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.5.7/dist/',
          progress: (key, current, total) => {
            status.innerText = 'Model: ' + key + ' (' + Math.round((current / (total || 1)) * 100) + '%)';
          }
        };

        const blob = await removeBackground('/image', config);

        status.innerText = 'Converting output...';
        const url = URL.createObjectURL(blob);
        const outImg = new Image();
        outImg.src = url;
        await new Promise(r => outImg.onload = r);

        const canvas = document.getElementById('out');
        canvas.width = outImg.naturalWidth;
        canvas.height = outImg.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(outImg, 0, 0);

        const base64Data = canvas.toDataURL('image/png');

        status.innerText = 'Saving to public directory...';
        const resp = await fetch('/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Data })
        });
        const resData = await resp.json();
        status.innerText = 'SUCCESS! Perfect cutout saved to public/ezgif-476a1f2348609364-jpg/shubham-cutout.png';
      } catch (err) {
        status.innerText = 'Error: ' + err.message;
        console.error(err);
      }
    }
    run();
  </script>
</body>
</html>
    `);
    return;
  }

  if (req.url === '/image') {
    const imgBuf = fs.readFileSync('public/ezgif-476a1f2348609364-jpg/shubham profile.jpeg');
    res.writeHead(200, { 'Content-Type': 'image/jpeg' });
    res.end(imgBuf);
    return;
  }

  if (req.url === '/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { image } = JSON.parse(body);
      const base64 = image.replace(/^data:image\/png;base64,/, '');
      const buf = Buffer.from(base64, 'base64');
      fs.writeFileSync('public/ezgif-476a1f2348609364-jpg/shubham-cutout.png', buf);
      console.log('Saved cutout PNG successfully! Size:', buf.length);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
      setTimeout(() => process.exit(0), 1000);
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(4829, () => {
  console.log('Background remover server listening on http://localhost:4829');
});
