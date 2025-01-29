document.addEventListener('DOMContentLoaded', function () {
    const filterSelectHeaders = document.querySelectorAll('.filters-select__header');
    const clearButtons = document.querySelectorAll('.filters-form__element-clear');
    const filtersData = {}; // все данные, абсолютно всех селектов храняться тут, если селект одиночный, можно вытащить из input.value

    filterSelectHeaders.forEach(header => {
        const input = header.querySelector('input');
        const inputId = input.getAttribute('id');
        const dropdown = document.querySelector(`.filters-select__dropdown[data-dropdown-content="${inputId}"]`);
        if (!dropdown) return;

        input.readOnly = true;

        const hasCheckboxes = dropdown.querySelector('.filters-select__dropdown-option input[type="checkbox"]');
        filtersData[inputId] = {
            type: hasCheckboxes ? 'checkbox' : 'select',
            selected: [],
            value: '',
        };

        const footer = header.closest('.filters-form__element').querySelector('.filters-form__element-footer');
        const clearButton = Array.from(clearButtons).find(btn => btn.getAttribute('data-target') === inputId);

        if (clearButton) {
            clearButton.addEventListener('click', function (event) {
                event.preventDefault();
                filtersData[inputId].selected = [];
                const checkboxes = document.querySelectorAll(`.filters-select__dropdown[data-dropdown-content="${inputId}"] .filters-select__dropdown-option input[type="checkbox"]`);
                checkboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                filtersData[inputId].value = '';
                updateInputAndFooter(inputId, footer);
                updateClearButtonVisibility(inputId);
            });
        }

        header.addEventListener('click', function (event) {
            if (dropdown) {
                event.stopPropagation();
                dropdown.classList.toggle('--open');
                document.querySelectorAll('.filters-select__dropdown.--open').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('--open');
                    }
                });
            }
        });

        const dropdownBody = dropdown.querySelector('.filters-select__dropdown-body');
        if (dropdownBody) {
            const searchInput = dropdownBody.querySelector('.filters-select__dropdown-input input');
            if (searchInput) {
                searchInput.addEventListener('input', function (event) {
                    const searchText = event.target.value.toLowerCase();
                    const options = dropdownBody.querySelectorAll('.filters-select__dropdown-option');
                    options.forEach(option => {
                        const optionText = option.querySelector('.filters-select__dropdown-option-content').textContent.toLowerCase();
                        if (optionText.includes(searchText)) {
                            option.style.display = '';
                        } else {
                            option.style.display = 'none';
                        }
                    });
                });
            }

            dropdownBody.addEventListener('click', function (event) {
                const option = event.target.closest('.filters-select__dropdown-option');
                if (option) {
                    const checkbox = option.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        const optionText = checkbox.nextElementSibling.nextElementSibling.textContent;
                        checkbox.checked = !checkbox.checked;
                        if (checkbox.checked) {
                            if (!filtersData[inputId].selected.includes(optionText)) { // Проверка на уникальность
                                filtersData[inputId].selected.push(optionText);
                            }
                        } else {
                            const index = filtersData[inputId].selected.indexOf(optionText);
                            if (index > -1) {
                                filtersData[inputId].selected.splice(index, 1);
                            }
                        }
                        updateInputAndFooter(inputId, footer);
                        updateClearButtonVisibility(inputId);
                    } else {
                        const optionContent = option.querySelector('.filters-select__dropdown-option-content').textContent.trim();
                        filtersData[inputId].value = optionContent;
                        updateInputAndFooter(inputId, footer);
                        dropdown.classList.remove('--open');
                    }
                }
            });
        }
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.filters-select')) {
            document.querySelectorAll('.filters-select__dropdown.--open').forEach(dropdown => {
                dropdown.classList.remove('--open');
            });
        }
    });


    function updateInputAndFooter(inputId, footer) {
        const input = document.querySelector(`.filters-select__header input[id="${inputId}"]`);
        if (!filtersData[inputId]) return;
        if (filtersData[inputId].type === 'checkbox') {
            updateInputValue(input, filtersData[inputId].selected);
            updateFooter(inputId, footer);
        } else {
            input.value = filtersData[inputId].value;
        }
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

        if (filtersData[dropdownId].selected.length > 0) {
            if (!selectedItemsContainer) {
                selectedItemsContainer = document.createElement('div');
                selectedItemsContainer.classList.add('filters-form__selected-items');
                footer.appendChild(selectedItemsContainer);
            }
            selectedItemsContainer.innerHTML = '';
            filtersData[dropdownId].selected.forEach(text => {
                const selectedItem = document.createElement('div');
                selectedItem.classList.add('filters-form__selected-item', 'selected-item');
                selectedItem.innerHTML = `
                      <div class="selected-item__text">${text}</div>
                      <button class="selected-item__cross">
                          <span></span>
                          <span></span>
                      </button>
                  `;
                const crossButton = selectedItem.querySelector('.selected-item__cross');
                crossButton.addEventListener('click', function () {
                    const index = filtersData[dropdownId].selected.indexOf(text);
                    if (index > -1) {
                        filtersData[dropdownId].selected.splice(index, 1);
                    }
                    const checkbox = [...document.querySelectorAll(`.filters-select__dropdown[data-dropdown-content="${dropdownId}"] .filters-select__dropdown-option input[type="checkbox"]`)]
                        .find(cb => cb.nextElementSibling.nextElementSibling.textContent === text);
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
        const anySelected = filtersData[dropdownId] && (filtersData[dropdownId].type === 'checkbox' ? filtersData[dropdownId].selected.length > 0 : filtersData[dropdownId].value !== '');
        clearButton.style.display = anySelected ? 'block' : 'none';
    }
});
