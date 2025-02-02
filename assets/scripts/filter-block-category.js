document.addEventListener('DOMContentLoaded', function () {
    const blockStates = {};

    // Данные для категорий и подкатегорий, организованные по ID блоков
    const categoriesData = {
        "category": { // ID первого блока
            "Транспорт": ["Легковые", "Грузовые", "Мотоциклы"],
            "Недвижимость": ["Квартиры", "Дома", "Коммерческая"],
            "Земельные участки": ["Сельхоз", "Лесной фонд", "ИЖС"],
            "Акции и Доли": ["Акции", "Доли в ООО"],
            "Права пользования и лицензии": ["Лицензии", "Патенты"],
            "Строительство и развитие территорий": ["Жилые комплексы", "Коммерческие объекты"],
        },
        "category2": { // ID второго блока
            "Транспорт2": ["Легковые2", "Грузовые2", "Мотоциклы2"],
            "Недвижимость2": ["Квартиры2", "Дома2", "Коммерческая2"],
            "Земельные участки2": ["Сельхоз2", "Лесной фонд2", "ИЖС2"],
            "Акции и Доли2": ["Акции2", "Доли в ООО2"],
            "Права пользования и лицензии2": ["Лицензии2", "Патенты2"],
            "Строительство и развитие территорий2": ["Жилые комплексы2", "Коммерческие объекты2"],
        },
    };

    // Функция для получения или создания состояния блока
    function getBlockState(blockId) {
        if (!blockStates[blockId]) {
            blockStates[blockId] = {
                category: null,
                subcategory: null,
            };
        }
        return blockStates[blockId];
    }

    // Функция для обновления выпадающего списка
    function updateDropdown(blockId, options) {
        const dropdownOptions = document.querySelector(`[data-block-content="${blockId}"] .category-block__dropdown-options`);
        if (!dropdownOptions) return;
        dropdownOptions.innerHTML = '';
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'category-block__dropdown-option';
            optionElement.textContent = option;

            // Добавляем атрибут data-type для различения категорий и подкатегорий
            if (categoriesData[blockId][option]) {
                optionElement.setAttribute('data-type', 'category');
            } else {
                optionElement.setAttribute('data-type', 'subcategory');
            }

            optionElement.addEventListener('click', () => selectOption(blockId, option));
            dropdownOptions.appendChild(optionElement);
        });
    }

    // Функция для выбора опции
    function selectOption(blockId, option) {
        const state = getBlockState(blockId);

        // выбрана глобальная категория
        if (categoriesData[blockId][option]) {
            // кликнули на уже выбранную категорию
            if (state.category === option) {
                state.category = null;
                state.subcategory = null;

                updateSelectedCategories(blockId);

                updateHeaderEmptyClass(blockId);

                updateDropdown(blockId, Object.keys(categoriesData[blockId]));
                return;
            } else {
                state.category = option;
                state.subcategory = null; 
            }
        } else {
            // Если выбрана подкатегория, находим её родительскую категорию
            const parentCategory = Object.keys(categoriesData[blockId]).find(cat => categoriesData[blockId][cat].includes(option));
            if (parentCategory) {
                // Если подкатегория уже выбрана, удаляем её
                if (state.subcategory === option) {
                    state.subcategory = null;
                    // Открываем список подкатегорий для текущей категории
                    updateDropdown(blockId, categoriesData[blockId][state.category]);
                } else {
                    state.category = parentCategory;
                    state.subcategory = option;
                }
            }
        }

        // Обновляем блок выбранных категорий
        updateSelectedCategories(blockId);
        if (categoriesData[blockId][option]) {
            // Если выбрана глобальная категория, показываем её подкатегории
            updateDropdown(blockId, categoriesData[blockId][option]);
        } else {
            updateDropdown(blockId, []);
        }

        updateHeaderEmptyClass(blockId);

        closeAndUpdateHeightForCategoryBlock(blockId);
    }

    // Функция для обновления блока выбранных категорий
    function updateSelectedCategories(blockId) {
        const state = getBlockState(blockId);
        const selectedCategoriesBlock = document.querySelector(`[data-block-content="${blockId}"] .category-block__selected-categories`);
        if (!selectedCategoriesBlock) return;
        selectedCategoriesBlock.innerHTML = '';

        // Добавляем выбранную глобальную категорию
        if (state.category) {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-block__selected-category';
            categoryElement.textContent = state.category;

            // атрибут data-type для различения категорий и подкатегорий
            categoryElement.setAttribute('data-type', 'category');

            // обработчик клика для повторного выбора категории
            categoryElement.addEventListener('click', () => {
                state.category = null;
                state.subcategory = null;

                updateSelectedCategories(blockId);

                updateHeaderEmptyClass(blockId);

                updateDropdown(blockId, Object.keys(categoriesData[blockId]));
            });

            selectedCategoriesBlock.appendChild(categoryElement);
        }

        // Добавляем выбранную подкатегорию
        if (state.subcategory) {
            const subcategoryElement = document.createElement('div');
            subcategoryElement.className = 'category-block__selected-category';
            subcategoryElement.textContent = state.subcategory;
            subcategoryElement.setAttribute('data-type', 'subcategory');

            subcategoryElement.addEventListener('click', () => {
                state.subcategory = null;
                if (state.category) {
                    updateDropdown(blockId, categoriesData[blockId][state.category]);
                }
                updateSelectedCategories(blockId);
            });
            selectedCategoriesBlock.appendChild(subcategoryElement);
        }
    }

    // Функция для обновления класса empty у хедера
    function updateHeaderEmptyClass(blockId) {
        const toggleButton = document.querySelector(`[data-toggle="${blockId}"]`);
        if (!toggleButton) return;

        const header = toggleButton.closest('.filters-form__block-header');
        if (!header) return;

        const state = getBlockState(blockId);
        if (!state.category && !state.subcategory) {
            header.classList.add('empty');
            header.classList.remove('no-empty');
        } else {
            header.classList.remove('empty');
            header.classList.add('no-empty');
        }
    }

    // Функция для закрытия и пересчета высоты только для .category-block
    function closeAndUpdateHeightForCategoryBlock(blockId) {
        const contentBlock = document.querySelector(`[data-block-content="${blockId}"]`);
        if (!contentBlock) return;

        contentBlock.style.maxHeight = '0px';
        contentBlock.classList.remove('open');

        // Пересчитываем высоту, если блок должен быть открыт
        const state = getBlockState(blockId);
        if (state.category || state.subcategory) {
            contentBlock.style.maxHeight = '1000px';
            contentBlock.classList.add('open');
        }

        contentBlock.addEventListener('transitionend', function () {
            if (contentBlock.style.maxHeight !== '0px') {
                contentBlock.style.maxHeight = 'auto';
            }
        }, { once: true });
    }

    // Инициализация всех блоков
    const caregoryHeaders = document.querySelectorAll('.category-block .filters-form__block-header');
    console.log(caregoryHeaders)
    caregoryHeaders.forEach(header => {
        const toggleButton = header.querySelector('[data-toggle]');
        if (!toggleButton) return;

        const blockId = toggleButton.getAttribute('data-toggle');
        const contentBlock = document.querySelector(`[data-block-content="${blockId}"]`);

        header.classList.add('empty');

        // Инициализация выпадающего списка с основными категориями
        if (categoriesData[blockId]) {
            updateDropdown(blockId, Object.keys(categoriesData[blockId]));
        }

        // Устанавливаем класс empty по умолчанию
        updateHeaderEmptyClass(blockId);

    //     // Добавляем обработчик клика для заголовка блока
    //     header.addEventListener('click', function (event) {
    //         event.preventDefault();
    //         const contentBlock = document.querySelector(`[data-block-content="${blockId}"]`);
            
    //         if (!contentBlock) return;

    //         if (contentBlock.classList.contains('open')) {
    //             // Закрываем блок
    //             contentBlock.style.maxHeight = '0px';
    //             contentBlock.classList.remove('open');
    //         } else {
    //             // Открываем блок
    //             contentBlock.style.maxHeight = `${contentBlock.scrollHeight}px`;
    //             contentBlock.classList.add('open');
    //         }
    //     });
    });
});