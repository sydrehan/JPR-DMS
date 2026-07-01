import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Siren, Cloud, Sun, Loader2 } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';
import { useTranslation } from 'react-i18next';

export const SafetyStatus = ({ level = 'safe', alerts = [] }) => {
  const { location } = useLocation();
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [locationName, setLocationName] = useState("Locating...");
  const [status, setStatus] = useState({ level: 'safe', alert: null });

  // Haversine Distance Formula (km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Check for nearby alerts
  useEffect(() => {
    if (location && alerts.length > 0) {
      const nearbyCritical = alerts.find(a => {
        if (!a.lat || !a.lng) return false;
        const dist = calculateDistance(location.lat, location.lng, a.lat, a.lng);
        return dist <= 20 && (a.severity === 'critical' || a.severity === 'high');
      });

      if (nearbyCritical) {
        setStatus({ level: 'danger', alert: nearbyCritical });
      } else {
        setStatus({ level: 'safe', alert: null });
      }
    } else {
        if (location) setStatus({ level: 'safe', alert: null });
    }
  }, [location, alerts]);

  // Fetch Weather & Location Name
  useEffect(() => {
    if (location) {
      // 1. Fetch Weather (Current + Daily)
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`)
        .then(res => res.json())
        .then(data => {
          setWeather({
            current: {
                temp: data.current.temperature_2m,
                code: data.current.weathercode
            },
            daily: data.daily
          });
        })
        .catch(err => console.error("Weather fetch failed", err));

      // 2. Reverse Geocoding (BigDataCloud)
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.lat}&longitude=${location.lng}&localityLanguage=en`)
        .then(res => res.json())
        .then(data => {
            const city = data.locality || data.city || data.principalSubdivision;
            const state = data.principalSubdivision;
            const country = data.countryName;
            
            if (city && state) {
                setLocationName(`${city}, ${state}`);
            } else if (state) {
                setLocationName(`${state}, ${country}`);
            } else {
                setLocationName("Unknown Location");
            }
        })
        .catch(err => {
            console.warn("Geocoding failed", err);
            setLocationName(`${location.lat.toFixed(2)}°N, ${location.lng.toFixed(2)}°E`);
        });
    }
  }, [location]);

  // Helper to get weather icon/text
  const getWeatherDetails = (code) => {
      if (code === 0) return { label: 'Clear', icon: Sun };
      if (code >= 1 && code <= 3) return { label: 'Cloudy', icon: Cloud };
      if (code >= 51 && code <= 67) return { label: 'Rain', icon: Cloud };
      if (code >= 95) return { label: 'Storm', icon: AlertTriangle };
      return { label: 'Cloudy', icon: Cloud };
  };

  const config = {
    safe: {
      bg: 'bg-[#0f172a]', 
      iconBg: 'bg-green-500', 
      icon: ShieldCheck,
      title: t('status.safe'),
      sub: (
        <div className="flex flex-col">
            <span className="opacity-80 text-xs">{t('status.safe_desc')}</span>
            <span className="text-white font-bold text-base leading-tight mt-0.5">{locationName}</span>
        </div>
      ),
      textColor: 'text-white'
    },
    danger: {
      bg: 'bg-red-900',
      iconBg: 'bg-red-600',
      icon: Siren,
      title: t('status.danger_title'),
      sub: (
        <div className="flex flex-col">
             <span className="opacity-80 text-xs">{t('status.danger_desc')}</span>
             <span className="text-white font-bold text-base leading-tight mt-0.5">{status.alert?.title || t('status.unknown_danger')}</span>
        </div>
      ),
      textColor: 'text-white'
    }
  };

  const current = config[status.level] || config.safe;
  const Icon = current.icon;
  const weatherInfo = weather ? getWeatherDetails(weather.current.code) : { label: 'Loading...', icon: Loader2 };
  const WeatherIcon = weatherInfo.icon;

  return (
    <div className={`w-full rounded-3xl px-6 py-5 ${current.bg} text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden min-h-[180px]`}>
      
      {/* Left: Status */}
      <div className="flex items-center gap-5 z-10 w-full md:w-auto">
        <div className={`w-16 h-16 rounded-full ${current.iconBg} flex items-center justify-center shrink-0 shadow-lg shadow-black/20 animate-pulse`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <div className="text-slate-400 text-xs font-medium mb-1 flex items-start gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1 shrink-0"></span> 
             {current.sub}
          </div>
          <h2 className="text-2xl md:text-4xl font-black tracking-normal leading-loose mb-2 overflow-hidden text-ellipsis py-1">{current.title}</h2>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-300 border border-white/10">
            Scanning Radius: 20KM
          </div>
        </div>
      </div>

      {/* Right: Compact Weather Widget */}
      <div className="flex flex-col items-end gap-2 z-10 mt-4 md:mt-0 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-md min-w-[180px]">
        {weather ? (
          <>
             {/* Current */}
             <div className="flex items-center justify-between w-full border-b border-white/10 pb-2 mb-1 gap-3">
                 <div className="text-left">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Now</div>
                    <div className="text-2xl font-bold tracking-tighter">{Math.round(weather.current.temp)}°</div>
                 </div>
                 <div className="text-right flex flex-col items-end">
                    <WeatherIcon className="w-5 h-5 text-blue-300 mb-0.5" />
                    <div className="text-[10px] text-slate-300 font-medium">{weatherInfo.label}</div>
                 </div>
             </div>

             {/* Forecast Row */}
             <div className="flex justify-between w-full gap-2">
                {[1, 2].map(i => {
                    const dayData = {
                        max: weather.daily.temperature_2m_max[i],
                        min: weather.daily.temperature_2m_min[i],
                        code: weather.daily.weathercode[i]
                    };
                    const DayIcon = getWeatherDetails(dayData.code).icon;
                    return (
                        <div key={i} className="text-center bg-white/5 rounded-lg p-1.5 flex-1">
                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                                {i === 1 ? 'TMR' : 'DAY 2'}
                            </div>
                            <DayIcon className="w-4 h-4 text-white mx-auto mb-1" />
                            <div className="text-xs font-bold">{Math.round(dayData.max)}°</div>
                        </div>
                    )
                })}
             </div>
          </>
        ) : (
          <div className="flex items-center gap-2 text-slate-400 py-2 px-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">Loading...</span>
          </div>
        )}
      </div>

      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 p-4 opacity-5 pointer-events-none rotate-12">
         <Icon className="w-96 h-96" />
      </div>
    </div>
  );
};
