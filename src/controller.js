import * as yup from 'yup';
import initWatcher from './watcher.js';

const initApp = (elements, state) => {    
    const watchedState = initWatcher(state, elements);

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = elements.input.value.trim();

        const schema = yup.string().url().notOneOf(state.feeds);

        schema.validate(url)
            .then((validatedUrl) => {
                watchedState.form.input = validatedUrl;
                watchedState.form.validation = true;
                watchedState.feeds.push(validatedUrl);
            })            
            .catch((err) => {
                watchedState.form.validation = false;
                watchedState.form.errorMessage = err.message;
            });
    });
};

export default initApp;