import React from 'react';
import { motion } from 'framer-motion';
import { CommandPanel } from '../components/Broadcast/CommandPanel';
import { AlertCircle } from 'lucide-react';

export const EmergencyBroadcast = () => {
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
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-danger/10 dark:bg-danger/20 rounded-lg border border-danger/50">
              <AlertCircle className="w-6 h-6 text-danger" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Emergency Broadcast
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-12">
            Critical alert distribution system for mass notifications, evacuation orders, and emergency directives
          </p>
        </div>
      </motion.div>

      {/* Command Panel */}
      <motion.div 
        className="flex-1 min-h-0 overflow-y-auto custom-scrollbar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CommandPanel />
      </motion.div>
    </motion.div>
  );
};
