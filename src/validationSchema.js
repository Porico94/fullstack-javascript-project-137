import * as yup from 'yup';

yup.setLocale({
    string: {
        url: 'errors.invalidUrl',
    },
    mixed: {
        notOneOf: 'errors.notOneOf',
        required: 'errors.required',
    },
});

const buildSchema = (existingFeeds) => (
  yup.string()
    .required()
    .url()
    .notOneOf(existingFeeds)
);

export default buildSchema;