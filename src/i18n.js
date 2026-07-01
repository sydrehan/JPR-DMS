import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly to ensure they are bundled
import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import ml from './locales/ml.json';
import kn from './locales/kn.json';
import te from './locales/te.json';
import bn from './locales/bn.json';
import gu from './locales/gu.json';
import mr from './locales/mr.json';
import or from './locales/or.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ta: { translation: ta },
      ml: { translation: ml },
      kn: { translation: kn },
      te: { translation: te },
      bn: { translation: bn },
      gu: { translation: gu },
      mr: { translation: mr },
      or: { translation: or }
    },
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false // React already safes from XSS
    }
  });

export default i18n;
