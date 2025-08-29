import i18next from 'i18next';
import en from './en.js';

const resources = { en };

const initI18n = () => {
  i18next.init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    resources,
  });
};

export default initI18n;
