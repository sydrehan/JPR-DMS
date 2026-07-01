import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search } from 'lucide-react';
import { useLocation } from '../../context/LocationContext';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getIcon = (type, severity) => {
  let color = 'blue';
  if (severity === 'critical') color = 'red';
  else if (severity === 'high') color = 'orange';
  else if (severity === 'medium') color = 'yellow';

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Component to handle map bounds and search
const MapController = ({ center, searchQuery }) => {
  const map = useMap();
  const { location, refreshLocation } = useLocation();

  // Restrict to wider Asia Bounds (India + Neighbors)
  const asiaBounds = [
    [-10.0, 40.0], // Southwest (Indian Ocean)
    [50.0, 120.0] // Northeast (China/Japan)
  ];

  useEffect(() => {
    map.setMaxBounds(asiaBounds);
    map.setMinZoom(4);
  }, [map]);

  // Auto-Zoom to User Location on Load
  useEffect(() => {
    if (location) {
        map.flyTo([location.lat, location.lng], 8, { // Zoom 8 for State View
            animate: true,
            duration: 1.5
        });
    }
  }, [location, map]);

  useEffect(() => {
    if (searchQuery) {
      // Simple geocoding using OpenStreetMap Nominatim
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&countrycodes=in`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            const { lat, lon } = data[0];
            map.flyTo([lat, lon], 10);
          }
        })
        .catch(err => console.error("Search failed:", err));
    }
  }, [searchQuery, map]);

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

export const DisasterMap = ({ alerts }) => {
  const { location } = useLocation();
  // Default center
  let mapCenter = [20.5937, 78.9629];
  let zoomLevel = 5;
  
  // If there is a critical cyclone, center on it
  const criticalCyclone = alerts.find(a => a.type === 'CYCLONE' && a.severity === 'critical');
  if (criticalCyclone) {
    mapCenter = [criticalCyclone.lat, criticalCyclone.lng];
    zoomLevel = 6;
  }

  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
  };

  return (
    <div className="h-full w-full relative group">
      {/* Search Bar Overlay - Moved to top-right to avoid overlap with Leaflet zoom controls */}
      <div className="absolute top-4 right-4 z-[400] w-64">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search location in India..."
            className="w-full bg-white/90 backdrop-blur text-slate-900 pl-10 pr-4 py-2 rounded-lg shadow-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        </form>
      </div>

      <MapContainer 
        center={mapCenter} 
        zoom={zoomLevel} 
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {alerts.map(alert => (
          <Marker 
            key={alert.id} 
            position={[alert.lat, alert.lng]}
            icon={getIcon(alert.type, alert.severity)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg mb-1">{alert.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase text-white
                    ${alert.severity === 'critical' ? 'bg-red-500' : 
                      alert.severity === 'high' ? 'bg-orange-500' : 
                      alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-slate-500">{new Date(alert.time).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-slate-600 mb-2 line-clamp-3">{alert.description}</p>
                <a 
                  href={alert.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details &rarr;
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* User Location Marker & State Highlight */}
        {location && (
          <>
            {/* State/Region Highlight (Large Radius) */}
            <Circle 
              center={[location.lat, location.lng]}
              pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.1, weight: 1, dashArray: '10, 10' }}
              radius={80000} // ~80km radius to simulate district/region highlight
            />

            {/* Accuracy Circle */}
            <Circle 
              center={[location.lat, location.lng]}
              pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}
              radius={location.accuracy || 5000} 
            />
            
            {/* Exact Location Dot */}
            <Circle 
              center={[location.lat, location.lng]}
              pathOptions={{ color: '#ffffff', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
              radius={6}
            >
               <Popup>You are here</Popup>
            </Circle>
          </>
        )}
        
        <MapController center={mapCenter} searchQuery={query} />
      </MapContainer>
    </div>
  );
};
