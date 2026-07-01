import React from 'react';
import { motion } from 'framer-motion';
import { ResourceCard } from '../components/Training/ResourceCard';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MobileBottomNav } from '../components/Layout/MobileBottomNav';

const RESOURCES = [
  { id: 1, title: 'Earthquake Safety Protocol: Drop, Cover, Hold On', type: 'VIDEO', duration: '5:20', thumbnail: 'https://images.unsplash.com/photo-1584036561566-b93a90a6b98c?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'First Aid Basics for Trauma Injuries', type: 'VIDEO', duration: '12:45', thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: 'Flood Evacuation Route Guide', type: 'PDF', duration: '2.4 MB', thumbnail: 'https://images.unsplash.com/photo-1469521669194-babb45f999f1?auto=format&fit=crop&q=80&w=400' },
  { id: 4, title: 'Fire Extinguisher Usage Drill', type: 'VIDEO', duration: '3:15', thumbnail: 'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&q=80&w=400' },
  { id: 5, title: 'Emergency Kit Checklist', type: 'PDF', duration: '1.1 MB', thumbnail: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=400' },
  { id: 6, title: 'CPR Certification Course', type: 'VIDEO', duration: '45:00', thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400' },
];

export const TrainingCenter = () => {
  return (
    <motion.div 
      className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 pb-24 md:pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <header className="mb-12">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Back to Public Display
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white">
                Training Center
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-12">Essential training materials, safety protocols, and disaster preparedness resources</p>
          </motion.div>
        </header>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05, delayChildren: 0.2 }}
        >
          {RESOURCES.map((resource, idx) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ResourceCard {...resource} />
            </motion.div>
          ))}
        </motion.div>
        <MobileBottomNav active="videos" />
      </div>
    </motion.div>
  );
};
