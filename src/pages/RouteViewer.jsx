import React from 'react';
import { RouteMap } from '../components/QRViewer/RouteMap';
import { Map as MapIcon } from 'lucide-react';

export const RouteViewer = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <MapIcon className="w-8 h-8 mr-3 text-green-500" />
          QR Route Navigator
        </h2>
        <p className="text-slate-400 mt-1">Scanned location evacuation path</p>
      </div>

      <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-slate-700">
        <RouteMap />
      </div>
    </div>
  );
};
