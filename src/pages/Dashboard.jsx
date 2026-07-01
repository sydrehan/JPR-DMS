import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDisasterAlerts } from '../services/disasterService';
import { StatsCards } from '../components/Dashboard/StatsCards';
import { LiveMap } from '../components/Map/LiveMap';
import { DisasterMap } from '../components/Map/DisasterMap';
import { AlertFeed } from '../components/Alerts/AlertFeed';
import { DrillStats } from '../components/Dashboard/DrillStats';
import { FirebaseDataPanel } from '../components/Dashboard/FirebaseDataPanel';
import WeatherForecast from '../components/WeatherForecast';
import { useDashboardData } from '../hooks/useDashboardData';
import { useFirebaseLogs } from '../hooks/useFirebaseData';
import { playAlertSound } from '../utils/sound';
import { Loader2, Radio, Activity, CloudRain, Award, Database } from 'lucide-react';
import { Toast } from '../components/common/Toast';

export const Dashboard = () => {
  const { stats, nodes, alerts: systemAlerts, loading } = useDashboardData();
  const { logs } = useFirebaseLogs(); // Get live logs
  const [activeView, setActiveView] = useState('live'); 
  const [disasterAlerts, setDisasterAlerts] = useState([]);
  const [latestAlert, setLatestAlert] = useState(null);
  const lastProcessedRef = React.useRef(Date.now()); // Ref to track last processed timestamp

  useEffect(() => {
    const loadDisasterAlerts = async () => {
      const data = await fetchDisasterAlerts();
      setDisasterAlerts(data);
    };
    loadDisasterAlerts();
  }, []);

  // Monitor for new critical alerts to trigger Toast & Physical Tower Light
  useEffect(() => {
    // 1. Check System Alerts (Existing logic)
    if (systemAlerts.length > 0) {
      const newsest = systemAlerts[0];
      const isRecent = (Date.now() - newsest.time) < 10000; 
      
      if ((newsest.severity === 'critical' || newsest.severity === 'high') && isRecent) {
        setLatestAlert({
            message: `${newsest.type}: ${newsest.message} (${newsest.sender})`,
            type: newsest.severity,
            id: newsest.id
        });
      }
    }

    // 2. Check Firebase Live Logs (New Logic for Popup + Sound)
    if (logs) {
        const allLogs = [
            ...Object.values(logs.critical || {}),
            ...Object.values(logs.rescue || {}),
            ...Object.values(logs.receiver || {})
        ];

        // Find any log that is NEWER than our last check
        const newLogs = allLogs.filter(log => log.timestamp > lastProcessedRef.current);

        if (newLogs.length > 0) {
            // Pick the latest one
            const latest = newLogs.sort((a, b) => b.timestamp - a.timestamp)[0];
            
            // Trigger Sound
            playAlertSound();

            // Trigger Popup
            setLatestAlert({
                message: `ALERT: ${latest.message} (${latest.sender || 'Unknown'})`,
                type: 'critical', // Force red for all loud alerts
                id: `firebase-${latest.timestamp}`
            });

            // Update ref so we don't alert again for this one
            lastProcessedRef.current = latest.timestamp;
        }
    }

  }, [systemAlerts, logs]);

  if (loading) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-full gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">Loading command center...</p>
      </motion.div>
    );
  }

  const tabs = [
    { id: 'live', label: 'Live Network', icon: Radio, color: 'from-blue-500 to-blue-600' },
    { id: 'disaster', label: 'Disaster Alerts', icon: Activity, color: 'from-danger to-red-700' },
    { id: 'weather', label: 'Weather', icon: CloudRain, color: 'from-sky-500 to-sky-600' },
    { id: 'drills', label: 'Drills', icon: Award, color: 'from-purple-500 to-purple-600' },
    { id: 'sensors', label: 'Sensor Data', icon: Database, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <motion.div 
      className="flex flex-col h-auto min-h-screen lg:h-full lg:min-h-0 overflow-visible lg:overflow-hidden gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {latestAlert && (
        <Toast 
          key={latestAlert.id}
          message={latestAlert.message} 
          type={latestAlert.severity} 
          onClose={() => setLatestAlert(null)} 
        />
      )}

      {/* Page Header */}
      <motion.div 
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white">
          Command Center
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Real-time monitoring of disaster resilience infrastructure and emergency response systems
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatsCards stats={stats} />
      </motion.div>

      {/* Tab Buttons */}
      <motion.div
        className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                isActive
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-blue-500/30`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Content Grid */}
      <motion.div 
        className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* Main content area */}
        <div className="col-span-1 lg:col-span-2 h-[500px] lg:h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeView === 'live' && <LiveMap nodes={nodes} />}
              {activeView === 'disaster' && <DisasterMap alerts={disasterAlerts} />}
              {activeView === 'weather' && (
                <div className="h-full w-full">
                  <WeatherForecast />
                </div>
              )}
              {activeView === 'drills' && <DrillStats />}
              {activeView === 'sensors' && <FirebaseDataPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Alert Feed Sidebar */}
        <motion.div 
          className="h-[400px] lg:h-full lg:min-h-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AlertFeed alerts={[...systemAlerts, ...Object.values(logs.critical || {}).map(l => ({...l, severity: 'critical'})), ...Object.values(logs.rescue || {}).map(l => ({...l, severity: 'medium'}))].sort((a,b) => b.timestamp - a.timestamp)} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
