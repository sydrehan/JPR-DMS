import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Battery, Signal, MapPin, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: { color: '#94a3b8' }
    },
    title: {
      display: true,
      text: 'Battery Discharge History',
      color: '#fff'
    },
  },
  scales: {
    y: {
      grid: { color: '#334155' },
      ticks: { color: '#94a3b8' }
    },
    x: {
      grid: { color: '#334155' },
      ticks: { color: '#94a3b8' }
    }
  }
};

const data = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'Battery Level (%)',
      data: [100, 95, 88, 76, 65, 50, 42],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
    },
  ],
};

export const NodeDetailView = ({ nodeId }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-panel-bg p-6 rounded-lg border border-slate-700">
          <h3 className="text-slate-400 text-sm uppercase mb-2">Device Status</h3>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span className="text-2xl font-bold text-white">ONLINE</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Last seen: 2 seconds ago</p>
        </div>
        
        <div className="bg-panel-bg p-6 rounded-lg border border-slate-700">
          <h3 className="text-slate-400 text-sm uppercase mb-2">Battery Health</h3>
          <div className="flex items-center">
            <Battery className="w-6 h-6 text-green-500 mr-2" />
            <span className="text-2xl font-bold text-white">42%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Est. runtime: 14 hours</p>
        </div>

        <div className="bg-panel-bg p-6 rounded-lg border border-slate-700">
          <h3 className="text-slate-400 text-sm uppercase mb-2">Signal Strength</h3>
          <div className="flex items-center">
            <Signal className="w-6 h-6 text-yellow-500 mr-2" />
            <span className="text-2xl font-bold text-white">-85 dBm</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Mesh Hops: 2</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-panel-bg p-6 rounded-lg border border-slate-700">
          <Line options={options} data={data} />
        </div>

        <div className="bg-panel-bg p-6 rounded-lg border border-slate-700">
          <h3 className="text-white font-bold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Recent Activity Log
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start border-b border-slate-800 pb-2">
                <span className="text-xs text-slate-500 w-16 mt-1">14:3{i} PM</span>
                <div>
                  <p className="text-sm text-slate-300">Heartbeat received via Node {i > 2 ? 'N002' : 'Master'}</p>
                  <p className="text-xs text-slate-600">RSSI: -{80 + i} dBm</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
