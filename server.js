import http from 'http';
import alertsHandler from './api/alerts.js';
import alertsTextHandler from './api/alerts-text.js';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    // Enable CORS for local testing
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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
    
    // Simple router
    if (req.url === '/api/alerts') {
        await alertsHandler(req, res);
    } else if (req.url === '/api/alerts-text') {
        await alertsTextHandler(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found. Try /api/alerts or /api/alerts-text');
    }
});

server.listen(PORT, () => {
    console.log(`\n✅ Local API Server running at:`);
    console.log(`   - JSON Alerts: http://localhost:${PORT}/api/alerts`);
    console.log(`   - Text Alerts: http://localhost:${PORT}/api/alerts-text`);
    console.log("   (This mimics how Vercel will run your API in production)\n");
});
