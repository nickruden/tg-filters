import { updateStore } from "./store.js";

// Объект данных для селектов
const selectsData = {
    complaints: {
        type: 'select',
        options: [
            { id: "no-complaints", name: "Нет жалоб" },
            { id: "has-complaints", name: "Есть жалобы" }
        ]
    },
    stateControl: {
        type: 'select',
        options: [
            { id: "no-complaints", name: "Нет жалоб" },
            { id: "has-complaints", name: "Есть жалобы" }
        ]
    },
    legislativeAct: {
        type: 'checkbox',
        options: [
            { id: "active", name: "Активен ty" },
            { id: "inactive", name: "Неактивен" },
            { id: "activ4e", name: "Активе2н" },
            { id: "inactiv1e", name: "Неактиве3н" },
            { id: "activ3e", name: "Активен4" },
            { id: "inactiv22e", name: "Неактивен5" },
            { id: "active33", name: "Активен6" },
            { id: "inactive4", name: "Неактивен7" },
        ]
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const filterSelectHeaders = document.querySelectorAll('.filters-select__header');
    const clearButtons = document.querySelectorAll('.filters-form__element-clear');
    const filtersData = {};

    filterSelectHeaders.forEach(header => {
        const input = header.querySelector('input');
        const inputId = input.getAttribute('id');
        const dropdown = document.querySelector(`.filters-select__dropdown[data-dropdown-content="${inputId}"]`);
        const icon = header.querySelector('.filters-select__icon svg');

        if (!dropdown || !selectsData[inputId]) return;

        input.readOnly = true;

        // Определяем тип селекта (select или checkbox)
        const selectType = selectsData[inputId].type;
        filtersData[inputId] = {
            type: selectType,
            value: selectType === 'checkbox' ? [] : null // Инициализируем значение
        };

        const footer = header.closest('.filters-form__element').querySelector('.filters-form__element-footer');
        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === inputId);

        if (clearButton) {
            clearButton.addEventListener('click', function (event) {
                event.preventDefault();
                if (selectType === 'checkbox') {
                    filtersData[inputId].value = []; // Очищаем массив
                    const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(checkbox => (checkbox.checked = false));
                } else {
                    filtersData[inputId].value = null; // Сбрасываем значение
                }
                updateInputAndFooter(inputId, footer);
                updateClearButtonVisibility(inputId);
            });
        }

        header.addEventListener('click', function (event) {
            if (dropdown) {
                event.stopPropagation();
                const isOpen = dropdown.classList.contains('--open');
                dropdown.classList.toggle('--open');
                if (icon) {
                    icon.classList.toggle('rotated', !isOpen);
                }
            }
        });

        const dropdownBody = dropdown.querySelector('.filters-select__dropdown-body');
        const dropdownOptions = dropdown.querySelector('.filters-select__dropdown-options');
        if (dropdownBody) {
            dropdownOptions.innerHTML = ''; // Очищаем существующие опции

            selectsData[inputId].options.forEach(option => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('filters-select__dropdown-option');

                if (selectType === 'checkbox') {
                    // Создаем чекбокс
                    const checkboxWrapper = document.createElement('label');
                    checkboxWrapper.classList.add('filter-checkbox');

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `option-${option.id}`;
                    checkbox.value = option.id;
                    checkbox.classList.add('filter-checkbox__old');

                    const checkboxNew = document.createElement('span');
                    checkboxNew.classList.add('filter-checkbox__new');

                    const checkboxText = document.createElement('span');
                    checkboxText.classList.add('filter-checkbox__text');
                    checkboxText.textContent = option.name;

                    checkboxWrapper.appendChild(checkbox);
                    checkboxWrapper.appendChild(checkboxNew);
                    checkboxWrapper.appendChild(checkboxText);

                    optionElement.appendChild(checkboxWrapper);
                } else {
                    // Создаем обычную опцию
                    const optionContent = document.createElement('div');
                    optionContent.classList.add('filters-select__dropdown-option-content');
                    optionContent.textContent = option.name;
                    optionContent.dataset.optionId = option.id;

                    optionElement.appendChild(optionContent);
                }

                dropdownOptions.appendChild(optionElement);
            });
        }

        dropdownBody.addEventListener('click', function (event) {
            const option = event.target.closest('.filters-select__dropdown-option');
            if (!option) return;

            if (selectType === 'checkbox') {
                const checkbox = option.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    const optionId = checkbox.value;

                    if (checkbox.checked) {
                        filtersData[inputId].value.push(optionId); // Добавляем id в массив
                    } else {
                        filtersData[inputId].value = filtersData[inputId].value.filter(
                            id => id !== optionId // Удаляем id из массива
                        );
                    }
                }
            } else {
                const optionContent = option.querySelector('.filters-select__dropdown-option-content');
                if (optionContent) {
                    const optionId = optionContent.dataset.optionId;
                    filtersData[inputId].value = optionId; // Сохраняем только id
                    dropdown.classList.remove('--open');
                }
            }

            updateInputAndFooter(inputId, footer);
            updateClearButtonVisibility(inputId);
        });

        const searchInput = dropdownBody.querySelector('.filters-select__dropdown-input input');
        if (searchInput) {
            searchInput.addEventListener('input', function (event) {
                const searchText = event.target.value.toLowerCase();
                const options = dropdownBody.querySelectorAll('.filters-select__dropdown-option');
                options.forEach(option => {
                    const optionText = option.querySelector('.filter-checkbox__text').textContent.toLowerCase();
                    if (optionText.includes(searchText)) {
                        option.style.display = '';
                    } else {
                        option.style.display = 'none';
                    }
                });
            });
        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.filters-select')) {
            document.querySelectorAll('.filters-select__dropdown.--open').forEach(dropdown => {
                dropdown.classList.remove('--open');
                const icon = dropdown.closest('.filters-select').querySelector('.filters-select__icon svg');
                if (icon) {
                    icon.classList.remove('rotated');
                }
            });
        }
    });

    function updateInputAndFooter(inputId, footer) {
        const input = document.querySelector(`.filters-select__header input[id="${inputId}"]`);
        if (!filtersData[inputId]) return;

        if (filtersData[inputId].type === 'checkbox') {
            const selectedNames = filtersData[inputId].value.map(id => {
                const option = selectsData[inputId].options.find(opt => opt.id === id);
                return option ? option.name : '';
            });
            updateInputValue(input, selectedNames);
            updateFooter(inputId, footer);
        } else {
            const selectedOption = selectsData[inputId].options.find(
                opt => opt.id === filtersData[inputId].value
            );
            input.value = selectedOption ? selectedOption.name : '';
        }

        updateStore('selectsData', filtersData);
    }

    function updateInputValue(input, selectedOptionsArray) {
        if (selectedOptionsArray.length === 0) {
            input.value = '';
        } else if (selectedOptionsArray.length === 1) {
            input.value = selectedOptionsArray[0];
        } else {
            const count = selectedOptionsArray.length;
            const word = getCorrectWordForm(count);
            input.value = `Выбрано ${count} ${word}`;
        }
    }

    function updateFooter(dropdownId, footer) {
        if (!footer) return;
        let selectedItemsContainer = footer.querySelector('.filters-form__selected-items');
        if (filtersData[dropdownId].value.length > 0) {
            if (!selectedItemsContainer) {
                selectedItemsContainer = document.createElement('div');
                selectedItemsContainer.classList.add('filters-form__selected-items');
                footer.appendChild(selectedItemsContainer);
            }
            selectedItemsContainer.innerHTML = '';
            filtersData[dropdownId].value.forEach(id => {
                const option = selectsData[dropdownId].options.find(opt => opt.id === id);
                if (!option) return;

                const selectedItem = document.createElement('div');
                selectedItem.classList.add('filters-form__selected-item', 'selected-item');
                selectedItem.innerHTML = `
                    <div class="selected-item__text">${option.name}</div>
                    <button class="selected-item__cross" type="button">
                        <span></span>
                        <span></span>
                    </button>
                `;
                const crossButton = selectedItem.querySelector('.selected-item__cross');
                crossButton.addEventListener('click', function (event) {
                    event.preventDefault();
                    filtersData[dropdownId].value = filtersData[dropdownId].value.filter(
                        selectedId => selectedId !== id
                    );
                    const checkbox = [...document.querySelectorAll(`.filters-select__dropdown[data-dropdown-content="${dropdownId}"] .filters-select__dropdown-option input[type="checkbox"]`)]
                        .find(cb => cb.value === id);
                    if (checkbox) {
                        checkbox.checked = false;
                    }
                    updateInputAndFooter(dropdownId, footer);
                    updateClearButtonVisibility(dropdownId);
                });
                selectedItemsContainer.appendChild(selectedItem);
            });
        } else if (selectedItemsContainer) {
            selectedItemsContainer.remove();
        }
    }

    function getCorrectWordForm(count) {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return 'элементов';
        }
        if (lastDigit === 1) {
            return 'элемент';
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
            return 'элемента';
        }
        return 'элементов';
    }

    function updateClearButtonVisibility(dropdownId) {
        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === dropdownId);
        if (!clearButton) return;

        const anySelected =
            filtersData[dropdownId] &&
            (filtersData[dropdownId].type === 'checkbox'
                ? filtersData[dropdownId].value.length > 0
                : filtersData[dropdownId].value !== null);
        clearButton.style.display = anySelected ? 'block' : 'none';
    }
});
