import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Zap, Tornado, Milestone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const SafetyCategories = () => {
  const { t } = useTranslation();
  const categories = [
    {
      title: t('categories.flood'),
      desc: t('categories.flood_desc'),
      icon: Waves,
      color: 'bg-blue-900',
      iconColor: 'text-white',
      link: '/drills?type=flood'
    },
    {
      title: t('categories.earthquake'),
      desc: t('categories.earthquake_desc'),
      icon: Zap,
      color: 'bg-orange-500',
      iconColor: 'text-white',
      link: '/drills?type=earthquake'
    },
    {
      title: t('categories.cyclone'),
      desc: t('categories.cyclone_desc'),
      icon: Tornado,
      color: 'bg-red-500',
      iconColor: 'text-white',
      link: '/drills?type=cyclone'
    },
    {
      title: t('categories.routes'),
      desc: t('categories.routes_desc'),
      icon: Milestone,
      color: 'bg-orange-400',
      iconColor: 'text-white',
      link: '/routes'
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{t('categories.title')}</h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat, index) => (
          <Link 
            key={index} 
            to={cat.link}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 group"
          >
            <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
              <cat.icon className={`w-6 h-6 ${cat.iconColor}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{cat.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">{cat.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
