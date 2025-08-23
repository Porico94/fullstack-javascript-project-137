import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import i18next from 'i18next';
import initApp from './controller.js';
import initI18n from './locales/index.js';
import applyI18n from './i18nDom.js';

document.addEventListener('DOMContentLoaded', async () => {
    const userLang = navigator.language?.startsWith('es') ? 'es' : 'en';
    await initI18n(userLang);

    document.documentElement.setAttribute('lang', i18next.language);

    applyI18n();

    const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('input[name="url"]'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
        modal: document.getElementById('modal'),
        modalTitle: document.querySelector('.modal-title'),
        modalBody: document.querySelector('.modal-body'),
        modalFullArticle: document.querySelector('.full-article'),
    };

    const state = {
        form: {
            input: '',
            errorMessage: '',
            validation: null,
        },
        feeds: [],
        posts: [],
    };
    
    const api = initApp(elements, state);
    i18next.on('languageChanged', () => {
        document.documentElement.setAttribute('lang', i18next.language);
        applyI18n();
        api.rerender();
    });
});
