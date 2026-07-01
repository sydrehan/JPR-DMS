import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700">
      <Languages className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2" />
      <select
        value={i18n.language}
        onChange={changeLanguage}
        className="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none appearance-none cursor-pointer pr-4"
        style={{ backgroundImage: 'none' }}
      >
        <option value="en">English</option>
        <option value="hi">हिंदी (Hindi)</option>
        <option value="ta">தமிழ் (Tamil)</option>
        <option value="ml">മലയാളം (Malayalam)</option>
        <option value="kn">ಕನ್ನಡ (Kannada)</option>
        <option value="te">తెలుగు (Telugu)</option>
        <option value="bn">বাংলা (Bengali)</option>
        <option value="gu">ગુજરાતી (Gujarati)</option>
        <option value="mr">मराठी (Marathi)</option>
        <option value="or">ଓଡ଼ିଆ (Odia)</option>
      </select>
    </div>
  );
};
