// Vercel Serverless Function to serve alerts as plain text
// Reuses alerts.js to fetch and normalize NDMA alerts, formatting them as plain text

import alertsHandler from './alerts.js';

export default async function handler(req, res) {
  try {
    let statusCode = 200;
    let responseData = null;

    // Create a mock response object to capture the JSON output of alertsHandler
    const mockRes = {
      setHeader: () => {},
      status: (code) => {
        statusCode = code;
        return mockRes;
      },
      json: (data) => {
        responseData = data;
        return mockRes;
      }
    };

    // Invoke alertsHandler
    await alertsHandler(req, mockRes);

    if (statusCode !== 200 || !Array.isArray(responseData)) {
      throw new Error(`Failed to retrieve alerts from primary endpoint. Status: ${statusCode}`);
    }

    // Format as Plain Text
    let textOutput = "=== SIH DISASTER ALERT SYSTEM ===\n";
    textOutput += `Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n\n`;

    if (responseData.length === 0) {
      textOutput += "NO ACTIVE DISASTER ALERTS IN INDIA REGION.\n";
    } else {
      responseData.forEach((alert) => {
        textOutput += `[${alert.severity.toUpperCase()}] ${alert.title}\n`;
        textOutput += `Details: ${alert.description}\n`;
        textOutput += `Source: ${alert.source}\n`;
        textOutput += `Link: ${alert.link}\n`;
        textOutput += "--------------------------------\n";
      });
    }

    // Return Plain Text Response
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(textOutput);

  } catch (error) {
    console.error("API Text Error:", error);
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.status(500).send(`Error fetching alerts: ${error.message}`);
  }
}
