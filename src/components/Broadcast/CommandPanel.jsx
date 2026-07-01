import React, { useState } from 'react';
import { Siren, Megaphone, CloudRain, Users, Printer, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { ref, update } from 'firebase/database';
import { db } from '../../firebase/config';

const CommandButton = ({ label, icon: Icon, color, onClick, description }) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden group p-6 rounded-lg border border-slate-700 bg-panel-bg hover:bg-slate-800 transition-all duration-300 text-left`}
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
      <Icon className="w-24 h-24" />
    </div>
    <div className="relative z-10">
      <div className={`p-3 rounded-full w-fit mb-4 ${color.replace('text-', 'bg-')}/10 ${color}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-white font-bold text-lg mb-1">{label}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  </button>
);

export const CommandPanel = () => {
  const [activeAlert, setActiveAlert] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingCommand, setPendingCommand] = useState(null);

  const initiateCommand = (command) => {
    setPendingCommand(command);
    setShowConfirm(true);
  };

  const confirmCommand = () => {
    const commandRef = ref(db, 'commands/broadcast');
    
    // Write command to Firebase
    update(commandRef, {
      trigger: true,
      type: pendingCommand.type,
      label: pendingCommand.label,
      timestamp: Date.now()
    }).then(() => {
      console.log("Broadcast command sent:", pendingCommand);
      setActiveAlert(pendingCommand);
      setShowConfirm(false);
      setPendingCommand(null);
      
      // Simulate auto-clear after 10 seconds for demo (or backend logic should handle it)
      setTimeout(() => {
        setActiveAlert(null);
        // Optional: Reset trigger if no backend does it
        update(commandRef, { trigger: false });
      }, 10000);
    }).catch(error => {
      console.error("Failed to send broadcast:", error);
    });
  };

  return (
    <div className="space-y-6">
      {activeAlert && (
        <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg flex items-center justify-between animate-pulse">
          <div className="flex items-center text-red-500">
            <Siren className="w-6 h-6 mr-3" />
            <span className="font-bold text-lg">BROADCAST ACTIVE: {activeAlert.label}</span>
          </div>
          <button 
            onClick={() => setActiveAlert(null)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-bold text-sm"
          >
            CANCEL BROADCAST
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CommandButton
          label="GLOBAL RED ALERT"
          icon={Siren}
          color="text-disaster-red"
          description="Trigger all sirens and flash red LEDs on all jackets."
          onClick={() => initiateCommand({ label: 'GLOBAL RED ALERT', type: 'critical' })}
        />
        <CommandButton
          label="EVACUATION ORDER"
          icon={Users}
          color="text-orange-500"
          description="Send evacuation route maps to all nodes and public displays."
          onClick={() => initiateCommand({ label: 'EVACUATION ORDER', type: 'high' })}
        />
        <CommandButton
          label="WEATHER WARNING"
          icon={CloudRain}
          color="text-yellow-500"
          description="Broadcast severe weather alert to local area."
          onClick={() => initiateCommand({ label: 'WEATHER WARNING', type: 'medium' })}
        />
        <CommandButton
          label="MOCK DRILL START"
          icon={Megaphone}
          color="text-blue-500"
          description="Initiate training mode. No external alerts sent."
          onClick={() => initiateCommand({ label: 'MOCK DRILL START', type: 'low' })}
        />
        <CommandButton
          label="PRINT MAPS"
          icon={Printer}
          color="text-green-500"
          description="Command DIT thermal printer to print local QR maps."
          onClick={() => initiateCommand({ label: 'PRINT MAPS', type: 'low' })}
        />
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-panel-bg border border-slate-700 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-center mb-6 text-yellow-500">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">Confirm Broadcast</h3>
            <p className="text-slate-400 text-center mb-6">
              Are you sure you want to trigger <span className="text-white font-bold">{pendingCommand?.label}</span>? 
              This will affect all connected devices immediately.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmCommand}
                className="flex-1 py-3 rounded-lg bg-disaster-red hover:bg-red-600 text-white font-bold"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
