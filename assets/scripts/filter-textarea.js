import {updateStore} from './store.js';

document.addEventListener('DOMContentLoaded', function () {
    const textAreas = document.querySelectorAll('.filters-textarea textarea');
    const clearButtons = document.querySelectorAll('.filters-form__element-clear');
    const filtersData = {};

    textAreas.forEach(textArea => {
        const textAreaId = textArea.getAttribute('id');
        filtersData[textAreaId] = {
           type: 'textarea',
            value: ''
        };

        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === textAreaId);
        if (clearButton) {
            clearButton.addEventListener('click', function (event) {
                event.preventDefault();
                filtersData[textAreaId].value = '';
                textArea.value = '';
                updateClearButtonVisibility(textAreaId);
            });
        }
        textArea.addEventListener('input', function(event) {
            filtersData[textAreaId].value = event.target.value;
            updateClearButtonVisibility(textAreaId);
        })

        textArea.addEventListener('blur', function(event) {
            updateStore('textareasData', filtersData);
        })
    });

     function updateClearButtonVisibility(textAreaId) {
        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === textAreaId);
        if (!clearButton) return;
        const anyValue =  filtersData[textAreaId] &&  filtersData[textAreaId].value !== '';
        clearButton.style.display = anyValue ? 'block' : 'none';
    }
});
