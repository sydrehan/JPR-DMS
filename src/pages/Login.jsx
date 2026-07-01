import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, Mail, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-danger/10 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Main card */}
      <motion.div
        className="relative max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          variants={itemVariants}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* Header */}
          <div className="px-8 py-8 bg-gradient-to-r from-primary to-slate-800 dark:from-slate-800 dark:to-slate-900 text-center border-b border-slate-200 dark:border-slate-700">
            <motion.div
              className="w-16 h-16 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">ResilienceNet</h1>
            <p className="text-slate-200 text-sm font-medium">Disaster Management Command Center</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Error Alert */}
            {error && (
              <motion.div
                className="bg-danger/10 dark:bg-danger/20 border border-danger/50 text-danger dark:text-red-300 p-4 rounded-lg text-sm font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="admin@resilience.gov.in"
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Access Dashboard
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              🔒 Unauthorized access is a punishable offense under the Disaster Management Act, 2005.
            </p>
          </div>
        </motion.div>

        {/* Bottom text */}
        <motion.p
          className="text-center mt-6 text-slate-300 text-sm"
          variants={itemVariants}
        >
          Secure Government Platform
        </motion.p>
      </motion.div>
    </div>
  );
};
