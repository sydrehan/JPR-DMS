import handler from './api/alerts-text.js';

// Mock Response Object
const res = {
    status: (code) => {
        console.log(`[Response Status]: ${code}`);
        return res; 
    },
    send: (body) => {
        console.log("\n--- API OUTPUT START ---");
        console.log(body);
        console.log("--- API OUTPUT END ---\n");
    }
};

const req = {};

console.log("🧪 Testing API Function Locally...");
handler(req, res);
