// Servidor local sem dependências. Execute: node server.cjs
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  let name;
  try { name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400); res.end(); return; }
  const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
  if (!file.startsWith(root + path.sep) || !types[path.extname(file)]) { res.writeHead(404); res.end('Não encontrado'); return; }
  fs.readFile(file, (error, data) => { if (error) { res.writeHead(404); res.end('Não encontrado'); return; } res.writeHead(200, { 'Content-Type': types[path.extname(file)], 'Cache-Control': 'no-store' }); res.end(data); });
}).listen(4173, '127.0.0.1', () => console.log('Cagômetro em http://localhost:4173'));
