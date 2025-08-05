import loadRss from './api.js';
import extractPosts from './extractPosts';

const updateFeed = (feed, watchedState) => {
    console.log(`Verificando feed: ${feed.title || feed.url} a las ${new Date().toLocaleTimeString()}`);
  
    const url = feed.url;

    loadRss(url)
        .then((contents) => {
            const newPosts = extractPosts(contents, feed);

            const existingLinks = watchedState.posts.map((post) => post.link);
            const uniquePosts = newPosts.filter((post) => !existingLinks.includes(post.link));

            if (uniquePosts.length > 0) {
                console.log(`Se encontraron ${uniquePosts.length} nuevos posts`);
                watchedState.posts = [...watchedState.posts, ...uniquePosts];
            } else {
                console.log('Sin nuevos posts');
            }
        })
        .catch((err) => {
            console.error('Error actualizando feed', err);
        })
        .finally(() => {
            setTimeout(() => updateFeed(feed, watchedState), 5000);
        });
};

const updateFeeds = (watchedState) => {
    watchedState.feeds.forEach((feed) => {
        updateFeed(feed, watchedState);
    });
};

export {updateFeed};
export default updateFeeds;