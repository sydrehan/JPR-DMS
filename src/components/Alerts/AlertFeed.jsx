import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, WifiOff, UserMinus, Zap } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const AlertItem = ({ alert, index }) => {
  const getIcon = () => {
    switch (alert.type) {
      case 'SOS': return <Zap className="w-5 h-5" />;
      case 'FALL': return <UserMinus className="w-5 h-5" />;
      case 'CONNECTIVITY': return <WifiOff className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getColors = (severity) => {
    switch (severity) {
      case 'critical': 
        return 'border-l-danger bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'high': 
        return 'border-l-warning bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'medium': 
        return 'border-l-accent bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: 
        return 'border-l-slate-400 bg-slate-50 dark:bg-slate-700/20 text-slate-600 dark:text-slate-400';
    }
  };

  const severityColor = {
    critical: 'text-danger',
    high: 'text-warning',
    medium: 'text-accent',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 mb-3 rounded-lg border-l-4 ${getColors(alert.severity)} transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        <motion.div 
          className={`mt-0.5 flex-shrink-0 ${severityColor[alert.severity] || 'text-slate-500'}`}
          animate={{ scale: alert.severity === 'critical' ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.6, repeat: alert.severity === 'critical' ? Infinity : 0 }}
        >
          {getIcon()}
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-sm uppercase tracking-wider">
              {alert.type} Alert
            </h4>
            <span className="text-xs opacity-75 flex-shrink-0 whitespace-nowrap">
              {formatDate(alert.time)}
            </span>
          </div>
          
          <div className="text-xs font-semibold mt-1.5 opacity-90">
            Node: {alert.sender || alert.node || 'Unknown'}
          </div>
          
          <p className="text-sm mt-2 line-clamp-2">
            {alert.message}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export const AlertFeed = ({ alerts }) => {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2 };
    return (severityOrder[a.severity] || 3) - (severityOrder[b.severity] || 3);
  });

  return (
    <div className="card flex flex-col h-full">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Activity className="w-5 h-5 text-danger" />
          </div>
          <h3 className="font-heading font-bold text-slate-900 dark:text-white">
            Live Alert Feed
          </h3>
        </div>
        
        <motion.div 
          className="px-3 py-1 bg-danger/10 text-danger text-xs font-bold rounded-full"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          LIVE
        </motion.div>
      </div>

      {/* Alerts Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
        {sortedAlerts.length === 0 ? (
          <motion.div 
            className="text-center text-slate-500 dark:text-slate-400 py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No active alerts</p>
            <p className="text-xs mt-1">All systems operational</p>
          </motion.div>
        ) : (
          <div className="p-4 space-y-0">
            {sortedAlerts.map((alert, index) => (
              <AlertItem key={alert.id || index} alert={alert} index={index} />
            ))}
          </div>
        )}
      </div>

      {/* Footer - Alert Count */}
      {sortedAlerts.length > 0 && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
          {sortedAlerts.length} active alert{sortedAlerts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
