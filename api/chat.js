// System Instructions to guide the AI responder
const SYSTEM_INSTRUCTION = `You are ResQ Assistant, an empathetic and reliable AI disaster response guide. 
Answer concisely (maximum 3-4 sentences) and prioritize safety. 
Provide clear, actionable safety instructions (Do's and Don'ts) based on standard crisis management protocols. 
If asked about active alerts, explain that you are monitoring NDMA SACHET live warnings. 
If the user's query is in a regional Indian language (like Hindi, Tamil, Telugu, etc.), reply in the same language.`;

export default async function handler(req, res) {
  // Read API key dynamically (fixes ESM import order timing)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse input
  const { message, history } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Message query parameter is required' });
  }

  // If Gemini API Key is missing, run simulated AI responder
  if (!GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not defined. Running in AI Simulation mode.");
    const simulatedResponse = getSimulatedResponse(message);
    return res.status(200).json({
      text: simulatedResponse,
      mode: 'simulation'
    });
  }

  try {
    // Construct request contents array from conversation history
    const contents = [];
    if (Array.isArray(history)) {
      history.forEach(turn => {
        contents.push({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.content }]
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am currently having trouble formulating a response. Please stay safe.";
    
    return res.status(200).json({
      text: aiText,
      mode: 'live'
    });

  } catch (error) {
    console.error("Gemini Chat Handler Error:", error.message);
    // Graceful fallback to simulation if live model fails
    const simulatedResponse = getSimulatedResponse(message);
    return res.status(200).json({
      text: `${simulatedResponse} (Note: Gemini API is temporarily unavailable, running fallback engine)`,
      mode: 'fallback'
    });
  }
}

// Simple rule-based chatbot simulator (fallback and offline-capable)
function getSimulatedResponse(query) {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('flood') || queryLower.includes('rain') || queryLower.includes('water')) {
    return "FLOOD ALERT: 1. Move to higher ground immediately. 2. Disconnect all electrical appliances to avoid shocks. 3. Avoid walking or driving through moving water. Listen to official announcements for details.";
  }
  if (queryLower.includes('cyclone') || queryLower.includes('storm') || queryLower.includes('wind')) {
    return "CYCLONE WARNING: 1. Stay indoors and away from glass windows. 2. Ensure your emergency kit (torch, dry food, water) is packed. 3. Keep devices fully charged and do not venture out to sea.";
  }
  if (queryLower.includes('earthquake') || queryLower.includes('quake') || queryLower.includes('shake')) {
    return "EARTHQUAKE PROTOCOL: 1. Drop, Cover, and Hold On under heavy furniture. 2. If outdoors, move to an open space away from trees, buildings, and power lines. 3. Do not use elevators.";
  }
  if (queryLower.includes('help') || queryLower.includes('emergency') || queryLower.includes('contact')) {
    return "EMERGENCY CONTACTS: NDMA national control room: +91-11-26701728. Police: 100, Fire: 101, Disaster Management: 108. You can also view details in the 'Emergency Contacts' panel in our dashboard.";
  }
  
  return "I am the ResQ AI Assistant. I am monitoring live NDMA SACHET warnings. Please share if you have questions about specific weather alerts (like cyclones, floods, or earthquakes) or need safety survival guides.";
}
