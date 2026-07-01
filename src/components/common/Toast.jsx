import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    critical: 'bg-gradient-to-r from-danger to-red-700 text-white shadow-lg shadow-danger/30 border-danger/50',
    high: 'bg-gradient-to-r from-warning to-yellow-600 text-white shadow-lg shadow-warning/30 border-warning/50',
    info: 'bg-gradient-to-r from-accent to-blue-700 text-white shadow-lg shadow-accent/30 border-accent/50',
    success: 'bg-gradient-to-r from-success to-green-700 text-white shadow-lg shadow-success/30 border-success/50'
  };

  const icons = {
    critical: <AlertCircle className="w-6 h-6 flex-shrink-0" />,
    high: <AlertTriangle className="w-6 h-6 flex-shrink-0" />,
    info: <Info className="w-6 h-6 flex-shrink-0" />,
    success: <CheckCircle className="w-6 h-6 flex-shrink-0" />
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`
            fixed top-6 right-6 z-[9999] flex items-start gap-4 p-5 rounded-xl border
            backdrop-blur-sm max-w-sm
            ${styles[type] || styles.info}
          `}
          initial={{ opacity: 0, x: 400, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 400 }}
          transition={{ type: 'spring', stiffness: 100, damping: 25 }}
        >
          <div className="flex-1">
            <div className="flex items-start gap-3">
              {icons[type] || icons.info}
              <div className="flex-1">
                <p className="font-semibold text-sm uppercase tracking-wide">{type} Alert</p>
                <p className="text-sm font-medium mt-1 line-clamp-3">{message}</p>
              </div>
            </div>
          </div>
          <motion.button 
            onClick={() => setIsVisible(false)}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
