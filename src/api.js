import axios from 'axios';

const loadRss = rssUrl => {
  const allOriginsUrl = 'https://allorigins.hexlet.app/get';
  const proxyUrl = `${allOriginsUrl}?disableCache=true&url=${encodeURIComponent(rssUrl)}`;

  return axios.get(proxyUrl)
    .then(response => response.data.contents)
    .catch(() => {
      throw new Error('network');
    });
};

export default loadRss;
