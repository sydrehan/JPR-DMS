import React from 'react';
import { useFirebaseNodes, useFirebaseLogs } from '../../hooks/useFirebaseData';
import { Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';

export const FirebaseDataPanel = () => {
    const { nodes, loading: nodesLoading } = useFirebaseNodes();
    const { logs, loading: logsLoading } = useFirebaseLogs();

    if (nodesLoading || logsLoading) {
        return <div className="p-8 text-center text-slate-500">Loading Live Data...</div>;
    }

    const nodeList = Object.entries(nodes).map(([key, value]) => ({
        id: key,
        ...value
    }));

    // Combine and sort logs
    const criticalLogs = Object.entries(logs.critical || {}).map(([key, value]) => ({ id: key, category: 'critical', ...value }));
    const rescueLogs = Object.entries(logs.rescue || {}).map(([key, value]) => ({ id: key, category: 'rescue', ...value }));
    const receiverLogs = Object.entries(logs.receiver || {}).map(([key, value]) => ({ id: key, category: 'receiver', ...value }));
    
    const allLogs = [...criticalLogs, ...rescueLogs, ...receiverLogs].sort((a, b) => b.timestamp - a.timestamp).slice(0, 50); // Show last 50

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[500px]">
            {/* Left: Device Status */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-blue-500" />
                        Live Device Status
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 sticky top-0">
                            <tr>
                                <th className="px-4 py-3">Device Name</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Last Seen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {nodeList.map(node => (
                                <tr key={node.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-gray-200">{node.id}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            node.status === 'ONLINE' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                            {node.status === 'ONLINE' ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                                            {node.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-slate-500 font-mono text-xs">
                                        {node.last_seen ? new Date(node.last_seen).toLocaleTimeString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                             {nodeList.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-4 py-8 text-center text-slate-400 italic">
                                        No active devices found.
                                    </td>
                                </tr>
                             )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right: Live Logs */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
                 <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        Live Sensor Logs
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-0">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allLogs.map(log => (
                            <div key={log.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3">
                                <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                    log.category === 'critical' 
                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30' 
                                        : log.category === 'rescue'
                                            ? 'bg-green-100 text-green-600 dark:bg-green-900/30'
                                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                                }`}>
                                    {log.category === 'critical' ? <AlertTriangle className="w-4 h-4" /> : log.category === 'rescue' ? <CheckCircle className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium text-slate-900 dark:text-gray-200 text-sm">{log.message || "Unknown Event"}</p>
                                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                            <Clock className="w-3 h-3" />
                                            {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : '--:--'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1 rounded">Src: {log.sender}</span>
                                        {log.route && <span className="font-mono text-xs">Route: {log.route}</span>}
                                        {log.type && <span className="uppercase font-bold text-[10px] tracking-wider">{log.type}</span>}
                                        {log.master_rssi && <span className="ml-auto font-mono text-[10px]">RSSI: {log.master_rssi}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                         {allLogs.length === 0 && (
                            <div className="p-8 text-center text-slate-400 italic">
                                No recent logs available.
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};
