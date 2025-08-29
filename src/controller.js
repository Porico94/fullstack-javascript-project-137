import initWatcher from './watcher.js';
import buildSchema from './validationSchema.js';
import loadRss from './api.js';
import parseRss from './rss.js';
import { updateFeed } from './updateFeeds.js';
import { renderForm, renderFeed, renderPosts } from './view.js';
import showModal from './modal.js';

const initApp = (elements, state) => {    
    const watchedState = initWatcher(state, elements);

    const rerender = () => {
        renderForm(elements, watchedState);
        renderFeed(elements, watchedState.feeds);
        renderPosts(elements, watchedState.posts);
    };

    // Render inicial
    rerender();
    
    elements.posts.addEventListener('click', (e) => {
        const previewButton = e.target.closest('.preview-btn');
        if (!previewButton) return;

        const postId = previewButton.dataset.id;

        const post = watchedState.posts.find((p) => p.id === postId);
        if (post) {
            post.isRead = true;
        }

        renderPosts(elements, watchedState.posts);
        showModal(postId, state, elements);
    })

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const url = elements.input.value.trim();
        const schema = buildSchema(state.feeds.map((f) => f.url));

        schema.validate(url)
            .then((validatedUrl) => {
                watchedState.form.processState = 'sending';

            return loadRss(validatedUrl)
                .then((contents) => {
                    const { feed, posts } = parseRss(contents, validatedUrl);
                        
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
                    watchedState.form.errorMessage = err.message || 'errors.unknown';
                    watchedState.form.processState = 'failed';
                });
    });

    // Devuelve un API mínimo para re-render en cambios de idioma
    return { rerender };
};

export default initApp;