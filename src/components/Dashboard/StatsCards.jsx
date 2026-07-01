import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Radio, Activity, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color, bg, delay = 0 }) => (
  <motion.div 
    className="card group cursor-pointer"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)' }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${bg} group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider ${bg} ${color}`}>
        LIVE
      </div>
    </div>
    
    <h3 className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
      {title}
    </h3>
    
    <div className="flex items-end gap-2">
      <span className="text-4xl font-bold text-slate-900 dark:text-white font-heading">
        {value}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">
        {subtext}
      </span>
    </div>
    
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-1 text-xs font-medium text-success">
        <TrendingUp className="w-3.5 h-3.5" />
        All Systems Operational
      </div>
    </div>
  </motion.div>
);

export const StatsCards = ({ stats }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <StatCard
        title="Active Nodes"
        value={stats.total}
        subtext="Online"
        icon={Radio}
        color="text-blue-600 dark:text-blue-400"
        bg="bg-blue-100 dark:bg-blue-900/30"
        delay={0}
      />
      <StatCard
        title="Safe Status"
        value={stats.safe}
        subtext="Secure"
        icon={ShieldCheck}
        color="text-success dark:text-green-400"
        bg="bg-green-100 dark:bg-green-900/30"
        delay={0.1}
      />
      <StatCard
        title="Critical Alerts"
        value={stats.help}
        subtext="Immediate"
        icon={AlertTriangle}
        color="text-danger dark:text-red-400"
        bg="bg-red-100 dark:bg-red-900/30"
        delay={0.2}
      />
      <StatCard
        title="Warnings"
        value={stats.trouble}
        subtext="Offline"
        icon={Activity}
        color="text-warning dark:text-yellow-400"
        bg="bg-yellow-100 dark:bg-yellow-900/30"
        delay={0.3}
      />
    </motion.div>
  );
};
