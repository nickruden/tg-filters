import { updateStore } from "./store.js";

document.addEventListener('DOMContentLoaded', function () {
    const rangeInputs = document.querySelectorAll('.filters-double-input');
    const clearButtons = document.querySelectorAll('.filters-form__element-clear');
    const filtersData = {};
    updateStore("doubleInputsData", filtersData);

    rangeInputs.forEach(rangeInput => {
        const startInput = rangeInput.querySelector('.filters-input__field[name*="Start"]');
        const endInput = rangeInput.querySelector('.filters-input__field[name*="End"]');
        const rangeId = startInput.getAttribute('data-range-id');

        filtersData[rangeId] = {
            type: `range${rangeId.charAt(0).toUpperCase() + rangeId.slice(1)}`,
            value: {
                start: '',
                end: ''
            },
        };

        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === rangeId);

        if (clearButton) {
            clearButton.addEventListener('click', function (event) {
                event.preventDefault();
                filtersData[rangeId].value.start = '';
                filtersData[rangeId].value.end = '';
                startInput.value = '';
                endInput.value = '';
                updateClearButtonVisibility(rangeId);
                console.log(filtersData);
            });
        }

        startInput.addEventListener('input', function (event) {
            let value = event.target.value.replace(/\D/g, ''); // Удаляем нецифровые символы
            if (value) {
                value = Number(value).toLocaleString('ru-RU');
                event.target.value = value;
            }
            filtersData[rangeId].start = event.target.value;
            updateClearButtonVisibility(rangeId);
            updateStore("doubleInputsData", filtersData);
            console.log(filtersData);
        });

        endInput.addEventListener('input', function (event) {
            let value = event.target.value.replace(/\D/g, ''); // Удаляем нецифровые символы
            if (value) {
                value = Number(value).toLocaleString('ru-RU');
                event.target.value = value;
            }
            filtersData[rangeId].end = event.target.value;
            updateClearButtonVisibility(rangeId);
            updateStore("doubleInputsData", filtersData);
            console.log(filtersData);
        });
    });

    function updateClearButtonVisibility(rangeId) {
        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === rangeId);
        if (!clearButton) return;
        const anyValue = filtersData[rangeId] && (filtersData[rangeId].value.start !== '' || filtersData[rangeId].value.end !== '');
        clearButton.style.display = anyValue ? 'block' : 'none';
    }
});