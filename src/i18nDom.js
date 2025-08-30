import i18next from 'i18next';

const applyI18n = () => {
  // Texto de elementos
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18next.t(key);
  });

  // Atributos: placeholder
  document.querySelectorAll('[data-i18n-attr-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-attr-placeholder');
    el.setAttribute('placeholder', i18next.t(key));
  });

  // Atributos: aria-label
  document.querySelectorAll('[data-i18n-attr-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-attr-aria-label');
    el.setAttribute('aria-label', i18next.t(key));
  });
};

export default applyI18n;
