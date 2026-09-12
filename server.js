const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxPhkGewboGcaVVohzjNTceULhOel6WzNpX1zjHWcCcD_ZzMrKtZIqoZBdOQHb4NgbR/exec';
const ROOT = __dirname;

function send(res, status, type, body) {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(body);
}

async function readBody(req) {
  return await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
      if (data.length > 2_000_000) {
        reject(new Error('Request quá lớn.'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function proxyToAppsScript(payload) {
  const r = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'follow',
  });

  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (_) {
    throw new Error(`Apps Script không trả JSON hợp lệ (HTTP ${r.status}).`);
  }

  return data;
}

function serveIndex(res) {
  const file = path.join(ROOT, 'index.html');
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 500, 'text/plain; charset=utf-8', err.message);
    send(res, 200, 'text/html; charset=utf-8', data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      return res.end();
    }

    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
      return serveIndex(res);
    }

    if (req.method === 'POST' && req.url === '/api/apps-script') {
      const raw = await readBody(req);
      let payload;
      try { payload = JSON.parse(raw || '{}'); }
      catch (_) { return send(res, 400, 'application/json; charset=utf-8', JSON.stringify({success:false,message:'JSON không hợp lệ.'})); }

      const data = await proxyToAppsScript(payload);
      return send(res, 200, 'application/json; charset=utf-8', JSON.stringify(data));
    }

    if (req.method === 'GET' && req.url === '/health') {
      return send(res, 200, 'application/json; charset=utf-8', JSON.stringify({ok:true,port:PORT}));
    }

    return send(res, 404, 'text/plain; charset=utf-8', 'Not found');
  } catch (error) {
    return send(res, 500, 'application/json; charset=utf-8', JSON.stringify({success:false,message:error.message}));
  }
});

server.listen(PORT, () => {
  console.log(`RITECCONS đang chạy tại http://localhost:${PORT}`);
  console.log(`Apps Script: ${APPS_SCRIPT_URL}`);
});
