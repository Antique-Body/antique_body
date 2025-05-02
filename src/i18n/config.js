import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import all language files
import translationBS from './locales/bs.json';
import translationHR from './locales/hr.json';
import translationSR from './locales/sr.json';
import translationSL from './locales/sl.json';
import translationEN from './locales/en.json';
import translationDE from './locales/de.json';

const resources = {
  bs: {
    translation: translationBS
  },
  hr: {
    translation: translationHR
  },
  sr: {
    translation: translationSR
  },
  sl: {
    translation: translationSL
  },
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  }
};

// Get initial language from localStorage or default to English
const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('language') || 'en';
  }
  return 'en';
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n; 