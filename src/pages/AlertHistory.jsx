import React from 'react';
import { motion } from 'framer-motion';
import { AlertHistoryTable } from '../components/Alerts/AlertHistoryTable';
import { History, AlertTriangle } from 'lucide-react';

export const AlertHistory = () => {
  return (
    <motion.div 
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Page Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
            Alert History
          </h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-2 ml-12">
          Complete historical record of all critical events, warnings, and system alerts
        </p>
      </motion.div>

      {/* Table Container */}
      <motion.div 
        className="flex-1 min-h-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AlertHistoryTable />
      </motion.div>
    </motion.div>
  );
};
