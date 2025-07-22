const renderForm = (elements, state) => {
    const input = elements.input;
    const feedback = elements.feedback;   

    if (state.form.validation) {
        input.classList.remove('border-danger');
        input.classList.add('border-success');
        feedback.classList.add('text-success');
        feedback.classList.remove('text-danger');
        feedback.textContent = 'RSS agregado exitosamente';
        input.value = '';
        input.focus();
    } else {
        input.classList.remove('border-success');
        input.classList.add('border-danger');
        feedback.classList.add('text-danger');
        feedback.classList.remove('text-success');
        feedback.textContent = state.form.errorMessage;
    }
};

export default renderForm;