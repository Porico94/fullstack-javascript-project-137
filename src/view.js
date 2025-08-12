import i18next from 'i18next';

const renderForm = (elements, state) => {
    const input = elements.input;
    const feedback = elements.feedback;

    if (state.form.validation) {
        input.classList.remove('border-danger');
        input.classList.add('border-success');
        feedback.classList.add('text-success');
        feedback.classList.remove('text-danger');
        feedback.textContent = i18next.t('success');
        input.focus();
    } else {
        input.classList.remove('border-success');
        input.classList.add('border-danger');
        feedback.classList.add('text-danger');
        feedback.classList.remove('text-success');
        feedback.textContent = i18next.t(state.form.errorMessage);
    }
};

const renderFeed = (elements, feed) => {
    const container = elements.feeds;
    container.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = i18next.t('feeds');
    container.appendChild(title);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'mb-3');

    feed.forEach(({ title, description }) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');

        const feedTitle = document.createElement('h3');
        feedTitle.textContent = title;

        const feedDesc = document.createElement('p');
        feedDesc.textContent = description;

        li.append(feedTitle, feedDesc);
        ul.appendChild(li);
    });

    container.appendChild(ul);
};

const renderPosts = (elements, posts) => {
    const container = elements.posts;
    container.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = i18next.t('posts');
    container.appendChild(title);

    const ul = document.createElement('ul');
    ul.classList.add('list-group');

    posts.forEach(({ id, title, link, isRead}) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

        const a = document.createElement('a');
        a.setAttribute('href', link);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.textContent = title;
        a.classList.add(isRead ? 'fw-normal' : 'fw-bold');

        const previewButton = document.createElement('button');
        previewButton.type = 'button';
        previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'ms-2', 'preview-btn');
        previewButton.setAttribute('role', 'button')
        previewButton.dataset.id = id;
        previewButton.textContent = i18next.t('preview');

        const wrapper = document.createElement('div');
        wrapper.classList.add('d-flex', 'align-items-center');
        wrapper.append(a, previewButton);

        li.appendChild(wrapper);
        ul.appendChild(li);
    });

    container.appendChild(ul);
};

export { renderForm, renderFeed, renderPosts };