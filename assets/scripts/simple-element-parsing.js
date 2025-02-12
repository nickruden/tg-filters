import { updateStore } from "./store.js";

const simpleInputs = document.querySelectorAll('.filters-form__element .filters-form__element-content > .filters-input');
const simpleCheckboxes = document.querySelectorAll('.filters-form__element .filters-form__element-content > .filter-checkbox');

let simpleData = {};

const inputTransformValue = inputValue => {
    return encodeURIComponent(inputValue);
};

// Перебираем все элементы simpleInputs
Object.values(simpleInputs).forEach(input => {
    const inputField = input.querySelector('.filters-input__field');
    const fieldId = inputField.id;

    simpleData[fieldId] = {
        value: null,
    };

    inputField.addEventListener('input', () => {
        simpleData[fieldId] = {
            value: inputTransformValue(inputField.value),
        };

        updateStore('simpleInputsCheckboxesData', simpleData);
    });
});

// Перебираем все элементы simpleInputs
Object.values(simpleCheckboxes).forEach(checkbox => {
    const checkboxField = checkbox.querySelector('.filter-checkbox__old');
    const id = checkboxField.id;

    simpleData[id] = {
        value: null,
    };

    checkboxField.addEventListener('change', () => {
        const id = checkboxField.id;

        if (checkboxField.checked) {
            simpleData[id] = {
                value: true,
            };
        } else {
            simpleData[id] = {
                value: null,
            };
        }

        updateStore('simpleInputsCheckboxesData', simpleData);
    });
});