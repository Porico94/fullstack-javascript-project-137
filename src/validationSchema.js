import * as yup from 'yup';

// Configurar los mensajes de error de yup para que coincidan con las claves i18n
yup.setLocale({
  string: {
    url: () => ({ key: 'notUrl', type: 'url' }),
  },
  mixed: {
    required: () => ({ key: 'required', type: 'required' }),
    notOneOf: () => ({ key: 'exists', type: 'notOneOf' }),
  },
});

const buildSchema = existingFeeds => yup.string()
  .required()
  .url()
  .notOneOf(existingFeeds);

export default buildSchema;
