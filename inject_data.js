import https from 'https';

const DB_URL = "https://deepsightsih2025-default-rtdb.asia-southeast1.firebasedatabase.app";

// Helper to send PUT/POST request using native node https
const sendRequest = (path, method, body) => {
    return new Promise((resolve, reject) => {
        const url = new URL(`${DB_URL}${path}`);
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(body))
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', reject);
        req.write(JSON.stringify(body));
        req.end();
    });
};

const injectManualData = async () => {
    console.log("💉 Injecting Manual Data...");

    // 1. Update a Device Status (Simulate Manual Overlay)
    const deviceId = "MANUAL_OVERRIDE_NODE";
    const deviceData = {
        status: "SAFE",
        battery: 100,
        lat: 28.6139,
        lng: 77.2090,
        lastSeen: Date.now(),
        type: "MANUAL_ENTRY"
    };

    console.log(`\n1. Creating/Updating Device: ${deviceId}...`);
    await sendRequest(`/devices/${deviceId}.json`, 'PUT', deviceData);
    console.log("✅ Device Updated!");

    // 2. Add a Critical Log (Simulate Reporting an Incident)
    const logId = `manual_log_${Date.now()}`;
    const logData = {
        message: "Manual Safety Check Completed by Admin",
        severity: "low",
        timestamp: Date.now(),
        type: "ADMIN_LOG",
        sender: "Admin Console"
    };

    console.log(`\n2. Pushing new log: ${logId}...`);
    // Using PUT to set a specific ID, or POST to push new
    await sendRequest(`/logs/manual/${logId}.json`, 'PUT', logData); 
    console.log("✅ Log Added!");
};

injectManualData().catch(console.error);
