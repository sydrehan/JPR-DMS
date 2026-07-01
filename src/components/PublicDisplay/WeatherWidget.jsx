import React from 'react';
import { CloudRain, Wind, Thermometer } from 'lucide-react';

export const WeatherWidget = () => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-400 text-lg uppercase tracking-wider font-bold">Local Weather</h3>
          <p className="text-slate-500">New Delhi, India</p>
        </div>
        <CloudRain className="w-12 h-12 text-blue-400" />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-5xl font-bold text-white">28°C</div>
        <div className="space-y-2">
          <div className="flex items-center text-slate-300">
            <Wind className="w-5 h-5 mr-2 text-slate-500" />
            <span>12 km/h NW</span>
          </div>
          <div className="flex items-center text-slate-300">
            <Thermometer className="w-5 h-5 mr-2 text-slate-500" />
            <span>Humidity: 65%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
