import onChange from "on-change";
import renderForm from "./view.js";

const initWatcher = (state, elements) => {
    return onChange(state, () => {
        renderForm(elements, state);
    });
};

export default initWatcher;