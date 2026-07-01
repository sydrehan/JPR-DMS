import React from 'react';
import { motion } from 'framer-motion';
import { NetworkGraph } from '../components/MeshGraph/NetworkGraph';
import { Network, Signal } from 'lucide-react';

const SignalLegend = ({ label, color }) => (
  <motion.div 
    className="flex items-center gap-2"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    whileHover={{ scale: 1.05 }}
  >
    <div className={`w-3 h-3 rounded-full ${color}`} />
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
  </motion.div>
);

export const MeshNetwork = () => {
  return (
    <motion.div 
      className="h-full flex flex-col gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-start gap-6 flex-col sm:flex-row"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Network className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">
              Mesh Network Topology
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 ml-12">
            Real-time visualization of node interconnections, signal strength, and network health
          </p>
        </div>

        {/* Signal Legend */}
        <motion.div 
          className="flex gap-6 flex-wrap bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 self-start"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2 w-full">Legend</div>
          <SignalLegend label="Strong Signal" color="bg-success" />
          <SignalLegend label="Weak Signal" color="bg-warning" />
          <SignalLegend label="Offline/Critical" color="bg-danger" />
        </motion.div>
      </motion.div>

      {/* Network Graph */}
      <motion.div 
        className="flex-1 min-h-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="card h-full flex flex-col">
          <NetworkGraph />
        </div>
      </motion.div>
    </motion.div>
  );
};
