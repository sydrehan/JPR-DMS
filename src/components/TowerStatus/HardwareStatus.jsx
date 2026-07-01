import React from 'react';
import { Printer, Monitor, Siren, Radio, Wifi } from 'lucide-react';

const HardwareItem = ({ icon: Icon, label, status, detail }) => (
  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
    <div className="flex items-center">
      <div className={`p-2 rounded-lg mr-4 ${status === 'online' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-white font-medium">{label}</h4>
        <p className="text-xs text-slate-400">{detail}</p>
      </div>
    </div>
    <div className="flex items-center">
      <span className={`w-2 h-2 rounded-full mr-2 ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
      <span className={`text-sm uppercase font-bold ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
        {status}
      </span>
    </div>
  </div>
);

export const HardwareStatus = ({ activeAlert = false }) => {
  return (
    <div className="bg-panel-bg rounded-lg border border-slate-700 p-6">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-white font-bold">Hardware Peripherals</h3>
        
        {/* Physical Tower Light Indicator */}
        <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-lg border border-slate-700">
           <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Tower Lights</span>
           <div className="flex gap-2">
              {/* Red Light */}
              <div className={`w-4 h-4 rounded-full border border-red-900 transition-all duration-300 ${activeAlert ? 'bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse' : 'bg-red-900/20'}`}></div>
              {/* Green Light */}
              <div className={`w-4 h-4 rounded-full border border-green-900 transition-all duration-300 ${!activeAlert ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-green-900/20'}`}></div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <HardwareItem 
          icon={Printer} 
          label="Thermal Printer" 
          status="online" 
          detail="Ready / Paper OK" 
        />
        <HardwareItem 
          icon={Monitor} 
          label="Public Display" 
          status="online" 
          detail="HDMI-1 / 1080p" 
        />
        <HardwareItem 
          icon={Siren} 
          label="Emergency Siren" 
          status="online" 
          detail={activeAlert ? "ACTIVE - WARNING" : "Standby Mode"} 
        />
        <HardwareItem 
          icon={Radio} 
          label="LoRa Transceiver" 
          status="online" 
          detail="SX1278 / 433MHz" 
        />
        <HardwareItem 
          icon={Wifi} 
          label="Local Wi-Fi AP" 
          status="online" 
          detail="SSID: DIT_Rescue_Net" 
        />
      </div>
    </div>
  );
};
