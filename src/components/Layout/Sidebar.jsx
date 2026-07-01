import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Network, 
  Radio, 
  TowerControl, 
  Siren, 
  History, 
  MonitorPlay, 
  Map as MapIcon, 
  BookOpen,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Mesh Network', path: '/admin/mesh-network', icon: Network },
    { name: 'LoRa Gateway', path: '/admin/lora-gateway', icon: Radio },
    { name: 'Tower Monitor', path: '/admin/tower-monitor', icon: TowerControl },
    { name: 'Emergency Broadcast', path: '/admin/broadcast', icon: Siren },
    { name: 'Alert History', path: '/admin/alerts', icon: History },
    { name: 'Public Display', path: '/', icon: MonitorPlay },
    { name: 'QR Route Viewer', path: '/admin/routes', icon: MapIcon },
    { name: 'Training Center', path: '/admin/training', icon: BookOpen },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <motion.aside 
      className="fixed inset-y-0 left-0 z-[2000] w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 lg:static lg:inset-0 transition-colors duration-300 flex flex-col"
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Logo Section */}
      <div className="h-20 bg-gradient-to-r from-slate-900 dark:from-slate-900 to-slate-800 dark:to-slate-900 flex items-center justify-center border-b border-slate-700 dark:border-slate-700">
        <h1 className="text-3xl font-black tracking-tighter text-white">
          RES<span className="text-red-500">Q</span>
        </h1>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-3">
        <div className="space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar && toggleSidebar()}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-soft-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
              </NavLink>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <motion.button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
