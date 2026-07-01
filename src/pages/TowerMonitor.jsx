import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import { PowerPanel } from '../components/TowerStatus/PowerPanel';
import { HardwareStatus } from '../components/TowerStatus/HardwareStatus';
import { InventoryPanel } from '../components/TowerStatus/InventoryPanel';
import { TowerControl, AlertCircle } from 'lucide-react';

export const TowerMonitor = () => {
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    const starCountRef = ref(db, 'tower/alert_active');
    const unsubscribe = onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setAlertActive(!!data);
    });
    return () => unsubscribe();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div 
      className="h-full flex flex-col gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-start justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <TowerControl className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Tower Monitor
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-12">
            Disaster Information Tower (DIT) system health, power infrastructure, and equipment inventory
          </p>
        </div>

        {/* Alert Status Badge */}
        {alertActive && (
          <motion.div
            className="px-4 py-3 bg-danger/10 dark:bg-danger/20 border border-danger/50 rounded-lg flex items-center gap-2"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AlertCircle className="w-5 h-5 text-danger animate-pulse" />
            <span className="font-semibold text-sm text-danger dark:text-red-300">Alert Active</span>
          </motion.div>
        )}
      </motion.div>

      {/* Content Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <PowerPanel />
        </motion.div>

        <motion.div variants={itemVariants}>
          <HardwareStatus activeAlert={alertActive} />
        </motion.div>

        <motion.div 
          className="lg:col-span-2"
          variants={itemVariants}
        >
          <InventoryPanel />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
