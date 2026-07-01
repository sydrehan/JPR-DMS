import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Navigation } from 'lucide-react';

const POSITION = [28.6139, 77.2090];
const SAFE_ZONE = [28.6129, 77.2100];
const ROUTE = [
  [28.6139, 77.2090],
  [28.6135, 77.2092],
  [28.6132, 77.2098],
  [28.6129, 77.2100]
];

export const RouteMap = () => {
  return (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">Evacuation Path</h3>
            <p className="text-xs text-green-400">Safest route to Assembly Point A</p>
          </div>
          <div className="bg-blue-600 p-2 rounded-full">
            <Navigation className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={POSITION} 
          zoom={17} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <Marker position={POSITION}>
            <Popup>You are here</Popup>
          </Marker>
          <Marker position={SAFE_ZONE}>
            <Popup>Safe Zone (Assembly Point A)</Popup>
          </Marker>
          <Polyline 
            positions={ROUTE} 
            pathOptions={{ color: '#22c55e', weight: 5, dashArray: '10, 10' }} 
          />
        </MapContainer>
      </div>

      <div className="bg-slate-800 p-4 border-t border-slate-700">
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white mr-3 shrink-0">1</div>
            <p className="text-sm text-slate-300">Head South towards Main Gate</p>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white mr-3 shrink-0">2</div>
            <p className="text-sm text-slate-300">Turn Left at the Water Tank</p>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs text-white mr-3 shrink-0">3</div>
            <p className="text-sm text-white font-bold">Arrive at Assembly Point A</p>
          </div>
        </div>
      </div>
    </div>
  );
};
