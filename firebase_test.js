import https from 'https';

const DB_URL = "https://deepsightsih2025-default-rtdb.asia-southeast1.firebasedatabase.app";

const fetchData = (path) => {
  return new Promise((resolve, reject) => {
    https.get(`${DB_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

console.log("🔍 Testing Firebase Access (Native HTTPS)...");

const run = async () => {
    try {
        console.log("1. Fetching Devices...");
        const devices = await fetchData('/devices.json');
        console.log("✅ Devices Data:", devices ? Object.keys(devices) : "No devices found");
    
        if (devices) {
            const firstDev = Object.values(devices)[0];
            console.log("   Sample Device Data:", JSON.stringify(firstDev, null, 2));
        }
    
        console.log("\n2. Fetching Logs...");
        const logs = await fetchData('/logs.json');
        console.log("✅ Logs Data:", logs ? "Logs found" : "No logs found");
    
    } catch (error) {
        console.error("❌ Error fetching data:", error.message);
    }
};

run();
