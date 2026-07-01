export const fetchDisasterAlerts = async () => {
  try {
    const response = await fetch('/api/alerts');
    if (!response.ok) {
      throw new Error(`Failed to fetch alerts: ${response.statusText}`);
    }
    const alerts = await response.json();
    return alerts;
  } catch (error) {
    console.error("Error fetching disaster alerts from backend:", error);
    return [];
  }
};

