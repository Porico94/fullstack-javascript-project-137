import i18next from "i18next";

const renderForm = (elements, state) => {
    const input = elements.input;
    const feedback = elements.feedback;   

    if (state.form.validation) {
        input.classList.remove('border-danger');
        input.classList.add('border-success');
        feedback.classList.add('text-success');
        feedback.classList.remove('text-danger');
        feedback.textContent = i18next.t('success');
        input.value = '';
        input.focus();
    } else {
        input.classList.remove('border-success');
        input.classList.add('border-danger');
        feedback.classList.add('text-danger');
        feedback.classList.remove('text-success');
        feedback.textContent = i18next.t(state.form.errorMessage);
    }
};

export default renderForm;