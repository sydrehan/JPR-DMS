import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';

export const useDashboardData = () => {
  const [stats, setStats] = useState({ safe: 0, help: 0, trouble: 0, total: 0 });
  const [nodes, setNodes] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(db, 'devices');
    const logsRef = ref(db, 'logs');

    const unsubscribeDevices = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Default locations for known nodes to prevent map crashes
        const DEFAULT_LOCATIONS = {
          'MASTER': { lat: 28.6139, lng: 77.2090 },
          'NODE A': { lat: 28.6145, lng: 77.2095 },
          'NODE B': { lat: 28.6135, lng: 77.2085 },
          'NODE C': { lat: 28.6142, lng: 77.2080 },
          'MSG': { lat: 28.6130, lng: 77.2100 },
          'NODE_1': { lat: 28.6148, lng: 77.2088 },
          'NODE_B': { lat: 28.6132, lng: 77.2092 }
        };

        const nodeList = Object.keys(data).map(key => {
          const defaults = DEFAULT_LOCATIONS[key] || { lat: 28.6139 + (Math.random() * 0.001), lng: 77.2090 + (Math.random() * 0.001) };
          const deviceData = data[key];
          
          // Auto-detect OFFLINE if last_seen > 2 minutes ago
          const lastSeen = deviceData.last_seen || 0;
          const isStale = (Date.now() - lastSeen) > 2 * 60 * 1000;
          
          let status = deviceData.status || 'OFFLINE';
          if (isStale && status === 'ONLINE') {
              status = 'OFFLINE';
          }

          return {
            id: key,
            name: key,
            lat: defaults.lat,
            lng: defaults.lng,
            battery: 100, // Default battery if missing
            ...deviceData,
            status // Override status
          };
        });
        setNodes(nodeList);
        
        let safeCount = 0;
        let troubleCount = 0;
        
        nodeList.forEach(node => {
          if (node.status === 'ONLINE' || node.status === 'SAFE') safeCount++;
          else troubleCount++; // Any non-safe status count as trouble/offline
        });
        
        setStats({
          safe: safeCount,
          help: 0, // 'help' status not explicitly in devices list yet, relying on logs/status
          trouble: troubleCount,
          total: nodeList.length
        });
      } else {
        setNodes([]);
        setStats({ safe: 0, help: 0, trouble: 0, total: 0 });
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase Devices Error:", error);
      setLoading(false);
    });

    const unsubscribeLogs = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allAlerts = [];
        // Process Critical Logs
        if (data.critical) {
          Object.entries(data.critical).forEach(([id, log]) => {
            allAlerts.push({
              id,
              type: log.type || 'CRITICAL',
              message: log.message,
              sender: log.sender,
              time: log.timestamp,
              severity: 'critical'
            });
          });
        }
        // Process Rescue Logs
        if (data.rescue) {
           Object.entries(data.rescue).forEach(([id, log]) => {
            // Optional: Include rescue logs as alerts or specialized messages
            // For now, let's include them as 'info' or 'success' if they are "SAFE" messages
            if (log.type !== 'SAFE') {
               allAlerts.push({
                id,
                type: log.type || 'RESCUE',
                message: log.message,
                sender: log.sender,
                time: log.timestamp,
                severity: 'medium'
              });
            }
          });
        }
        setAlerts(allAlerts.sort((a, b) => b.time - a.time));
      } else {
        setAlerts([]);
      }
    }, (error) => {
      console.error("Firebase Logs Error:", error);
    });

    return () => {
      unsubscribeDevices();
      unsubscribeLogs();
    };
  }, []);

  return { stats, nodes, alerts, loading };
};
