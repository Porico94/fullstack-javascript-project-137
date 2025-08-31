import onChange from 'on-change';
import loadRss from './api.js';
import rssParser from './rss.js';
import render from './view.js';
import buildSchema from './validationSchema.js';

const generateId = () => Math.random().toString(36).substring(2, 9);

const updateFeeds = (watchedState) => {
  if (watchedState.feeds.length === 0) {
    setTimeout(() => updateFeeds(watchedState), 5000);
    return;
  }

  const requests = watchedState.feeds.map((feed) => loadRss(feed.url)
    .then((contents) => {
      const parsed = rssParser(contents);

      const newPosts = parsed.items.map((item) => ({
        id: generateId(),
        title: item.title,
        link: item.link,
        description: item.description,
        feedId: feed.id,
        isRead: false,
      }));

      // Agregar solo posts nuevos (comparando por link)
      const existingLinks = watchedState.posts.map((p) => p.link);
      const freshPosts = newPosts.filter((post) => !existingLinks.includes(post.link));

      if (freshPosts.length > 0) {
        watchedState.posts.unshift(...freshPosts);
      }
    })
    .catch((err) => {
      console.error('Error al actualizar feed:', err);
    }));

  Promise.all(requests).finally(() => {
    setTimeout(() => updateFeeds(watchedState), 5000);
  });
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: document.getElementById('modal'),
  };

  const state = {
    feeds: [],
    posts: [],
    form: {
      status: 'filling', // filling, processing, success, failed
      error: null,
    },
    uiState: {
      visitedPosts: new Set(),
    },
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value, watchedState, elements);
  });

  const validateUrl = (url) => {
    const existingUrls = watchedState.feeds.map((feed) => feed.url);
    const schema = buildSchema(existingUrls);

    try {
      schema.validateSync(url);
      return { isValid: true, error: null };
    } catch (error) {
      // Mapear los errores de yup a las claves que esperan los tests
      let errorKey = 'unknown';

      if (error.type === 'required') {
        errorKey = 'required';
      } else if (error.type === 'url') {
        errorKey = 'notUrl';
      } else if (error.type === 'notOneOf') {
        errorKey = 'exists';
      }

      return { isValid: false, error: errorKey };
    }
  };

  const loadAndAddRss = (url) => {
    watchedState.form.status = 'processing';
    watchedState.form.error = null;

    loadRss(url)
      .then((contents) => {
        const parsed = rssParser(contents);

        // Feed
        const feed = {
          id: generateId(),
          title: parsed.title,
          description: parsed.description,
          url,
        };

        // Posts
        const posts = parsed.items.map((item) => ({
          id: generateId(),
          title: item.title,
          link: item.link,
          description: item.description,
          feedId: feed.id,
          isRead: false,
        }));

        // Actualizar estado
        watchedState.feeds.push(feed);
        watchedState.posts.unshift(...posts);

        watchedState.form.status = 'success';
        watchedState.form.error = null;
      })
      .catch((err) => {
        console.error('Error loading RSS:', err);
        watchedState.form.status = 'failed';

        if (err.isParsingError) {
          watchedState.form.error = 'noRss';
        } else if (err.message === 'network') {
          watchedState.form.error = 'network';
        } else {
          watchedState.form.error = 'network';
        }
      });
  };

  // Evento de submit del formulario
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = elements.input.value.trim();

    if (!url) {
      watchedState.form.status = 'failed';
      watchedState.form.error = 'required';
      return;
    }

    // Validar URL
    const validation = validateUrl(url);
    if (!validation.isValid) {
      watchedState.form.status = 'failed';
      watchedState.form.error = validation.error;
      return;
    }

    loadAndAddRss(url);
    elements.input.value = '';
  });

  // Evento para vista previa y marcar como leído
  elements.posts.addEventListener('click', (e) => {
    const previewBtn = e.target.closest('[data-bs-toggle="modal"]');
    const link = e.target.closest('a[data-id]');

    if (previewBtn) {
      const { id } = previewBtn.dataset;
      const post = watchedState.posts.find((p) => p.id === id);

      if (post) {
        // Marcar como visitado
        watchedState.uiState.visitedPosts.add(id);

        // Llenar modal
        const modalTitle = elements.modal.querySelector('.modal-title');
        const modalBody = elements.modal.querySelector('.modal-body');
        const modalLink = elements.modal.querySelector('.full-article');

        modalTitle.textContent = post.title;
        modalBody.textContent = post.description;
        modalLink.setAttribute('href', post.link);

        // El modal se abrirá automáticamente por Bootstrap
      }
    }

    if (link) {
      const { id } = link.dataset;
      watchedState.uiState.visitedPosts.add(id);
    }
  });

  // Iniciar actualización automática
  updateFeeds(watchedState);

  return watchedState;
};
