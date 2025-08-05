import initWatcher from './watcher.js';
import i18next from 'i18next';
import buildSchema from './validationSchema.js';
import loadRss from './api.js';
import parseRss from './parser.js';
import { updateFeed } from './updateFeeds.js';
import { renderForm, renderFeed, renderPosts } from './view.js';

const initApp = (elements, state) => {    
    const watchedState = initWatcher(state, elements);
    renderForm(elements, watchedState);
    renderFeed(elements, watchedState.feeds);
    renderPosts(elements, watchedState.posts);    

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = elements.input.value.trim();
        const schema = buildSchema(state.feeds);

        schema.validate(url)
            .then((validatedUrl) => {
                watchedState.form.processState = 'sending';

            return loadRss(validatedUrl)
                .then((contents) => {
                    const { feed, posts } = parseRss(contents, url);
                        
                        watchedState.feeds.push(feed);
                        watchedState.posts = [...watchedState.posts, ...posts];
                        updateFeed(feed, watchedState);

                        watchedState.form.validation = true;
                        watchedState.form.errorMessage = null;
                        watchedState.form.processState = 'success';
                        watchedState.form.input = '';
                    });                
                })   
                .catch((err) => {
                    watchedState.form.validation = false;
                    watchedState.form.errorMessage = i18next.t(err.message || 'errors.unknown');
                    watchedState.form.processState = 'failed';
                });
    });
};

export default initApp;