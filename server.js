/**
 * Agastya Care Demo - Production & Local Web Server
 * Compatible with Node.js standard library and Vercel Serverless Function (@vercel/node)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8'
};

function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  const parsedUrl = url.parse(req.url);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize root path to index.html
  if (pathname === '/' || pathname === '' || pathname === '/index') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  // If exact file exists (e.g. assets or index.html), serve it
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const content = fs.readFileSync(filePath);

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': content.length,
        'Cache-Control': ext === '.html' ? 'public, max-age=0, must-revalidate' : 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
      return;
    }
  } catch (err) {
    // Continue to index.html fallback
  }

  // Fallback to index.html for clean URL routing
  const indexPath = path.join(__dirname, 'index.html');
  try {
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath);
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=UTF-8',
        'Content-Length': content.length,
        'Cache-Control': 'public, max-age=0, must-revalidate'
      });
      res.end(content);
      return;
    }
  } catch (err) {
    // Continue to 404
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('404 Not Found');
}

const server = http.createServer(handler);

if (require.main === module) {
  const PORT = parseInt(process.env.PORT, 10) || 3000;
  server.listen(PORT, () => {
    console.log(`🏥 Agastya Care Server running at http://localhost:${PORT}`);
  });
}

module.exports = server;
