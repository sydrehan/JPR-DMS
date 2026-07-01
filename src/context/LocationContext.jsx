import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  const getIpLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data.latitude && data.longitude) {
        setLocation({
          lat: data.latitude,
          lng: data.longitude,
          accuracy: 5000 // Approximate accuracy for IP-based
        });
        setError(null);
        setPermissionStatus('granted'); // Soft grant for functional purposes
      } else {
        throw new Error("Invalid IP location data");
      }
    } catch (err) {
      console.warn("IP Location failed:", err);
      // Final fallback to defaulting to India center or just error
      setError("Unable to retrieve location. Please enable GPS.");
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    setLoading(true);

    // IP Fallback timeout - If GPS takes too long (~6s), switch to IP
    const fallbackTimer = setTimeout(() => {
        if (loading) {
            console.warn("GPS timed out, switching to IP fallback...");
            getIpLocation();
        }
    }, 6000);

    if (!navigator.geolocation) {
      clearTimeout(fallbackTimer);
      getIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(fallbackTimer);
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setError(null);
        setLoading(false);
        setPermissionStatus('granted');
      },
      (err) => {
        clearTimeout(fallbackTimer);
        console.warn("GPS Access Failed:", err.message);
        // If GPS explicitly fails (denied/unavailable), try IP fallback immediately
        getIpLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const value = {
    location,
    error,
    loading,
    permissionStatus,
    refreshLocation: getLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
