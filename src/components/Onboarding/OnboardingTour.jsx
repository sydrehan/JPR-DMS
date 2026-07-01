import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check, Globe } from 'lucide-react';

export const OnboardingTour = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('greeting'); // greeting, language, dashboard, alerts, safety, end
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    { text: "Hello", lang: "English" },
    { text: "नमस्ते", lang: "Hindi" },
    { text: "வணக்கம்", lang: "Tamil" },
    { text: "നമസ്കാരം", lang: "Malayalam" },
    { text: "ನಮಸ್ಕಾರ", lang: "Kannada" },
    { text: "నమస్కారం", lang: "Telugu" },
    { text: "নমস্কার", lang: "Bengali" },
    { text: "નમસ્તે", lang: "Gujarati" },
    { text: "नमस्कार", lang: "Marathi" },
    { text: "ନମସ୍କାର", lang: "Odia" }
  ];

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' }
  ];

  useEffect(() => {
    // Check if tour has been completed
    const tourCompleted = localStorage.getItem('resq_tour_completed');
    if (!tourCompleted) {
      // Small delay before starting
      setTimeout(() => setIsOpen(true), 1500);
    }
  }, []);

  // Cycle greetings
  useEffect(() => {
    if (step === 'greeting' && isOpen) {
      const interval = setInterval(() => {
        setGreetingIndex((prev) => (prev + 1) % greetings.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step, isOpen]);

  const handleLanguageSelect = (langCode) => {
    i18n.changeLanguage(langCode);
    setStep('intro');
  };

  const nextStep = () => {
    const tourSteps = ['intro', 'dashboard', 'alerts', 'safety', 'end'];
    const currentIndex = tourSteps.indexOf(step);
    if (currentIndex < tourSteps.length - 1) {
      setStep(tourSteps[currentIndex + 1]);
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    setIsOpen(false);
    localStorage.setItem('resq_tour_completed', 'true');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        
        {/* Character Image - Always visible during tour */}
        {/* Character Image - Always visible during tour */}
        <motion.img 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          src="/resq_assistant.png" 
          onError={(e) => {
            e.target.onerror = null;
            // Fallback to a placeholder or transparent if image fails
            e.target.style.display = 'none'; 
            // Or better, replace with a generic robot/person icon url if available, 
            // but for now just hide it cleanly vs broken icon
          }}
          className="absolute bottom-0 left-4 md:left-20 h-[300px] md:h-[500px] object-contain z-[101] pointer-events-none drop-shadow-2xl"
          alt="ResQ Assistant"
        />

        {/* Dialog Box */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full relative z-[102] ml-0 md:ml-64 border border-slate-200 dark:border-slate-700"
        >
          {/* Close Button */}
          <button onClick={completeTour} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="p-8 md:p-10">
            
            {/* STEP: GREETING */}
            {step === 'greeting' && (
              <div className="text-center py-8">
                <motion.div 
                  key={greetingIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4"
                >
                  {greetings[greetingIndex].text}
                </motion.div>
                <div className="text-slate-500 font-medium text-lg uppercase tracking-widest">{greetings[greetingIndex].lang}</div>
                
                <button 
                  onClick={() => setStep('language')}
                  className="mt-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                >
                  Start <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* STEP: LANGUAGE SELECT */}
            {step === 'language' && (
              <div>
                <h2 className="text-3xl font-bold mb-2 dark:text-white">{t('onboarding.language.title', 'Choose your Language')}</h2>
                <p className="text-slate-500 mb-8">{t('onboarding.language.desc', 'Select your preferred language to continue.')}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{lang.native}</span>
                      <span className="text-xs text-slate-400 font-bold uppercase">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP: INTRO */}
            {step === 'intro' && (
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <Globe className="w-4 h-4" /> ResQ Assistant
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-4 dark:text-white leading-tight">
                  {t('onboarding.intro.title', 'Welcome to')} <span className="text-blue-600">ResQ</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                  {t('onboarding.intro.desc', 'I am here to help you stay safe. This platform provides real-time alerts, disaster guides, and emergency contacts for your village and family.')}
                </p>
                <button 
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 w-full md:w-auto justify-center"
                >
                  {t('onboarding.intro.button', 'Show me around')} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* STEP: DASHBOARD */}
            {step === 'dashboard' && (
              <div className="text-left">
                 <h2 className="text-2xl font-bold mb-3 dark:text-white">{t('onboarding.dashboard.title', 'Live Dashboard')}</h2>
                 <p className="text-slate-600 dark:text-slate-300 mb-6">
                   {t('onboarding.dashboard.desc', 'This is your main view. The big card shows your Current Safety Status. If there is any danger nearby, it will turn RED and tell you exactly what to do.')}
                 </p>
                 <div className="flex gap-3">
                    <button onClick={nextStep} className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-bold">{t('common.next', 'Next')}</button>
                 </div>
              </div>
            )}

            {/* STEP: ALERTS */}
            {step === 'alerts' && (
              <div className="text-left">
                 <h2 className="text-2xl font-bold mb-3 dark:text-white">{t('onboarding.alerts.title', 'Real-Time Alerts')}</h2>
                 <p className="text-slate-600 dark:text-slate-300 mb-6">
                   {t('onboarding.alerts.desc', 'We monitor satellites and ground sensors 24/7. Any urgent warnings for your location will appear in the Live Alerts Feed instantly.')}
                 </p>
                 <button onClick={nextStep} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-bold">{t('common.got_it', 'Got it')}</button>
              </div>
            )}

            {/* STEP: SAFETY */}
            {step === 'safety' && (
              <div className="text-left">
                 <h2 className="text-2xl font-bold mb-3 dark:text-white">{t('onboarding.safety.title', 'Survival Guides')}</h2>
                 <p className="text-slate-600 dark:text-slate-300 mb-6">
                   {t('onboarding.safety.desc', 'Access complete safety manuals for Earthquakes, Floods, and Cyclones. Learn what to do Before, During, and After a disaster.')}
                 </p>
                 <button onClick={nextStep} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-lg font-bold">{t('common.next', 'Next')}</button>
              </div>
            )}

            {/* STEP: END */}
            {step === 'end' && (
              <div className="text-left">
                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                 </div>
                 <h2 className="text-3xl font-bold mb-3 dark:text-white">{t('onboarding.end.title', 'You are all set!')}</h2>
                 <p className="text-slate-600 dark:text-slate-300 mb-8">
                   {t('onboarding.end.desc', 'Explore the app freely. If you ever need help, look for the "Help" section. Stay safe!')}
                 </p>
                 <button 
                  onClick={completeTour}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all"
                >
                  {t('onboarding.end.button', 'Get Started')}
                </button>
              </div>
            )}

          </div>
          
          {/* Progress Dots */}
          {step !== 'greeting' && step !== 'language' && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
              {['intro', 'dashboard', 'alerts', 'safety', 'end'].map((s) => (
                <div 
                  key={s}
                  className={`w-2 h-2 rounded-full transition-all ${step === s ? 'bg-blue-600 w-6' : 'bg-slate-300'}`}
                />
              ))}
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
