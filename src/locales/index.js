import i18next from 'i18next';
import en from './en.js';

const resources = {
  en,
};

const initI18n = (language = 'en') => i18next.init({
  lng: language,
  fallbackLng: 'en',
  debug: false,
  resources,
});

export default initI18n;
