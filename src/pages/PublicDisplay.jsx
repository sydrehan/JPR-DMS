import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SafetyStatus } from '../components/PublicDisplay/SafetyStatus';
import { SafetyCategories } from '../components/PublicDisplay/SafetyCategories';
import { DisasterMap } from '../components/Map/DisasterMap';
import { EmergencyContactsModal } from '../components/PublicDisplay/EmergencyContactsModal';
import { fetchDisasterAlerts } from '../services/disasterService';
import { MonitorPlay, AlertTriangle, Shield, Phone, Activity, User, Home, BookOpen, Video, Layout, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/Layout/ThemeToggle';
import { MobileBottomNav } from '../components/Layout/MobileBottomNav';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/Layout/LanguageSwitcher';
import { AiAssistantModal } from '../components/PublicDisplay/AiAssistantModal';

export const PublicDisplay = () => {
  const [time, setTime] = useState(new Date());
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showContacts, setShowContacts] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await fetchDisasterAlerts();
      setAlerts(data);
      setLoading(false);
    };
    loadAlerts();
    const interval = setInterval(loadAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Unify Alerts for Display (Sort by severity)
  const allAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });

  const criticalAlert = allAlerts.find(a => a.severity === 'critical');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative transition-colors duration-300 overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0">
      {/* Main Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-3 lg:py-4 flex flex-row justify-between items-center sticky top-0 z-40 transition-colors duration-300 gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
           <img src="/logo.svg" alt="ResQ Logo" className="w-8 h-8 hidden" /> {/* Placeholder if logo exists */}
           <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              RES<span className="text-red-600">Q</span>
           </h1>
        </div>

        <nav className="hidden lg:flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          <Link to="/drills" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold whitespace-nowrap transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
            {t('nav.drills')}
          </Link>
          <Link to="/training" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold whitespace-nowrap transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
            {t('nav.videos')}
          </Link>
          <Link to="/awareness" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold whitespace-nowrap transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
            {t('nav.guide')}
          </Link>
          <button onClick={() => setShowContacts(true)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold whitespace-nowrap transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
            {t('nav.contacts')}
          </button>
          <button 
            onClick={() => setIsChatOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            AI Assistant
          </button>
          <button 
            onClick={() => document.getElementById('live-alerts-feed')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 group"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse group-hover:bg-red-200"></span>
            {t('nav.alerts')}
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
           {/* User Profile (Visual Only) */}
           <div className="hidden md:flex items-center gap-2 text-right">
              <div className="w-8 h-8 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                 <div className="text-xs font-bold text-slate-900 dark:text-white">{t('header.citizen')}</div>
                 <div className="text-[10px] text-slate-500 dark:text-slate-400">{t('header.location')}</div>
              </div>
           </div>
           
           <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>
           <LanguageSwitcher />
           <ThemeToggle />
        </div>
      </header>

      {/* Infinite Live Ticker - Moved Below Header */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          .animate-scroll {
            animation: scroll 300s linear infinite;
          }
        `}
      </style>
      <div className="bg-red-600/90 backdrop-blur-sm text-white text-sm font-bold py-2.5 px-0 flex items-center gap-4 z-30 shadow-md border-b border-red-700 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 bg-red-700/80 px-4 flex items-center z-10 font-black tracking-wider shadow-xl dark:shadow-none h-full">
          {t('dashboard.live_alerts_ticker')}
        </div>
        <div className="flex overflow-hidden ml-32 mask-image-linear-gradient">
          <div className="animate-scroll flex shrink-0 items-center whitespace-nowrap gap-4 px-4">
             {allAlerts.length > 0 
              ? allAlerts.slice(0, 10).map((a, i) => {
                  return <span key={i} className="inline-flex items-center">🚨 {a.title.toUpperCase()} • </span>;
                })
              : <span className="inline-flex items-center">✅ {t('dashboard.no_active_ticker')} •</span>
            }
          </div>
          <div className="animate-scroll flex shrink-0 items-center whitespace-nowrap gap-4 px-4">
             {allAlerts.length > 0 
              ? allAlerts.slice(0, 10).map((a, i) => {
                  return <span key={`dup-${i}`} className="inline-flex items-center">🚨 {a.title.toUpperCase()} • </span>;
                })
              : <span className="inline-flex items-center">✅ {t('dashboard.no_active_ticker')} •</span>
            }
          </div>
        </div>
      </div>

      {/* Main Content Grid - Responsive: Scroll on mobile, Fixed on Desktop */}
      <main className="flex-1 p-4 lg:p-6 h-auto lg:h-[calc(100vh-140px)] overflow-y-auto lg:overflow-hidden">
        <div className="grid grid-cols-12 gap-6 h-full">
          
          {/* LEFT COLUMN: Status & Actions (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-auto lg:h-full lg:overflow-y-auto lg:pr-2 custom-scrollbar">
             {/* Main Safety Status Banner (YOU ARE SAFE) */}
             {/* Passing alerts to enable 20km radius check */}
             <SafetyStatus alerts={allAlerts} />

             {/* Safety Categories Grid */}
             <SafetyCategories />

             {/* Quick Actions Card (Moved from Right) */}
             <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
               <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{t('dashboard.quick_actions')}</h3>
               <div className="space-y-3">
                 <Link to="/drills" className="block w-full py-3 px-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-center font-bold rounded-xl transition-colors shadow-lg shadow-slate-900/10">
                   {t('dashboard.take_drill')}
                 </Link>
                 <Link to="/training" className="block w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white text-center font-bold rounded-xl transition-colors shadow-lg shadow-orange-500/20">
                   {t('dashboard.watch_video')}
                 </Link>
                  <button onClick={() => setShowContacts(true)} className="block w-full py-3 px-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 text-center font-bold rounded-xl transition-colors">
                    {t('dashboard.view_contacts')}
                  </button>
               </div>
             </div>
          </div>

          {/* RIGHT COLUMN: Map & Alerts (8 cols) - Split View */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 h-auto lg:h-full">
              
              {/* TOP: Disaster Map */}
              <div className="h-[450px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-colors duration-300 shrink-0">
                  <DisasterMap alerts={allAlerts} />
                  
                  {/* Overlay Stats on Map */}
                  <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-4 pointer-events-none">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg pointer-events-auto transition-colors duration-300">
                      <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">{t('dashboard.total_alerts')}</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">{allAlerts.length}</div>
                    </div>
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg pointer-events-auto transition-colors duration-300">
                      <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">{t('dashboard.safe_zones')}</div>
                      <div className="text-xl font-bold text-green-600 dark:text-green-500">1,240</div>
                    </div>
                  </div>
              </div>

              {/* BOTTOM: Live Alerts Feed */}
              <div id="live-alerts-feed" className="flex-1 min-h-[300px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col transition-colors duration-300">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 shrink-0 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     {t('dashboard.live_alerts_feed')}
                  </h3>
                  <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                     {allAlerts.length > 0 ? (
                        allAlerts.map(alert => (
                          <div key={alert.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-l-4 border-l-red-500 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{alert.title}</h4>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{alert.description}</p>
                            <div className="mt-1.5 text-[10px] text-slate-400 font-mono text-right">
                              {new Date(alert.time).toLocaleTimeString()}
                            </div>
                          </div>
                        ))
                     ) : (
                        <div className="text-center py-6 text-slate-400 text-sm">
                           {t('dashboard.no_alerts_feed')}
                        </div>
                     )}
                  </div>
              </div>

          </div>

        </div>
      </main>
      <EmergencyContactsModal isOpen={showContacts} onClose={() => setShowContacts(false)} />

      {/* Floating AI Mascot Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 right-6 z-50 p-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-full transition-all shadow-2xl flex items-center gap-2 group cursor-pointer border border-slate-700/50 hover:scale-105"
      >
        <div className="relative">
          <img 
            src="/resq_assistant.png" 
            alt="Mascot" 
            className="w-8 h-8 object-contain"
            onError={(e) => { e.target.src = 'https://raw.githubusercontent.com/lucide-react/lucide/main/icons/bot.svg'; }}
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 dark:border-slate-800 rounded-full"></span>
        </div>
        <span className="text-xs font-bold tracking-wider max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out whitespace-nowrap">
          ASK RESQ AI
        </span>
      </button>

      <AiAssistantModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <MobileBottomNav active="home" />
    </div>
  );
};
