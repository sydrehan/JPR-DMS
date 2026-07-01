import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDrillResults } from '../../services/drillService';
import { Award, Users, CheckCircle, Clock, PieChart, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatBox = ({ title, value, icon: Icon, color, bg, delay }) => (
  <motion.div
    className="card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <TrendingUp className="w-4 h-4 text-success" />
    </div>
    
    <h3 className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
      {title}
    </h3>
    <div className="text-3xl font-bold text-slate-900 dark:text-white font-heading">
      {value}
    </div>
  </motion.div>
);

export const DrillStats = () => {
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalDrills: 0,
    avgScore: 0,
    topDrill: 'N/A',
    categoryAggregates: {}
  });

  useEffect(() => {
    const unsubscribe = getDrillResults((data) => {
      setResults(data);

      if (data.length > 0) {
        const total = data.length;
        const avg = data.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions) * 100, 0) / total;
        
        const drillCounts = {};
        const catAggs = {};

        data.forEach(r => {
          drillCounts[r.drillTitle] = (drillCounts[r.drillTitle] || 0) + 1;
          
          if (r.categoryScores) {
            Object.entries(r.categoryScores).forEach(([cat, score]) => {
              catAggs[cat] = (catAggs[cat] || 0) + score;
            });
          }
        });

        const topDrill = Object.keys(drillCounts).length > 0 
          ? Object.keys(drillCounts).reduce((a, b) => drillCounts[a] > drillCounts[b] ? a : b)
          : 'N/A';

        setStats({
          totalDrills: total,
          avgScore: Math.round(avg),
          topDrill,
          categoryAggregates: catAggs
        });
      } else {
        setStats({
           totalDrills: 0,
           avgScore: 0,
           topDrill: 'N/A',
           categoryAggregates: {}
        });
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const chartData = {
    labels: Object.keys(stats.categoryAggregates),
    datasets: [
      {
        data: Object.values(stats.categoryAggregates),
        backgroundColor: [
          '#3b82f6', // Blue
          '#10b981', // Green
          '#8b5cf6', // Purple
          '#f59e0b', // Orange
        ],
        borderColor: '#1e293b',
        borderWidth: 2,
      },
    ],
  };

  const formatTime = (seconds) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div 
      className="h-full flex flex-col gap-6 p-6 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatBox
          title="Total Drills"
          value={stats.totalDrills}
          icon={Users}
          color="text-blue-600 dark:text-blue-400"
          bg="bg-blue-100 dark:bg-blue-900/30"
          delay={0}
        />

        <StatBox
          title="Avg. Pass Rate"
          value={`${stats.avgScore}%`}
          icon={Award}
          color="text-success dark:text-green-400"
          bg="bg-green-100 dark:bg-green-900/30"
          delay={0.1}
        />

        <StatBox
          title="Top Drill"
          value={stats.topDrill.substring(0, 12)}
          icon={CheckCircle}
          color="text-purple-600 dark:text-purple-400"
          bg="bg-purple-100 dark:bg-purple-900/30"
          delay={0.2}
        />

        <StatBox
          title="Avg Time"
          value={stats.totalDrills > 0 
            ? formatTime(Math.round(results.reduce((acc, r) => acc + (r.timeTaken || 0), 0) / stats.totalDrills)) 
            : '-'}
          icon={Clock}
          color="text-warning dark:text-yellow-400"
          bg="bg-yellow-100 dark:bg-yellow-900/30"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Community Preparedness Chart */}
        <motion.div 
          className="card flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-heading font-bold">
              Community Preparedness
            </h3>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center">
            {Object.keys(stats.categoryAggregates).length > 0 ? (
              <Doughnut data={chartData} options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { 
                      color: '#94a3b8',
                      padding: 20,
                      font: { size: 12, weight: 500 }
                    }
                  }
                }
              }} />
            ) : (
              <div className="text-slate-500 text-center">No drill data available</div>
            )}
          </div>
        </motion.div>

        {/* Activity Log */}
        <motion.div 
          className="lg:col-span-2 card flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6">
            <h3 className="text-slate-900 dark:text-white font-heading font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-accent rounded"></div>
              Recent Activity Log
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Drill Type</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {results.slice(0, 8).map((result, idx) => {
                  const scorePercent = (result.score / result.totalQuestions);
                  return (
                    <motion.tr 
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                        {result.userName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {result.drillTitle}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          scorePercent >= 0.8 ? 'badge-success' : 
                          scorePercent >= 0.5 ? 'badge-warning' : 
                          'badge-danger'
                        }`}>
                          {result.score}/{result.totalQuestions}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {formatTime(result.timeTaken)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {results.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No drill results available
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
