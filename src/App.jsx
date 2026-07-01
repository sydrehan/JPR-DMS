import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { ThemeProvider } from './context/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';
import Layout from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MeshNetwork } from './pages/MeshNetwork';
import { LoRaGateway } from './pages/LoRaGateway';
import { TowerMonitor } from './pages/TowerMonitor';
import { NodeDetail } from './pages/NodeDetail';
import { EmergencyBroadcast } from './pages/EmergencyBroadcast';
import { AlertHistory } from './pages/AlertHistory';
import { PublicDisplay } from './pages/PublicDisplay';
import { RouteViewer } from './pages/RouteViewer';
import { TrainingCenter } from './pages/TrainingCenter';
import { MockDrills } from './pages/MockDrills';
import { SatelliteLogs } from './pages/SatelliteLogs';
import { Awareness } from './pages/Awareness';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import { FirebaseStatus } from './components/Debug/FirebaseStatus';
import { ReloadPrompt } from './components/ReloadPrompt';

import { OnboardingTour } from './components/Onboarding/OnboardingTour';

// Placeholder components for routes not yet implemented
const Placeholder = ({ title }) => (
  <div className="p-4">
    <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
    <div className="bg-panel-bg p-6 rounded-lg border border-slate-700 text-slate-400">
      Module under development...
    </div>
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <AuthProvider>
      <ThemeProvider>
        <LocationProvider>
        <ReloadPrompt />
        <OnboardingTour />
        <Router>
          <Routes>
            {/* Public Standalone Route - Landing Page */}
            <Route path="/" element={<PublicDisplay />} />
            <Route path="/drills" element={<MockDrills />} />
            <Route path="/training" element={<TrainingCenter />} />
            <Route path="/awareness" element={<Awareness />} />

            {/* Admin Routes with Layout */}
            <Route path="/admin/*" element={
              <div className="flex bg-slate-50 dark:bg-slate-900 h-screen w-screen overflow-hidden text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 transition-colors duration-300">
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                
                {/* Mobile Backdrop for Sidebar */}
                {isSidebarOpen && (
                  <div 
                    className="fixed inset-0 bg-black/50 z-[1900] lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-50 dark:bg-slate-900 relative transition-colors duration-300">
                  <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                  <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">

                    <Routes>
                      <Route index element={<Dashboard />} />
                      <Route path="nodes/:id" element={<NodeDetail />} />
                      <Route path="mesh-network" element={<MeshNetwork />} />
                      <Route path="tower-monitor" element={<TowerMonitor />} />
                      <Route path="lora-gateway" element={<LoRaGateway />} />
                      <Route path="broadcast" element={<EmergencyBroadcast />} />
                      <Route path="alerts" element={<AlertHistory />} />
                      <Route path="satellite-logs" element={<SatelliteLogs />} />
                      <Route path="mock-drills" element={<MockDrills />} />
                      <Route path="training" element={<TrainingCenter />} />
                      {/* Redirect unknown admin routes to dashboard */}
                      <Route path="*" element={<Navigate to="/admin" replace />} />
                    </Routes>
                  </div>
                </main>
                <FirebaseStatus />
              </div>
            } />
            
            {/* Catch all for non-admin routes -> Redirect to Public Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LocationProvider>
    </ThemeProvider>
  </AuthProvider>
  );
}

export default App;
