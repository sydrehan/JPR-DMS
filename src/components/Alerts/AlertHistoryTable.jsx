import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, AlertTriangle, UserMinus, WifiOff, Activity, ChevronDown } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { useDashboardData } from '../../hooks/useDashboardData';

export const AlertHistoryTable = () => {
  const { alerts } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredData = alerts.filter(item => {
    const matchesSearch = (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (item.sender && item.sender.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterSeverity === 'ALL' || item.severity === filterSeverity;
    return matchesSearch && matchesFilter;
  });

  const getSeverityBadge = (severity) => {
    const styles = {
      critical: 'badge-danger',
      high: 'badge-warning',
      medium: 'badge-info',
      low: 'badge-success',
    };
    return (
      <span className={`${styles[severity] || styles.low} uppercase text-xs font-semibold`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="card flex flex-col h-full">
      {/* Controls Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        {/* Search Box */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by message or node ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="input-field pr-10 appearance-none"
            >
              <option value="ALL">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 dark:text-slate-400 pointer-events-none" />
          </div>
          
          <motion.button 
            className="btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </motion.button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Severity</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Node ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs font-mono">
                    {formatDate(item.time)}
                  </td>
                  <td className="px-6 py-4">{getSeverityBadge(item.severity)}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{item.type}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-mono">{item.sender}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 max-w-xs truncate">{item.message}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No alerts found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filter criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
