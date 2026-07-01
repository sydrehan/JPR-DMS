import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase/config';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

export const FirebaseStatus = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const connectedRef = ref(db, ".info/connected");
    const unsubscribe = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        setConnected(true);
        setError(null);
      } else {
        setConnected(false);
      }
    }, (err) => {
      console.error("Connection listener error:", err);
      setError(err.message);
    });
    return () => unsubscribe();
  }, []);

  if (connected) return null; // Hide if all good? Or show small dot?

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-sm bg-slate-900 border border-slate-700 shadow-2xl rounded-lg p-4 font-mono text-xs">
      <div className="flex items-center mb-2">
        {connected ? (
          <Wifi className="w-4 h-4 text-green-500 mr-2" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500 mr-2 animate-pulse" />
        )}
        <span className={connected ? "text-green-500" : "text-red-500"}>
          {connected ? "Firebase Connected" : "Firebase Disconnected"}
        </span>
      </div>
      
      {!connected && (
        <div className="space-y-2 text-slate-400">
           <p>Possible reasons:</p>
           <ul className="list-disc pl-4 space-y-1">
             <li>Incorrect Database URL in config.js</li>
             <li>Internet connection issues</li>
             <li>
               <span className="text-yellow-500 font-bold flex items-center gap-1">
                 <AlertTriangle className="w-3 h-3" />
                 Database Rules Blocking
               </span>
               Ensure rules are public: {`{ ".read": true, ".write": true }`}
             </li>
           </ul>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-900/20 border border-red-900/50 rounded text-red-400">
          Error: {error}
        </div>
      )}
    </div>
  );
};
