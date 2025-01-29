document.addEventListener('DOMContentLoaded', function () {
    const rangeInputs = document.querySelectorAll('.filters-double-input');
    const clearButtons = document.querySelectorAll('.filters-form__element-clear');
    const filtersData = {};

    rangeInputs.forEach(rangeInput => {
        const startInput = rangeInput.querySelector('.filters-input__field[name="priceStart"]');
        const endInput = rangeInput.querySelector('.filters-input__field[name="priceEnd"]');
        const rangeId = startInput.getAttribute('id').replace('Start', '');

        filtersData[rangeId] = {
            type: `range${rangeId}`,
            start: '',
            end: ''
        };

        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === rangeId);

        if (clearButton) {
            clearButton.addEventListener('click', function (event) {
                event.preventDefault();
                filtersData[rangeId].start = '';
                filtersData[rangeId].end = '';
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
            console.log(filtersData);
        });

        endInput.addEventListener('input', function (event) {
            let value = event.target.value.replace(/\D/g, ''); // Удаляем нецифровые символы
            if (value) {
                value = Number(value).toLocaleString('ru-RU');
                event.target.value = value;
            }

            // Проверяем значение end относительно start
            if (filtersData[rangeId].start && parseInt(value.replace(/,/g, '')) < parseInt(filtersData[rangeId].start.replace(/,/g, ''))) {
                endInput.placeholder = 'Значение меньше чем начальное';
                endInput.value = '';
                filtersData[rangeId].end = '';
            } else {
                endInput.placeholder = 'до';
                filtersData[rangeId].end = event.target.value;
            }

            updateClearButtonVisibility(rangeId);
            console.log(filtersData);
        });
    });

    function updateClearButtonVisibility(rangeId) {
        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === rangeId);
        if (!clearButton) return;
        const anyValue = filtersData[rangeId] && (filtersData[rangeId].start !== '' || filtersData[rangeId].end !== '');
        clearButton.style.display = anyValue ? 'block' : 'none';
    }
});
