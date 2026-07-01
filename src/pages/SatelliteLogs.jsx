import React from 'react';
import { StatusBoard } from '../components/SatellitePanel/StatusBoard';
import { Satellite } from 'lucide-react';

export const SatelliteLogs = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Satellite className="w-8 h-8 mr-3 text-blue-400" />
          Satellite Uplink Status
        </h2>
        <p className="text-slate-400 mt-1">Iridium/Inmarsat connection monitoring and telemetry logs</p>
      </div>

      <div className="flex-1 min-h-0">
        <StatusBoard />
      </div>
    </div>
  );
};
