// src/view.js
import i18next from 'i18next';

const renderFeeds = (feeds, elements) => {
  if (!elements.feeds) {
    console.error('❌ Elemento feeds no encontrado en el DOM');
    return;
  }

  elements.feeds.innerHTML = '';

  if (feeds.length === 0) {
    return;
  }

  const feedsContainer = document.createElement('div');
  feedsContainer.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18next.t('feeds');

  cardBody.appendChild(title);
  feedsContainer.appendChild(cardBody);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed.title;

    const feedDesc = document.createElement('p');
    feedDesc.classList.add('m-0', 'small', 'text-black-50');
    feedDesc.textContent = feed.description;

    item.append(feedTitle, feedDesc);
    list.appendChild(item);
  });

  feedsContainer.appendChild(list);
  elements.feeds.appendChild(feedsContainer);
};

const renderPosts = (posts, elements, state) => {
  if (!elements.posts) {
    console.error('❌ Elemento posts no encontrado en el DOM');
    return;
  }

  elements.posts.innerHTML = '';

  if (posts.length === 0) {
    return;
  }

  const postsContainer = document.createElement('div');
  postsContainer.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = i18next.t('posts');

  cardBody.appendChild(title);
  postsContainer.appendChild(cardBody);

  const list = document.createElement('ul');
  list.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const item = document.createElement('li');
    item.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const link = document.createElement('a');
    link.setAttribute('href', post.link);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.dataset.id = post.id;
    link.textContent = post.title;

    // Aplicar estilos según si ha sido visitado
    if (state.uiState?.visitedPosts?.has(post.id)) {
      link.classList.add('fw-normal', 'link-secondary');
    } else {
      link.classList.add('fw-bold');
    }

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.dataset.id = post.id;
    button.dataset.bsToggle = 'modal';
    button.dataset.bsTarget = '#modal';
    button.textContent = i18next.t('preview');

    item.append(link, button);
    list.appendChild(item);
  });

  postsContainer.appendChild(list);
  elements.posts.appendChild(postsContainer);
};

const renderForm = (form, elements) => {
  const { input, feedback } = elements;

  if (!input || !feedback) {
    console.error('❌ Faltan elementos del formulario en el DOM');
    return;
  }

  // Limpiar clases y contenido previo
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger', 'text-success', 'text-info');
  feedback.textContent = '';

  switch (form.status) {
    case 'processing': {
      input.setAttribute('disabled', true);
      feedback.classList.add('text-info');
      feedback.textContent = 'Loading...';
      break;
    }

    case 'success': {
      input.removeAttribute('disabled');
      feedback.classList.add('text-success');
      feedback.textContent = i18next.t('loading.success');
      input.focus();
      break;
    }

    case 'failed': {
      input.removeAttribute('disabled');
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');

      // Usar i18next para los mensajes de error
      const errorKey = form.error || 'unknown';
      feedback.textContent = i18next.t(`errors.${errorKey}`);
      input.focus();
      break;
    }

    case 'filling':
    default: {
      input.removeAttribute('disabled');
      break;
    }
  }
};

export default (path, value, state, elements) => {
  if (!elements) {
    console.error('❌ Elements object is undefined');
    return;
  }

  switch (path) {
    case 'feeds': {
      renderFeeds(state.feeds, elements);
      break;
    }

    case 'posts': {
      renderPosts(state.posts, elements, state);
      break;
    }

    case 'form':
    case 'form.status':
    case 'form.error': {
      renderForm(state.form, elements);
      break;
    }

    case 'uiState.visitedPosts': {
      // Re-renderizar posts para actualizar estilos
      renderPosts(state.posts, elements, state);
      break;
    }

    default:
      break;
  }
};