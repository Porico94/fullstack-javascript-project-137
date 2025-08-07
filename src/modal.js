import { Modal } from 'bootstrap';

const showModal = (postId, state, elements) => {
  const post = state.posts.find((p) => p.id === postId);
  if (!post) return;

  const { modalTitle, modalBody, modalFullArticle, modal } = elements;

  modalTitle.textContent = post.title;
  modalBody.textContent = post.description;
  modalFullArticle.href = post.link;

  const modalInstance = new Modal(modal);
  modalInstance.show();
};

export default showModal;