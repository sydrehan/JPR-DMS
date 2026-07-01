import React, { useState, useEffect } from 'react';
import { Satellite, Signal, Wifi, UploadCloud, AlertCircle } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/config';
import { formatDate } from '../../utils/helpers';

const StatusIndicator = ({ label, status, value }) => (
  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-center justify-between">
    <div>
      <p className="text-slate-400 text-xs uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-bold ${status === 'good' ? 'text-green-400' : status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>
        {value}
      </p>
    </div>
    <div className={`w-3 h-3 rounded-full ${status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`} />
  </div>
);

export const StatusBoard = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const logsRef = ref(db, 'logs');
    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const logList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setLogs(logList.sort((a, b) => b.time - a.time).slice(0, 5));
      } else {
        setLogs([]);
      }
    }, (error) => {
      console.error("Firebase Logs Error:", error);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusIndicator label="Uplink Status" status="good" value="CONNECTED" />
        <StatusIndicator label="Signal Quality" status="good" value="98%" />
        <StatusIndicator label="Latency" status="warning" value="850ms" />
        <StatusIndicator label="Packets Queued" status="good" value="0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-panel-bg rounded-lg border border-slate-700 p-6">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <Satellite className="w-5 h-5 mr-2 text-blue-400" />
            Iridium Satellite Constellation View
          </h3>
          <div className="aspect-video bg-slate-900 rounded flex items-center justify-center border border-slate-800 relative overflow-hidden">
            {/* Mock Visualization Placeholder - Keeping visual but noting it's a placeholder */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-slate-900"></div>
            <div className="text-slate-500 text-sm">Satellite Tracking Visualization (Placeholder)</div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-blue-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        <div className="bg-panel-bg rounded-lg border border-slate-700 p-6">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <UploadCloud className="w-5 h-5 mr-2 text-blue-400" />
            Transmission Log
          </h3>
          <div className="space-y-3">
            {logs.length === 0 ? (
               <div className="text-slate-500 text-sm italic">No recent transmissions</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-center text-sm border-b border-slate-800 pb-2 last:border-0">
                  <div className={`w-2 h-2 rounded-full mr-3 ${log.type === 'TX' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 truncate">{log.msg || 'Data Packet'}</p>
                    <p className="text-xs text-slate-500">{formatDate(log.time)}</p>
                  </div>
                  <span className="text-xs text-blue-400 font-mono ml-2">ACK</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
