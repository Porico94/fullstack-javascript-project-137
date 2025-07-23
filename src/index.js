import 'bootstrap/dist/css/bootstrap.min.css';
import initApp from './controller.js';  
import initI18n from './locales/index.js'

document.addEventListener('DOMContentLoaded', () => {
    initI18n();

    const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('input[name="url"]'),
        feedback: document.querySelector('.feedback'),
    };

    const state = {
        form: {
            input: '',
            errorMessage: '',
            validation: null,
        },
        feeds: [],
    };

    initApp(elements, state);
});
