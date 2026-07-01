import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocation } from '../../context/LocationContext';

// Fix for default marker icon in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const TOWER_POSITION = [28.6139, 77.2090]; // Example: New Delhi

// Component to handle map zooming to user location
const LocationMarker = () => {
  const map = useMap();
  const { location, refreshLocation } = useLocation();

  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 13);
    }
  }, [location, map]);

  return (
    <div className="leaflet-bottom leaflet-right" style={{ zIndex: 1000, pointerEvents: 'auto' }}>
      <div className="leaflet-control leaflet-bar">
        <button 
          title="Locate me"
          onClick={(e) => {
            e.preventDefault();
            if (location) {
               map.flyTo([location.lat, location.lng], 13);
            } else {
               refreshLocation();
            }
          }}
          className="bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center w-8 h-8 cursor-pointer border-none"
          style={{ width: '30px', height: '30px', lineHeight: '30px', fontSize: '18px' }}
        >
          📍
        </button>
      </div>
    </div>
  );
};

export const LiveMap = ({ nodes }) => {
  const { location } = useLocation();

  return (
    <div className="bg-panel-bg rounded-lg border border-slate-700 shadow-lg h-full flex flex-col relative">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-white">Live Operations Map</h3>
        <span className="text-xs text-slate-400">
          {nodes.length} Active Node{nodes.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex-1 relative z-0">
        {nodes.length === 0 && (
           <div className="absolute top-4 right-4 z-[500] bg-slate-800/90 text-slate-300 px-4 py-2 rounded-lg border border-slate-600 text-sm shadow-lg backdrop-blur-sm pointer-events-none">
             No active nodes detected in database
           </div>
        )}
        <MapContainer 
          center={TOWER_POSITION} 
          zoom={16} 
          style={{ height: '100%', width: '100%' }}
          className="rounded-b-lg"
        >
          <LocationMarker />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* User Location Marker */}
          {location && (
            <>
              <Circle 
                center={[location.lat, location.lng]}
                pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}
                radius={location.accuracy || 100}
              />
              <Circle 
                center={[location.lat, location.lng]}
                pathOptions={{ color: '#ffffff', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
                radius={8}
              >
                 <Popup>You are here</Popup>
              </Circle>
            </>
          )}

          {/* Tower Marker */}
          <Circle 
            center={TOWER_POSITION}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
            radius={300}
          />
          <Marker position={TOWER_POSITION}>
            <Popup>
              <div className="text-slate-900">
                <strong>Main Control Tower</strong><br />
                Status: ONLINE<br />
                Range: 5km
              </div>
            </Popup>
          </Marker>

          {/* Node Markers */}
          {nodes.map(node => (
            <Marker 
              key={node.id} 
              position={[node.lat, node.lng]}
            >
              <Popup>
                <div className="text-slate-900">
                  <strong>Node: {node.id}</strong><br />
                  Status: {node.status}<br />
                  Battery: {node.battery}%
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

