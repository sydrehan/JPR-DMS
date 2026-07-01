import React from 'react';
import { motion } from 'framer-motion';
import { TerminalConsole } from '../components/LoRaConsole/Terminal';
import { Command } from 'lucide-react';

export const LoRaGateway = () => {
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
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Command className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              LoRaWAN Console
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-12">
            Direct packet inspection, system diagnostics, and gateway command interface
          </p>
        </div>
      </motion.div>

      {/* Terminal */}
      <motion.div 
        className="flex-1 min-h-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="card h-full">
          <TerminalConsole />
        </div>
      </motion.div>
    </motion.div>
  );
};
