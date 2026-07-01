import http from 'http';
import alertsHandler from './api/alerts.js';
import alertsTextHandler from './api/alerts-text.js';
import chatHandler from './api/chat.js';
import riskHandler from './api/risk.js';

// Load local .env file variables automatically (Node.js 20.6+)
if (process.loadEnvFile) {
    try {
        process.loadEnvFile();
    } catch (e) {
        // Safe to ignore if .env file is missing or unreadable
    }
}

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // Enable CORS for local testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Polyfill Vercel Response Helpers
    res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
    };
    
    res.json = (data) => {
        res.setHeader('Content-Type', 'application/json;charset=utf-8');
        res.end(JSON.stringify(data));
        return res;
    };

    res.send = (body) => {
        res.end(body);
        return res;
    };

    // Parse URL query parameters
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    req.query = Object.fromEntries(urlObj.searchParams);

    // Parse JSON body for POST requests
    req.body = {};
    if (req.method === 'POST') {
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        try {
            if (data) {
                req.body = JSON.parse(data);
            }
        } catch (e) {
            console.warn("Failed to parse JSON body:", e.message);
        }
    }
    
    // Simple router
    const pathname = urlObj.pathname;
    if (pathname === '/api/alerts') {
        await alertsHandler(req, res);
    } else if (pathname === '/api/alerts-text') {
        await alertsTextHandler(req, res);
    } else if (pathname === '/api/chat') {
        await chatHandler(req, res);
    } else if (pathname === '/api/risk') {
        await riskHandler(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found. Try /api/alerts, /api/alerts-text, /api/chat, or /api/risk');
    }
});

server.listen(PORT, () => {
    console.log(`\n✅ Local API Server running at:`);
    console.log(`   - JSON Alerts: http://localhost:${PORT}/api/alerts`);
    console.log(`   - Text Alerts: http://localhost:${PORT}/api/alerts-text`);
    console.log(`   - AI Chat: http://localhost:${PORT}/api/chat`);
    console.log(`   - AI Risk: http://localhost:${PORT}/api/risk`);
    console.log("   (This mimics how Vercel will run your API in production)\n");
});

