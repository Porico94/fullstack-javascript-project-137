// src/view.js

const renderFeeds = (feeds, elements) => {
  elements.feeds.innerHTML = '';

  const feedsContainer = document.createElement('div');
  feedsContainer.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = 'Feeds';

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
  elements.posts.innerHTML = '';

  const postsContainer = document.createElement('div');
  postsContainer.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h2');
  title.classList.add('card-title', 'h4');
  title.textContent = 'Posts';

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
    button.textContent = 'Preview';

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

  if (form.status === 'success') {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'RSS loaded successfully';
  }

  if (form.status === 'failed') {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = form.error || 'Something went wrong';
  }
};

export default (path, value, state, elements) => {
  switch (path) {
    case 'feeds':
      renderFeeds(state.feeds, elements);
      break;

    case 'posts':
      renderPosts(state.posts, elements, state);
      break;

    case 'form':
    case 'form.status':
    case 'form.error':
      renderForm(state.form, elements);
      break;

    default:
      break;
  }
};
