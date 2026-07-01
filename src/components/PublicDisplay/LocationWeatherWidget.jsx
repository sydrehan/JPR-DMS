import React, { useState, useEffect } from 'react';
import { useLocation } from '../../context/LocationContext';
import { Wind, Thermometer, Droplets, MapPin, Loader2, RefreshCw, Navigation, Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog, CloudDrizzle } from 'lucide-react';

export const LocationWeatherWidget = () => {
  const { location, error, loading: locationLoading, permissionStatus, refreshLocation } = useLocation();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showPermissionHint, setShowPermissionHint] = useState(false);

  useEffect(() => {
    let timer;
    if (locationLoading || loading) {
      timer = setTimeout(() => {
        if (locationLoading) {
           setShowPermissionHint(true);
        }
      }, 3000);
    } else {
      setShowPermissionHint(false);
    }
    return () => clearTimeout(timer);
  }, [locationLoading, loading]);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location.lat, location.lng);
    }
  }, [location]);

  const fetchWeatherData = async (lat, lng) => {
    setLoading(true);
    setFetchError(null);
    try {
      // 1. Fetch Weather from Open-Meteo including weathercode
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode&air_quality=pm2_5`
      );
      if (!weatherRes.ok) throw new Error("Weather API Error");
      const weatherData = await weatherRes.json();
      
      // 2. Reverse Geocoding for Place Name
      let placeName = "Unknown Location";
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        const geoData = await geoRes.json();
        const locality = geoData.locality || geoData.city || "";
        const principalSubdivision = geoData.principalSubdivision || "";
        const country = geoData.countryName || "";
        
        if (locality && principalSubdivision) {
          placeName = `${locality}, ${principalSubdivision}`;
        } else if (locality) {
          placeName = `${locality}, ${country}`;
        } else {
          placeName = `${geoData.continent}, ${country}`;
        }
      } catch (e) {
        console.warn("Geocoding failed", e);
        placeName = `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`;
      }
      
      setWeather({
        temp: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        wind: weatherData.current.wind_speed_10m,
        code: weatherData.current.weathercode,
        aqi: weatherData.current.pm2_5 || 45, 
        locationName: placeName
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch weather", err);
      setFetchError("Unable to load weather data. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (location) {
      fetchWeatherData(location.lat, location.lng);
    } else {
      refreshLocation();
    }
  };

  // WMO Weather Code Mapping
  const getWeatherCondition = (code) => {
    if (code === 0) return { label: 'Clear Sky', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', icon: Cloud, color: 'text-blue-400', bg: 'bg-blue-500/10' };
    if (code >= 45 && code <= 48) return { label: 'Foggy', icon: CloudFog, color: 'text-slate-400', bg: 'bg-slate-500/10' };
    if (code >= 51 && code <= 55) return { label: 'Drizzle', icon: CloudDrizzle, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    if (code >= 61 && code <= 67) return { label: 'Rain', icon: CloudRain, color: 'text-blue-500', bg: 'bg-blue-600/10' };
    if (code >= 71 && code <= 77) return { label: 'Snow', icon: CloudSnow, color: 'text-white', bg: 'bg-white/10' };
    if (code >= 95 && code <= 99) return { label: 'Thunderstorm', icon: CloudLightning, color: 'text-purple-400', bg: 'bg-purple-500/10' };
    return { label: 'Unknown', icon: Sun, color: 'text-slate-400', bg: 'bg-slate-500/10' };
  };

  if (permissionStatus === 'denied') {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6 text-center">
        <MapPin className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-white font-bold mb-2">Location Access Needed</h3>
        <p className="text-slate-400 text-sm mb-4">Enable location to get real-time local safety updates.</p>
        <button 
          onClick={refreshLocation}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors shadow-lg shadow-red-500/20"
        >
          Enable Location
        </button>
      </div>
    );
  }

  if (locationLoading || (loading && !weather)) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex items-center justify-center h-48 animate-pulse relative">
        <div className="text-center z-10">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
          <p className="text-slate-400 text-sm font-medium">Locating & Fetching Data...</p>
          {showPermissionHint && (
            <div className="mt-4">
               <p className="text-slate-500 text-xs mb-3 animate-pulse">
                Taking longer than expected...<br/>
                Please allow location access.
              </p>
              <button 
                onClick={refreshLocation}
                className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded text-xs border border-slate-700 pointer-events-auto"
              >
                Retry / Manual Trigger
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-red-500/30 p-6 text-center flex flex-col items-center justify-center h-full">
        <MapPin className="w-8 h-8 text-red-400 mb-2" />
        <p className="text-red-200 text-sm mb-3 font-medium">{error}</p>
        <button 
          onClick={refreshLocation}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors border border-slate-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-orange-500/30 p-6 text-center flex flex-col items-center justify-center h-full">
        <Cloud className="w-8 h-8 text-orange-400 mb-2" />
        <p className="text-orange-200 text-sm mb-3 font-medium">{fetchError}</p>
        <button 
          onClick={handleRefresh}
          className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors border border-slate-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weather) return null;

  const condition = getWeatherCondition(weather.code);
  const WeatherIcon = condition.icon;

  return (
    <div className="h-full w-full bg-gradient-to-br from-white to-slate-50 dark:from-[#0B1221] dark:to-[#0f172a] rounded-3xl relative overflow-hidden flex flex-col justify-between group shadow-lg dark:shadow-2xl p-6 transition-all duration-300 border border-slate-200 dark:border-slate-800">
      {/* Subtle Background Glow */}
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40 dark:opacity-20 transition-colors duration-1000 ${condition.color.replace('text-', 'bg-')}`}></div>
      
      {/* Header: Location & Time */}
      <div className="flex justify-between items-start relative z-10 w-full mb-2">
        <div className="flex items-center gap-4">
           {/* Navigation Icon Button */}
           <div className="bg-white/80 dark:bg-slate-800/50 p-3 rounded-full backdrop-blur-md border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer shadow-sm" onClick={refreshLocation}>
             <Navigation className="w-5 h-5 text-blue-500 dark:text-blue-400 transform rotate-45" />
           </div>
           
           <div>
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-tight">{weather.locationName}</h2>
             <div className="flex items-center gap-3 mt-1">
               <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wide">
                 {location?.lat.toFixed(4)}°N, {location?.lng.toFixed(4)}°E
               </span>
               <span className="text-[10px] bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50 font-medium">
                  {lastUpdated ? lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
               </span>
             </div>
           </div>
        </div>
        
        <button 
           onClick={handleRefresh}
           className="p-2 text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-white transition-colors"
           title="Refresh"
        >
           <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main Content: Big Temp & Icon */}
      <div className="flex-1 flex items-end justify-between relative z-10 w-full pb-2">
         {/* Left: Temperature & Condition */}
         <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-6xl md:text-7xl lg:text-[5.5rem] leading-none font-black text-slate-900 dark:text-white tracking-tighter shadow-black drop-shadow-2xl transition-all duration-300">
                 {Math.round(weather.temp)}
                 <span className="text-2xl md:text-3xl lg:text-4xl text-slate-500 dark:text-slate-400 font-light align-top ml-1">°</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 mt-2">
                <WeatherIcon className={`w-6 h-6 md:w-8 md:h-8 ${condition.color}`} />
                <span className="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-200 tracking-tight">{condition.label}</span>
            </div>
         </div>
         
         {/* Right: Giant Decorative Icon (faded) */}
         <div className="absolute bottom-4 right-4 pointer-events-none">
             <WeatherIcon className={`w-24 h-24 md:w-36 md:h-36 ${condition.color} opacity-10 blur-sm scale-100 transition-all duration-300`} />
             <WeatherIcon className={`w-20 h-20 md:w-32 md:h-32 ${condition.color} opacity-80 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] absolute bottom-0 right-0 animate-pulse-slow transition-all duration-300`} />
         </div>
      </div>

      {/* Footer: Quick Stats (Minimal pills) */}
      <div className="flex items-center gap-3 relative z-10 mt-auto pt-4 border-t border-slate-200 dark:border-slate-800/50">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/30 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/30 backdrop-blur-sm shadow-sm dark:shadow-none">
            <Wind className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{weather.wind} km/h</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/30 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/30 backdrop-blur-sm shadow-sm dark:shadow-none">
            <Droplets className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/30 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/30 backdrop-blur-sm shadow-sm dark:shadow-none">
             <div className={`w-2 h-2 rounded-full ${weather.aqi < 50 ? 'bg-green-500' : 'bg-orange-500'}`}></div>
             <span className="text-xs font-bold text-slate-600 dark:text-slate-300">AQI {weather.aqi}</span>
          </div>
      </div>
    </div>
  );
};
