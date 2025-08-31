import loadRss from './api.js';
import extractPosts from './extractPosts.js';

const updateFeed = (feed, watchedState) => {
  const { url } = feed;

  loadRss(url)
    .then((contents) => {
      const newPosts = extractPosts(contents, feed);

      const existingLinks = watchedState.posts.map((post) => post.link);
      const uniquePosts = newPosts.filter((post) => !existingLinks.includes(post.link));

      if (uniquePosts.length > 0) {
        watchedState.posts = [...watchedState.posts, ...uniquePosts];
      }
    })
    .catch(err => {
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

export { updateFeed };
export default updateFeeds;
