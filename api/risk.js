// Vercel Serverless Function to calculate localized AI Risk & Safety Score
import alertsHandler from './alerts.js';

// Haversine formula to compute distance in km between two points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default async function handler(req, res) {
  // Read API key dynamically (fixes ESM import order timing)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { lat, lng } = req.query || {};

  if (!lat || !lng) {
    return res.status(400).json({ error: "lat and lng query parameters are required" });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);

  if (isNaN(userLat) || isNaN(userLng)) {
    return res.status(400).json({ error: "Invalid coordinates format" });
  }

  try {
    // 1. Fetch live normalized alerts from alerts.js
    let statusCode = 200;
    let alerts = [];
    const mockRes = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return mockRes; },
      json: (data) => { alerts = data; return mockRes; }
    };
    await alertsHandler(req, mockRes);

    if (statusCode !== 200 || !Array.isArray(alerts)) {
      throw new Error(`Failed to fetch alerts from primary provider. Status: ${statusCode}`);
    }

    // 2. Calculate distance to each alert and find the closest one
    let nearestAlert = null;
    let minDistance = Infinity;

    alerts.forEach(alert => {
      const dist = getDistance(userLat, userLng, alert.lat, alert.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearestAlert = alert;
      }
    });

    // 3. Compute deterministic Safety Score
    let safetyScore = 100;
    let dangerLevel = "safe";

    if (minDistance <= 25) {
      safetyScore = nearestAlert.severity === 'critical' ? 25 : nearestAlert.severity === 'high' ? 45 : 65;
      dangerLevel = "danger";
    } else if (minDistance <= 75) {
      safetyScore = nearestAlert.severity === 'critical' ? 55 : nearestAlert.severity === 'high' ? 70 : 80;
      dangerLevel = "warning";
    } else if (minDistance <= 150) {
      safetyScore = 90;
      dangerLevel = "alert";
    }

    // 4. Generate AI Risk commentary
    let aiCommentary = "";

    if (!GEMINI_API_KEY) {
      // Local rule-based fallback
      if (nearestAlert) {
        aiCommentary = `Rule-Based Fallback: Nearest disaster alert is ${nearestAlert.title} located ${Math.round(minDistance)}km away. Status: ${dangerLevel.toUpperCase()}. Keep safety guides handy.`;
      } else {
        aiCommentary = "Rule-Based Fallback: No active disaster alerts detected within the regional bounds. Your location is safe.";
      }
      return res.status(200).json({
        safetyScore,
        dangerLevel,
        minDistance: nearestAlert ? Math.round(minDistance) : null,
        nearestAlertTitle: nearestAlert ? nearestAlert.title : null,
        commentary: aiCommentary,
        mode: 'simulation'
      });
    }

    // Call Gemini API to get intelligent contextual commentary
    const prompt = `You are a disaster risk assessor AI. Analyze this situation:
- User Coordinates: [${userLat}, ${userLng}]
- Nearest Disaster Alert: "${nearestAlert ? nearestAlert.title : 'None'}"
- Disaster Details: "${nearestAlert ? nearestAlert.description : 'N/A'}"
- Severity: "${nearestAlert ? nearestAlert.severity : 'None'}"
- Distance to User: ${nearestAlert ? Math.round(minDistance) : 'N/A'} km.
- Computed Safety Score: ${safetyScore}/100.

Provide a 2-sentence highly professional risk warning and safety advice for the user based on their distance from the danger. Do not use markdown styling.`;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 150, temperature: 0.5 }
      })
    });
    clearTimeout(id);

    if (response.ok) {
      const data = await response.json();
      aiCommentary = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      throw new Error("Gemini request failed");
    }

    return res.status(200).json({
      safetyScore,
      dangerLevel,
      minDistance: nearestAlert ? Math.round(minDistance) : null,
      nearestAlertTitle: nearestAlert ? nearestAlert.title : null,
      commentary: aiCommentary.trim(),
      mode: 'live'
    });

  } catch (error) {
    console.error("Risk score calculation failed:", error.message);
    return res.status(200).json({
      safetyScore: 95,
      dangerLevel: "safe",
      minDistance: null,
      nearestAlertTitle: null,
      commentary: "Unable to calculate dynamic risk score. Monitoring systems are active, please stay alert to local broadcasts.",
      mode: 'fallback'
    });
  }
}
