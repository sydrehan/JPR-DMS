import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Search, Filter, Download } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/config';

export const TerminalConsole = () => {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    const logsRef = ref(db, 'logs');
    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and sort by time if needed
        const logList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => b.time - a.time); // Newest first? User mock was newest last? Console usually appends.
        // Actually console usually appends at bottom, so oldest first or just append.
        // MOCK_LOGS had newest at end? id 5 was time - 15000. Wait.
        // id 1 is Now, id 5 is Now - 15000. So id 1 is newest. 
        // The render map just renders them.
        // Let's sort by time ascending for console log flow (oldest top, newest bottom).
        setLogs(logList.sort((a, b) => a.time - b.time));
      } else {
        setLogs([]);
      }
    }, (error) => {
      console.error("Firebase Logs Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.msg && l.msg.includes(filter));

  return (
    <div className="bg-black rounded-lg border border-slate-700 shadow-lg font-mono text-sm flex flex-col h-[600px]">
      <div className="bg-slate-900 p-3 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center text-green-500">
          <Terminal className="w-5 h-5 mr-2" />
          <span className="font-bold">LoRa Gateway Serial Monitor (COM3)</span>
        </div>
        <div className="flex space-x-2">
          <select 
            className="bg-slate-800 text-slate-300 border border-slate-600 rounded px-2 py-1 text-xs focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">ALL LOGS</option>
            <option value="HELP">SOS/HELP</option>
            <option value="FALL">FALL DETECT</option>
            <option value="SYS">SYSTEM</option>
          </select>
          <button className="p-1 text-slate-400 hover:text-white">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 italic p-2">Waiting for data stream...</div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="flex space-x-3 hover:bg-slate-900/50 p-1 rounded">
              <span className="text-slate-500 w-24 shrink-0">
                {(() => {
                  try {
                    const formatted = formatDate(log.time || Date.now());
                    const parts = formatted.split(',');
                    return parts.length > 1 ? `[${parts[1].trim()}]` : '[--:--:--]';
                  } catch (e) {
                    return '[--:--:--]';
                  }
                })()}
              </span>
              <span className={`w-8 shrink-0 font-bold ${
                log.type === 'TX' ? 'text-blue-400' : 
                log.type === 'RX' ? 'text-green-400' : 'text-yellow-400'
              }`}>{log.type}</span>
              <span className={`flex-1 break-all ${
                log.msg && (log.msg.includes('HELP') || log.msg.includes('FALL')) ? 'text-red-500 font-bold' : 'text-slate-300'
              }`}>
                {log.msg}
              </span>
              {log.type === 'RX' && (
                <span className="text-slate-600 text-xs w-24 text-right shrink-0">
                  RSSI: {log.rssi}
                </span>
              )}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
      
      <div className="p-2 bg-slate-900 border-t border-slate-700 flex">
        <span className="text-green-500 mr-2">{'>'}</span>
        <input 
          type="text" 
          className="bg-transparent border-none focus:outline-none text-white flex-1"
          placeholder="Enter AT command..."
        />
      </div>
    </div>
  );
};
