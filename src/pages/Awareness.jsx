import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, Shield, Wind, Zap, Activity, Droplets, Flame, Mountain, ArrowRight, X, CheckCircle, XCircle } from 'lucide-react';
import { MobileBottomNav } from '../components/Layout/MobileBottomNav';
import { useTranslation } from 'react-i18next';

export const Awareness = () => {
    const { t } = useTranslation();
    const [selectedDisaster, setSelectedDisaster] = useState(null);

    const disasters = [
        { 
            id: 'cyclone',
            icon: Wind, 
            color: 'text-blue-500', 
            bg: 'bg-blue-500/10'
        },
        { 
            id: 'earthquake',
            icon: Activity, 
            color: 'text-orange-500', 
            bg: 'bg-orange-500/10'
        },
        { 
            id: 'lightning',
            icon: Zap, 
            color: 'text-yellow-500', 
            bg: 'bg-yellow-500/10'
        },
        { 
            id: 'flood',
            icon: Droplets, 
            color: 'text-cyan-500', 
            bg: 'bg-cyan-500/10'
        },
        { 
            id: 'fire',
            icon: Flame, 
            color: 'text-red-500', 
            bg: 'bg-red-500/10'
        },
        { 
            id: 'landslide',
            icon: Mountain, 
            color: 'text-stone-500', 
            bg: 'bg-stone-500/10'
        }
    ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 pb-24 md:pb-0">
        
        {/* Simple Header for navigation back */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl">
                 <ArrowRight className="w-4 h-4 rotate-180" /> {t('drills.back_web')}
            </Link>
            <h1 className="text-xl font-bold ml-4 border-l pl-6 border-slate-200 dark:border-slate-700">{t('awareness.title')}</h1>
        </header>

      <div className="max-w-6xl mx-auto p-6">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white mb-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl font-black mb-4 leading-tight">{t('awareness.hero_title')}</h2>
                <p className="text-blue-100 text-lg leading-relaxed opacity-90">
                    {t('awareness.hero_desc')}
                </p>
            </div>
            <Shield className="absolute bottom-[-40px] right-[-40px] w-80 h-80 text-white/10 rotate-12" />
        </div>

        <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-blue-500" />
            <h3 className="text-2xl font-bold">{t('awareness.library')}</h3>
        </div>

        {/* Grid of Disasters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disasters.map((item) => (
                <button 
                    key={item.id} 
                    onClick={() => setSelectedDisaster(item)}
                    className="group text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 relative overflow-hidden"
                >
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className="w-7 h-7" />
                    </div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{t(`disasters.${item.id}.title`)}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{t(`disasters.${item.id}.desc`)}</p>
                    <div className="flex items-center text-xs font-bold text-blue-500 uppercase tracking-wider opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                        {t('awareness.view_guide')} <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                </button>
            ))}
        </div>

        {/* Info Footer */}
        <div className="mt-12 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
                {t('awareness.source')} <br/>
                Always follow local authorities' instructions during an actual emergency.
            </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDisaster && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${selectedDisaster.bg} ${selectedDisaster.color} flex items-center justify-center`}>
                            <selectedDisaster.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t(`disasters.${selectedDisaster.id}.title`)}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Safety Protocol & Guidelines</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedDisaster(null)}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
                    
                    {/* Immediate Action Banner */}
                    <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-6 rounded-r-xl mb-8">
                        <h4 className="text-red-700 dark:text-red-400 font-bold uppercase tracking-wider text-xs mb-2">{t('awareness.immediate')}</h4>
                        <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                            {t(`disasters.${selectedDisaster.id}.content.immediate`)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {/* Before */}
                        <div>
                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-500">1</span>
                                {t('awareness.before')}
                            </h4>
                            <ul className="space-y-3">
                                {t(`disasters.${selectedDisaster.id}.content.before`, { returnObjects: true }).map((step, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* During */}
                        <div>
                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-black text-blue-600 dark:text-blue-400">2</span>
                                {t('awareness.during')}
                            </h4>
                            <ul className="space-y-3">
                                {t(`disasters.${selectedDisaster.id}.content.during`, { returnObjects: true }).map((step, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* After */}
                        <div>
                            <h4 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-black text-green-600 dark:text-green-400">3</span>
                                {t('awareness.after')}
                            </h4>
                            <ul className="space-y-3">
                                {t(`disasters.${selectedDisaster.id}.content.after`, { returnObjects: true }).map((step, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Dos and Donts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-6 border border-green-100 dark:border-green-900/20">
                            <h4 className="flex items-center gap-2 font-bold text-green-700 dark:text-green-400 mb-4">
                                <CheckCircle className="w-5 h-5" /> {t('awareness.dos')}
                            </h4>
                            <ul className="space-y-2">
                                {t(`disasters.${selectedDisaster.id}.content.dos`, { returnObjects: true }).map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="text-green-500 font-bold">✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/20">
                            <h4 className="flex items-center gap-2 font-bold text-red-700 dark:text-red-400 mb-4">
                                <XCircle className="w-5 h-5" /> {t('awareness.donts')}
                            </h4>
                            <ul className="space-y-2">
                                {t(`disasters.${selectedDisaster.id}.content.donts`, { returnObjects: true }).map((item, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="text-red-500 font-bold">✕</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>

            </div>
        </div>
      )}
      <MobileBottomNav active="guide" />
    </div>
  );
};
