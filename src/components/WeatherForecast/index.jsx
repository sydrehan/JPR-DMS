import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Calendar, RefreshCw, Info } from 'lucide-react';

const WeatherForecast = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [selectedDay, setSelectedDay] = useState('d01');
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(false);
  
  // Configuration
  const TOTAL_FRAMES = 48; 
  const BASE_URL = 'https://ews.tropmet.res.in/data/AQI_data/forecast/pm2.5/images';
  
  const timerRef = useRef(null);

  // Preload images when day changes
  useEffect(() => {
    setLoading(true);
    setError(false);
    setIsPlaying(false);
    setCurrentFrame(0);
    
    const loadImages = async () => {
      const loadedImages = [];
      
      // Try to load first few to check if valid
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = `${BASE_URL}/${selectedDay}/${i}.png`;
        loadedImages.push(img.src);
      }
      
      setImages(loadedImages);
      setLoading(false);
    };

    loadImages();
    
    // No cleanup needed for image loading
  }, [selectedDay]);

  // Animation loop
  useEffect(() => {
    // Always play
    timerRef.current = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % TOTAL_FRAMES);
    }, 200); // 200ms per frame
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // Run once on mount

  // Format time display
  const getDisplayTime = (frame) => {
    const now = new Date();
    // Add days based on selectedDay
    const dayOffset = parseInt(selectedDay.replace('d', '')) - 1;
    now.setDate(now.getDate() + dayOffset);
    now.setHours(Math.floor(frame / 2), 0, 0, 0); // Approx 30 min steps or hourly
    
    return now.toLocaleString('en-IN', { 
      weekday: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col h-full shadow-lg relative group transition-colors duration-300">
      {/* Header - Minimal */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-500/20 rounded-lg backdrop-blur-md">
            <RefreshCw className={`w-4 h-4 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2 shadow-black drop-shadow-md">
              Live Weather Forecast
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-red-500 text-white rounded-full animate-pulse">
                Live
              </span>
            </h3>
            <p className="text-[10px] text-slate-300 shadow-black drop-shadow-sm">Source: IITM / ews.tropmet.res.in</p>
          </div>
        </div>
        
        {/* Day Selection - Hidden/Removed as per request */}
        <div className="hidden">
          {['d01', 'd02', 'd03'].map((day, idx) => (
            <button
              key={day}
              onClick={() => handleDayChange(day)}
            >
              Day {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Map Image */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center w-full h-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/80 backdrop-blur-sm">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Image Display */}
        <div className="relative w-full h-full">
           <img 
             src={images[currentFrame]} 
             alt="Weather Forecast"
             className="w-full h-full object-contain transition-opacity duration-200"
             onError={() => setError(true)}
           />
           
           {/* Time Overlay - Removed as per request */}
           
           {error && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-20">
               <div className="text-center">
                 <Info className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                 <p className="text-slate-400 text-sm">Signal Lost</p>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};


export default WeatherForecast;
