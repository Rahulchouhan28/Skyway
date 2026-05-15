const http = require('http');
const fs = require('fs');
const path = require('path');

// ── Load .env ──────────────────────────────────────────────
const envPath = path.join(__dirname, '.env');
const env = {};
try {
    const raw = fs.readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
    }
    console.log('  ✅ Loaded .env file');
} catch {
    console.log('  ℹ️ No .env file found, using defaults');
}

const PORT = env.PORT ?? process.env.PORT ?? 3000;

// ── MIME types ─────────────────────────────────────────────
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

// ── Server ─────────────────────────────────────────────────
const server = http.createServer((req, res) => {

    // API endpoint: serve env config (keys + endpoints + settings)
    if (req.url === '/api/config') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            SKYSCANNER_API_KEY: env.SKYSCANNER_API_KEY ?? '',
            AMADEUS_API_KEY: env.AMADEUS_API_KEY ?? '',
            AMADEUS_API_SECRET: env.AMADEUS_API_SECRET ?? '',
            AVIATIONSTACK_API_KEY: env.AVIATIONSTACK_API_KEY ?? '',
            SKYSCANNER_API_URL: env.SKYSCANNER_API_URL ?? '',
            AMADEUS_API_URL: env.AMADEUS_API_URL ?? '',
            AVIATIONSTACK_API_URL: env.AVIATIONSTACK_API_URL ?? '',
            DEFAULT_CURRENCY: env.DEFAULT_CURRENCY ?? 'INR',
            DEFAULT_MARKET: env.DEFAULT_MARKET ?? 'IN',
            DEFAULT_LOCALE: env.DEFAULT_LOCALE ?? 'en-IN',
            MAX_RESULTS: parseInt(env.MAX_RESULTS ?? '50', 10),
        }));
        return;
    }

    // Static file serving
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'index.html'), (err2, fallback) => {
                    if (err2) {
                        res.writeHead(500);
                        res.end('Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(fallback);
                });
            } else {
                res.writeHead(500);
                res.end('Server Error');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n  ✈️  SkyWay server running at http://localhost:${PORT}\n`);
});
