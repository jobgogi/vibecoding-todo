import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import ko from './locales/ko';
import ja from './locales/ja';
import zh from './locales/zh';

const SUPPORTED = ['en', 'ko', 'ja', 'zh'];

const savedLang = localStorage.getItem('lang');
const browserLang = navigator.language.split('-')[0];
const defaultLang = SUPPORTED.includes(savedLang ?? '') ? savedLang! :
                    SUPPORTED.includes(browserLang) ? browserLang : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ko: { translation: ko },
      ja: { translation: ja },
      zh: { translation: zh },
    },
    lng: defaultLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
