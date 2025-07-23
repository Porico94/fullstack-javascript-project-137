import i18next from 'i18next';
import resources from './es.js';

const initI18n = () => {
    i18next.init({
        lng: 'es',
        debug: false,
        resources,
    });
};

export default initI18n;