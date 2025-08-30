import _ from 'lodash';

const extractPosts = (contents, feed) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contents, 'application/xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('invalidXml');
  }

  const items = doc.querySelectorAll('channel > item');

  const posts = Array.from(items).map(item => {
    const postTitle = item.querySelector('title')?.textContent;
    const postLink = item.querySelector('link')?.textContent;
    const postDescription = item.querySelector('description')?.textContent;

    if (!postTitle || !postLink) return null;

    return {
      id: _.uniqueId('post_'),
      feedId: feed.id,
      title: postTitle,
      link: postLink,
      description: postDescription,
    };
  }).filter(Boolean);

  return posts;
};

export default extractPosts;
