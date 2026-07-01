import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ArrowLeft, Shield } from 'lucide-react';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password);
      navigate('/admin');
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    }
    setLoading(false);
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
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-30" />
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
          <div className="px-8 py-8 bg-gradient-to-r from-accent to-blue-600 dark:from-accent dark:to-blue-700 text-center border-b border-slate-200 dark:border-slate-700">
            <motion.div
              className="w-16 h-16 bg-white/10 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Create Account</h1>
            <p className="text-blue-100 text-sm font-medium">Join the Disaster Management Network</p>
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
              <input
                type="email"
                required
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            {/* Password Field */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Password
              </label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            {/* Confirm Password Field */}
            <motion.div className="space-y-2" variants={itemVariants}>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                Confirm Password
              </label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
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
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, linear: true }}
                    className="w-5 h-5"
                  >
                    <UserPlus className="w-5 h-5" />
                  </motion.div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register Now
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 text-center space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-accent dark:text-blue-400 hover:underline">
                Sign In
              </Link>
            </p>
            <Link to="/" className="inline-flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm gap-1 font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Public Display
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
