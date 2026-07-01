// Vercel Serverless Function to fetch and normalize NDMA SACHET Live Alerts
const SACHET_API_URL = 'https://sachet.ndma.gov.in/cap_public_website/FetchAllAlertDetails';

// In-Memory Cache (will persist across serverless reuse)
let cache = {
  data: null,
  timestamp: 0
};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

// Safety Guidelines Database
const SAFETY_GUIDELINES = {
  FLOOD: {
    dos: ["Move to higher ground", "Disconnect electrical appliances", "Listen to weather reports"],
    donts: ["Do not walk through moving water", "Do not drive in flooded areas", "Do not touch fallen wires"]
  },
  CYCLONE: {
    dos: ["Stay indoors away from windows", "Keep emergency kit ready", "Charge all devices"],
    donts: ["Do not venture into the sea", "Do not stand under trees/poles", "Do not spread rumors"]
  },
  EARTHQUAKE: {
    dos: ["Drop, Cover, and Hold On", "Move to open ground if outside", "Stay away from glass/windows"],
    donts: ["Do not use elevators", "Do not run outside during shaking", "Do not light matches"]
  },
  DROUGHT: {
    dos: ["Conserve water", "Harvest rainwater", "Reuse gray water"],
    donts: ["Do not waste water", "Do not wash cars unnecessarily"]
  },
  VOLCANO: {
    dos: ["Wear mask/cloth", "Seal windows/doors", "Evacuate if ordered"],
    donts: ["Do not drive in ash fall", "Do not go near the eruption site"]
  },
  OTHER: {
    dos: ["Follow official instructions", "Keep emergency radio on", "Stay calm"],
    donts: ["Do not panic", "Do not ignore sirens"]
  }
};

const getSafetyGuide = (type) => {
  return SAFETY_GUIDELINES[type] || SAFETY_GUIDELINES.OTHER;
};

// Fetch Helper with timeout and retries
const fetchWithRetryAndTimeout = async (url, options = {}, retries = 3, timeoutMs = 8000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      clearTimeout(id);
      console.warn(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        throw error;
      }
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Cache hit check
  const now = Date.now();
  if (cache.data && (now - cache.timestamp < CACHE_TTL_MS)) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cache.data);
  }

  try {
    const response = await fetchWithRetryAndTimeout(SACHET_API_URL);
    const rawAlerts = await response.json();

    if (!Array.isArray(rawAlerts)) {
      throw new Error("Invalid response format: Expected an array.");
    }

    // Normalize NDMA Sachet Alerts
    const normalizedAlerts = rawAlerts.map(alert => {
      // 1. Extract lat/lng from centroid
      let lat = 20.5937; // Fallback to center of India
      let lng = 78.9629;
      if (alert.centroid) {
        const parts = alert.centroid.split(',').map(parseFloat);
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          // Centroid format is "lng,lat" from CDOT Geoserver
          lng = parts[0];
          lat = parts[1];
        }
      }

      // 2. Map Disaster Type
      const disasterTypeLower = (alert.disaster_type || '').toLowerCase();
      let type = 'OTHER';
      if (disasterTypeLower.includes('cyclone') || disasterTypeLower.includes('storm') || disasterTypeLower.includes('wind')) {
        type = 'CYCLONE';
      } else if (disasterTypeLower.includes('flood') || disasterTypeLower.includes('rain')) {
        type = 'FLOOD';
      } else if (disasterTypeLower.includes('earthquake')) {
        type = 'EARTHQUAKE';
      } else if (disasterTypeLower.includes('drought')) {
        type = 'DROUGHT';
      } else if (disasterTypeLower.includes('volcano')) {
        type = 'VOLCANO';
      }

      // 3. Map Severity (critical, high, medium, low)
      const color = (alert.severity_color || '').toLowerCase();
      let severity = 'medium';
      if (color === 'red') severity = 'critical';
      else if (color === 'orange') severity = 'high';
      else if (color === 'yellow') severity = 'medium';
      else if (color === 'green') severity = 'low';

      // 4. Construct title
      const disasterName = alert.disaster_type ? alert.disaster_type.toUpperCase() : 'DISASTER';
      const title = `${disasterName} - ${alert.area_description || 'India'}`;

      // 5. Parse Publication Time
      let timeStr = alert.effective_start_time || new Date().toUTCString();
      // "Tue Jun 30 14:07:00 IST 2026" is not fully RFC-2822 compliant due to "IST". 
      // Replace "IST" with "+0530" so it parses correctly in standard JS Date
      const parsedTimeStr = timeStr.replace('IST', '+0530');
      let isoTime = new Date(parsedTimeStr).toISOString();
      if (isoTime === 'Invalid Date') {
        isoTime = new Date().toISOString();
      }

      return {
        id: `sachet-${alert.identifier || alert.alert_id_sdma_autoinc || Math.random()}`,
        title,
        description: alert.warning_message || 'No additional details provided.',
        time: isoTime,
        lat,
        lng,
        severity,
        type,
        source: alert.alert_source || 'NDMA SACHET',
        link: `https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=${alert.identifier}`,
        affected_areas: alert.area_description ? [alert.area_description] : [],
        safety_guide: getSafetyGuide(type)
      };
    });

    // Save to Cache
    cache = {
      data: normalizedAlerts,
      timestamp: now
    };

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(normalizedAlerts);

  } catch (error) {
    console.error("Failed to fetch alerts:", error.message);

    // Fallback: If cache exists, return it despite error (graceful degradation)
    if (cache.data) {
      res.setHeader('X-Cache', 'STALE');
      return res.status(200).json(cache.data);
    }

    // Secondary Fallback: Return empty array to keep UI from crashing
    return res.status(503).json([]);
  }
}
