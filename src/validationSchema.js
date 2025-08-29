import * as yup from 'yup';

yup.setLocale({
    string: {
        url: () => ({ key: 'notUrl' }),
    },
    mixed: {
        required: () => ({ key: 'required' }),
        notOneOf: () => ({ key: 'exists' }),
    },
});

const buildSchema = (existingFeeds) => (
  yup.string()
    .required()
    .url()
    .notOneOf(existingFeeds)
);

export default buildSchema;