import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';

export const useFirebaseNodes = () => {
  const [nodes, setNodes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const nodesRef = ref(db, 'devices');
    
    const handleValue = (snapshot) => {
      setLoading(false);
      const data = snapshot.val();
      if (data) {
        setNodes(data);
      } else {
        setNodes({});
      }
    };

    const handleError = (err) => {
        setLoading(false);
        setError(err.message);
        console.error("Firebase Nodes Error:", err);
    };

    const unsubscribe = onValue(nodesRef, handleValue, handleError);

    return () => unsubscribe();
  }, []);

  return { nodes, loading, error };
};

export const useFirebaseLogs = () => {
    const [logs, setLogs] = useState({ critical: {}, rescue: {}, receiver: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Listen to the root 'logs' path, but also checking 'receiver_logs' might be needed
        // based on user input. For now, let's look at the implementation. 
        // If the user says data is there but not showing, maybe we should listen to root to see structure?
        // No, let's stick to specific paths but expand.
        
        const logsRef = ref(db, '/'); // Let's listen to root momentarily to debug structure or grab sibling paths

        const handleValue = (snapshot) => {
            setLoading(false);
            const data = snapshot.val();
            if (data) {
                // Check where the logs actually are
                // Helper to parse Push items (which might be Objects with 'raw', 'sender', etc.)
                const parseLogs = (logData) => {
                    const parsed = {};
                    Object.entries(logData).forEach(([key, val]) => {
                        let processedVal = { ...val };
                        
                        // If it has 'raw' string but no message, parse it
                        // Format example: "MSG:2228:FALL:MASTER:DIRECT:Master Fell!"
                        // Format example: "Flood"
                        if (val.raw && !val.message) {
                             const parts = val.raw.split(':');
                             if (parts.length >= 6) {
                                 // "MSG:2228:FALL:MASTER:DIRECT:Master Fell!"
                                 processedVal.type = parts[2]; // FALL
                                 processedVal.sender = parts[3]; // MASTER (or sender ID)
                                 processedVal.message = parts.slice(5).join(':'); // Master Fell!
                             } else {
                                 // Simple message like "Flood"
                                 processedVal.message = val.raw;
                                 processedVal.type = 'ALERT';
                             }
                        }
                        
                        // Ensure timestamp exists
                        if (!processedVal.timestamp) processedVal.timestamp = Date.now();
                        
                        parsed[key] = processedVal;
                    });
                    return parsed;
                };

                const critical = parseLogs(data.logs?.critical || {});
                const rescue = parseLogs(data.logs?.rescue || {});
                // The user showed data that might be in 'receiver_logs' or root level alerts
                const receiver = parseLogs(data.receiver_logs || {});
                
                // Debug log to console to help dev see what's coming
                console.log("Firebase Data Snapshot:", data);

                setLogs({
                    critical,
                    rescue,
                    receiver
                });
            } else {
                setLogs({ critical: {}, rescue: {}, receiver: {} });
            }
        };

        const handleError = (err) => {
            setLoading(false);
            setError(err.message);
            console.error("Firebase Logs Error:", err);
        };

        const unsubscribe = onValue(logsRef, handleValue, handleError);

        return () => unsubscribe();
    }, []);

    return { logs, loading, error };
};
