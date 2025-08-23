import i18next from 'i18next';
import es from './es.js';
import en from './en.js';

const resources = { en, es };

const initI18n = () => {
  i18next.init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    resources,
  });
};

export default initI18n;
