import axios from 'axios';
import onChange from 'on-change';
import rssParser from './rss.js';
import render from './view.js';

const generateId = () => Math.random().toString(36).substring(2, 9);

// 🔹 función para actualizar feeds periódicamente
const updateFeeds = (watchedState) => {
  const requests = watchedState.feeds.map((feed) => {
    const proxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(feed.url)}`;
    return axios.get(proxy)
      .then((response) => {
        const parsed = rssParser(response.data.contents);

        const newPosts = parsed.items.map((item) => ({
          id: generateId(),
          title: item.title,
          link: item.link,
          description: item.description,
          isRead: false,
        }));

        // agregar solo posts nuevos (comparando por link)
        const existingLinks = watchedState.posts.map((p) => p.link);
        const freshPosts = newPosts.filter((post) => !existingLinks.includes(post.link));

        if (freshPosts.length > 0) {
          watchedState.posts.unshift(...freshPosts); // agregamos arriba
        }
      })
      .catch((err) => {
        console.error('Error al actualizar feed:', err);
      });
  });

  Promise.all(requests).finally(() => {
    setTimeout(() => updateFeeds(watchedState), 5000); // vuelve a correr cada 5s
  });
};

export default () => {
  const state = {
    feeds: [],
    posts: [],
    form: {
      status: 'filling', // filling, processing, success, failed
      error: null,
    },
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value, watchedState);
  });

  const form = document.querySelector('form');
  const input = form.querySelector('input');
  const postsContainer = document.querySelector('.posts');

  const loadRss = (url) => {
    watchedState.form.status = 'processing';

    const proxy = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`;

    axios.get(proxy)
      .then((response) => {
        const parsed = rssParser(response.data.contents);

        // Feed
        const feed = {
          title: parsed.title,
          description: parsed.description,
          url, // guardamos url para futuras actualizaciones
        };

        // Posts
        const posts = parsed.items.map((item) => ({
          id: generateId(),
          title: item.title,
          link: item.link,
          description: item.description,
          isRead: false,
        }));

        // Actualizar estado
        watchedState.feeds.push(feed);
        watchedState.posts.push(...posts);

        watchedState.form.status = 'success';
        watchedState.form.error = null;
      })
      .catch((err) => {
        console.error(err);
        watchedState.form.status = 'failed';
        watchedState.form.error = 'networkError';
      });
  };

  // 🔹 evento de submit formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = input.value.trim();
    if (!url) return;

    loadRss(url);
    input.value = '';
    input.focus();
  });

  // 🔹 evento para vista previa
  postsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.preview-btn');
    if (!btn) return;

    const { id } = btn.dataset;
    const post = watchedState.posts.find((p) => p.id === id);

    if (post) {
      post.isRead = true; // marcar como leído

      // llenar modal de Bootstrap
      const modalTitle = document.querySelector('#modal .modal-title');
      const modalBody = document.querySelector('#modal .modal-body');
      const modalLink = document.querySelector('#modal .full-article');

      modalTitle.textContent = post.title;
      modalBody.textContent = post.description;
      modalLink.setAttribute('href', post.link);

      // abrir modal con Bootstrap
      const modal = new bootstrap.Modal(document.getElementById('modal'));
      modal.show();
    }
  });

  // 🔹 iniciamos la actualización automática
  updateFeeds(watchedState);
};
