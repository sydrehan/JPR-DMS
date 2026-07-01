import React, { useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: 'master', position: { x: 250, y: 0 }, data: { label: 'Master Node (Tower)' }, style: { background: '#ef4444', color: 'white', border: 'none', width: 180 } },
  { id: 'n1', position: { x: 100, y: 150 }, data: { label: 'Node 1 (Jacket)' }, style: { background: '#1e293b', color: 'white', border: '1px solid #334155' } },
  { id: 'n2', position: { x: 400, y: 150 }, data: { label: 'Node 2 (Jacket)' }, style: { background: '#1e293b', color: 'white', border: '1px solid #334155' } },
  { id: 'n3', position: { x: 250, y: 300 }, data: { label: 'Node 3 (Jacket)' }, style: { background: '#1e293b', color: 'white', border: '1px solid #334155' } },
  { id: 'n4', position: { x: 100, y: 450 }, data: { label: 'Node 4 (SOS)' }, style: { background: '#ef4444', color: 'white', border: '2px solid white', animation: 'pulse 2s infinite' } },
];

const initialEdges = [
  { id: 'e1-m', source: 'n1', target: 'master', animated: true, label: '-85dBm', style: { stroke: '#22c55e' } },
  { id: 'e2-m', source: 'n2', target: 'master', animated: true, label: '-92dBm', style: { stroke: '#eab308' } },
  { id: 'e3-n1', source: 'n3', target: 'n1', animated: true, label: '-78dBm', style: { stroke: '#22c55e' } },
  { id: 'e3-n2', source: 'n3', target: 'n2', animated: true, label: '-80dBm', style: { stroke: '#22c55e' } },
  { id: 'e4-n3', source: 'n4', target: 'n3', animated: true, label: '-95dBm', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#ef4444', strokeWidth: 2 } },
];

export const NetworkGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-[600px] bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#334155" gap={16} />
        <Controls className="bg-slate-800 border-slate-700 fill-white text-white" />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            return '#fff';
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;
            return '#fff';
          }}
          maskColor="rgba(15, 23, 42, 0.8)"
          className="bg-slate-800 border border-slate-700"
        />
      </ReactFlow>
    </div>
  );
};
