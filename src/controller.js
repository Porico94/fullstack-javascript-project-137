import initWatcher from './watcher.js';
import i18next from 'i18next';
import buildSchema from './validationSchema.js';

const initApp = (elements, state) => {    
    const watchedState = initWatcher(state, elements);

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = elements.input.value.trim();

        const schema = buildSchema(state.feeds);

        schema.validate(url)
            .then((validatedUrl) => {
                watchedState.form.input = validatedUrl;
                watchedState.form.validation = true;
                watchedState.feeds.push(validatedUrl);
            })            
            .catch((err) => {
                watchedState.form.validation = false;
                watchedState.form.errorMessage = i18next.t(`errors.${err.type}`);
            });
    });
};

export default initApp;