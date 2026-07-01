import React from 'react';
import { Package, Battery, Thermometer } from 'lucide-react';

export const InventoryPanel = () => {
  const inventory = [
    { id: 'J001', type: 'Smart Jacket', status: 'Charged', battery: 98 },
    { id: 'J002', type: 'Smart Jacket', status: 'Charged', battery: 95 },
    { id: 'J003', type: 'Smart Jacket', status: 'Charging', battery: 45 },
    { id: 'J004', type: 'Smart Jacket', status: 'Maintenance', battery: 0 },
    { id: 'K001', type: 'First Aid Kit', status: 'Full', battery: null },
  ];

  return (
    <div className="bg-panel-bg rounded-lg border border-slate-700 p-6">
      <h3 className="text-white font-bold mb-6 flex items-center">
        <Package className="w-5 h-5 mr-2 text-blue-400" />
        Rescue Box Inventory
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 rounded-l-lg">ID</th>
              <th className="px-4 py-3">Item Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 rounded-r-lg">Battery</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                <td className="px-4 py-3 font-medium text-white">{item.id}</td>
                <td className="px-4 py-3 text-slate-300">{item.type}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'Charged' || item.status === 'Full' ? 'bg-green-500/10 text-green-500' :
                    item.status === 'Charging' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {item.battery !== null ? (
                    <div className="flex items-center">
                      <Battery className="w-4 h-4 mr-2 text-slate-500" />
                      {item.battery}%
                    </div>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
