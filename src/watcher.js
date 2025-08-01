import onChange from 'on-change';
import { renderForm, renderFeed, renderPosts } from './view.js';

const initWatcher = (state, elements) => {
    const watchedState =  onChange(state, (path, value) => {
        if (path.startsWith('form.')) {
            renderForm(elements, watchedState);
        } else if (path === 'feeds') {
            renderFeed(elements, value);
        } else if (path === 'posts') {
            renderPosts(elements, value)
        }
    });

    return watchedState;
};

export default initWatcher;