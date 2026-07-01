import React from 'react';
import { useParams } from 'react-router-dom';
import { NodeDetailView } from '../components/NodeCard/NodeDetailView';
import { Radio } from 'lucide-react';

export const NodeDetail = () => {
  const { id } = useParams();
  const nodeId = id || 'N001'; // Default for demo if no ID provided

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Radio className="w-8 h-8 mr-3 text-blue-500" />
          Node Diagnostics: {nodeId}
        </h2>
        <p className="text-slate-400 mt-1">Individual device telemetry and sensor history</p>
      </div>

      <div className="flex-1 min-h-0">
        <NodeDetailView nodeId={nodeId} />
      </div>
    </div>
  );
};
