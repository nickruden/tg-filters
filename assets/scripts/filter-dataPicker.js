document.addEventListener('DOMContentLoaded', function () {
    const clearButtons = document.querySelectorAll('.filters-form__element-clear');
    const filtersData = {};

    // Функция для инициализации Flatpickr
    function initFlatpickr(inputId, options) {
        const input = document.getElementById(inputId);
        if (input) {
            return flatpickr(input, options);
        }
        return null;
    }

    // Инициализация всех датапикеров
    function initDatePickers() {
        const datePickers = document.querySelectorAll('.filters-input__field.flatpickr-input');
        datePickers.forEach(input => {
            const inputId = input.id;
            const rangeId = inputId.replace(/From|To/, ''); // Получаем общий идентификатор (например, "date" или "date2")
            const isFromInput = inputId.endsWith('From'); // Проверяем, это поле "от" или "до"

            // Инициализация Flatpickr
            const flatpickrInstance = initFlatpickr(inputId, {
                dateFormat: 'd.m.Y',
                minDate: isFromInput ? 'today' : null, // Для поля "от" запрещаем прошедшие даты
                disableMobile: 'true',
                onOpen: function (selectedDates, dateStr, instance) {
                    const calendarContainer = instance.calendarContainer;
                    calendarContainer.style.display = 'block';
                },
                onClose: function (selectedDates, dateStr, instance) {
                    const calendarContainer = instance.calendarContainer;
                    calendarContainer.style.display = 'none';

                },
                onChange: function (selectedDates, dateStr) {
                    // Сохраняем выбранную дату в filtersData
                    if (!filtersData[rangeId]) {
                        filtersData[rangeId] = { from: '', to: '' };
                    }
                    filtersData[rangeId][isFromInput ? 'from' : 'to'] = dateStr;

                    // Если это поле "от", обновляем минимальную дату для поля "до"
                    if (isFromInput) {
                        const toInputId = inputId.replace('From', 'To');
                        const toInput = document.getElementById(toInputId);
                        if (toInput && toInput._flatpickr) {
                            toInput._flatpickr.set('minDate', dateStr);
                        }
                    }

                    updateClearButtonVisibility(rangeId);
                    console.log(filtersData); // Выводим текущее состояние filtersData
                }
            });

            // Обработчик для кнопки открытия календаря
            const toggleButton = document.querySelector(`[data-toggle="${inputId}"]`);
            if (toggleButton) {
                toggleButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    flatpickrInstance.open();
                });
            }
        });
    }


    // Инициализация всех датапикеров
    initDatePickers();


    // Обработчик для кнопок "Очистить"
    clearButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const target = this.getAttribute('data-target'); // Получаем data-target (например, "date" или "date2")
            const fromInput = document.getElementById(`${target}From`);
            const toInput = document.getElementById(`${target}To`);

            // Очищаем поля и данные
            if (fromInput && fromInput._flatpickr) {
                fromInput._flatpickr.clear();
                filtersData[target].from = '';
            }
            if (toInput && toInput._flatpickr) {
                toInput._flatpickr.clear();
                filtersData[target].to = '';
            }

            updateClearButtonVisibility(target);
            console.log(filtersData); // Выводим текущее состояние filtersData
        });
    });


    // Функция для обновления видимости кнопки "Очистить"
    function updateClearButtonVisibility(rangeId) {
        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === rangeId);
        if (!clearButton) return;
        const anyValue = filtersData[rangeId] && (filtersData[rangeId].from !== '' || filtersData[rangeId].to !== '');
        clearButton.style.display = anyValue ? 'block' : 'none';
    }
});
