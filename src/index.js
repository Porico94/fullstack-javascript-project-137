import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import initApp from './controller.js';
import initI18n from './locales/index.js';

document.addEventListener('DOMContentLoaded', () => {
    initI18n();

    const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('input[name="url"]'),
        feedback: document.querySelector('.feedback'),
        feeds: document.querySelector('.feeds'),
        posts: document.querySelector('.posts'),
        modal: document.getElementById('modal'),
        modalTitle: document.getElementById('modalTitle'),
        modalBody: document.getElementById('modalBody'),
        modalFullArticle: document.getElementById('modalFullArticle'),
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
    
    initApp(elements, state);    
});
