import React from 'react';
import { Battery, Sun, Zap } from 'lucide-react';

export const PowerPanel = () => {
  return (
    <div className="bg-panel-bg rounded-lg border border-slate-700 p-6">
      <h3 className="text-white font-bold mb-6 flex items-center">
        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
        Power Systems
      </h3>
      
      <div className="grid grid-cols-2 gap-8">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * 85) / 100}
                className="text-green-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Battery className="w-8 h-8 text-green-500 mb-1" />
              <span className="text-2xl font-bold text-white">85%</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Main Battery Bank</p>
          <p className="text-xs text-slate-500">12.8V / 200Ah</p>
        </div>

        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * 60) / 100}
                className="text-yellow-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Sun className="w-8 h-8 text-yellow-500 mb-1" />
              <span className="text-2xl font-bold text-white">60W</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Solar Input</p>
          <p className="text-xs text-slate-500">Peak: 120W</p>
        </div>
      </div>
    </div>
  );
};
