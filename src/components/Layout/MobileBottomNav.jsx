import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Activity, MonitorPlay, Shield, Phone } from 'lucide-react';
import { EmergencyContactsModal } from '../PublicDisplay/EmergencyContactsModal';
import { useTranslation } from 'react-i18next';

export const MobileBottomNav = ({ active }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showContacts, setShowContacts] = useState(false);

  const handleHelp = () => {
    setShowContacts(true);
  };

  const navItems = [
    { id: 'home', label: t('nav.home'), icon: Home, path: '/', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { id: 'drills', label: t('nav.drills'), icon: Activity, path: '/drills' },
    { id: 'videos', label: t('nav.videos'), icon: MonitorPlay, path: '/training' },
    { id: 'guide', label: t('nav.guide'), icon: Shield, path: '/awareness' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 z-50 lg:hidden flex justify-around items-center safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {navItems.map((item) => {
        const isActive = active === item.id;
        return (
          <Link 
            key={item.id}
            to={item.path}
            onClick={active === 'home' && item.id === 'home' ? (e) => { e.preventDefault(); item.action(); } : undefined}
            className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
              isActive 
                ? 'text-blue-600 dark:text-blue-500 transform scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <item.icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
          </Link>
        );
      })}
      
      <button 
        onClick={handleHelp}
        className={`flex flex-col items-center gap-1 p-2 transition-colors duration-200 ${
            active === 'help' || showContacts
            ? 'text-blue-600 dark:text-blue-500' 
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Phone className="w-6 h-6" />
        <span className="text-[10px] font-medium">{t('nav.help')}</span>
      </button>

      <EmergencyContactsModal isOpen={showContacts} onClose={() => setShowContacts(false)} />
    </div>
  );
};
