const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const PORT = 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.glb': 'model/gltf-binary',
  '.usdz': 'model/vnd.usdz+zip',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.sql': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(function(req, res) {
  var url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  var fp = path.join(DIR, url);
  if (!fp.startsWith(DIR)) { res.writeHead(403); res.end(); return; }
  fs.readFile(fp, function(err, data) {
    if (err) { res.writeHead(404, {'Content-Type': 'text/html'}); res.end('<h1>404</h1>'); return; }
    var ext = path.extname(fp).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', function() {
  console.log('');
  console.log('  ========================================');
  console.log('    LA TRIBU - Server running');
  console.log('  ========================================');
  console.log('');
  console.log('  Local:   http://localhost:' + PORT);
  console.log('');
  console.log('  Desde telefono:');
  console.log('  ipconfig -> buscar Direccion IPv4');
  console.log('  Abrir:   http://TU_IP:' + PORT);
  console.log('');
  console.log('  Ctrl+C para detener');
  console.log('  ========================================');
});
