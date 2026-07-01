import React from 'react';
import { PlayCircle, FileText, Download } from 'lucide-react';

export const ResourceCard = ({ title, type, duration, thumbnail }) => {
  return (
    <div className="bg-panel-bg rounded-lg border border-slate-700 overflow-hidden group hover:border-disaster-red transition-colors">
      <div className="relative h-40 bg-slate-800">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <PlayCircle className="w-12 h-12 text-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${
            type === 'VIDEO' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
          }`}>
            {type}
          </span>
          <button className="text-slate-400 hover:text-white">
            <Download className="w-4 h-4" />
          </button>
        </div>
        <h3 className="text-white font-bold mb-1 line-clamp-2">{title}</h3>
        <p className="text-xs text-slate-500">Updated 2 days ago</p>
      </div>
    </div>
  );
};
