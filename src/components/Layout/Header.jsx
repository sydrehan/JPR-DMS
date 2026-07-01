import React from 'react';
import { Menu, Bell, User, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8 transition-colors duration-300 shadow-soft">
      <div className="flex items-center space-x-4">
        <motion.button
          onClick={toggleSidebar}
          className="lg:hidden p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus:outline-none rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu className="w-6 h-6" />
        </motion.button>

        {/* Search Bar - Responsive */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-700/50 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-accent transition-all">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <input 
            type="text"
            placeholder="Search..."
            className="bg-transparent ml-2 text-sm outline-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 w-32"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        <ThemeToggle />
        
        {/* Notification Bell */}
        <motion.button 
          className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5" />
          <motion.span 
            className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4 md:pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.displayName || 'Admin User'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.role || 'Tower Manager'}
            </p>
          </div>
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-soft hover:shadow-soft-md transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {user?.displayName?.charAt(0) || 'A'}
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
