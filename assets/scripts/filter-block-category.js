document.addEventListener('DOMContentLoaded', function () {
    // Объект для хранения состояния всех блоков
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
        dropdownOptions.innerHTML = ''; // Очищаем текущие опции
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
            // Добавляем обработчик клика для выбора опции
            optionElement.addEventListener('click', () => selectOption(blockId, option));
            dropdownOptions.appendChild(optionElement);
        });
    }

    // Функция для выбора опции
    function selectOption(blockId, option) {
        const state = getBlockState(blockId);

        // Если выбрана глобальная категория
        if (categoriesData[blockId][option]) {
            // Если кликнули на уже выбранную категорию, удаляем её
            if (state.category === option) {
                state.category = null; // Удаляем категорию
                state.subcategory = null; // Удаляем подкатегорию
                // Обновляем блок выбранных категорий
                updateSelectedCategories(blockId);
                // Обновляем класс empty у хедера
                updateHeaderEmptyClass(blockId);
                // Открываем выпадающий список с основными категориями
                updateDropdown(blockId, Object.keys(categoriesData[blockId]));
                return;
            } else {
                state.category = option; // Устанавливаем новую глобальную категорию
                state.subcategory = null; // Удаляем подкатегорию предыдущей категории
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
                    state.category = parentCategory; // Устанавливаем родительскую категорию
                    state.subcategory = option; // Устанавливаем подкатегорию
                }
            }
        }

        // Обновляем блок выбранных категорий
        updateSelectedCategories(blockId);
        // Обновляем выпадающий список
        if (categoriesData[blockId][option]) {
            // Если выбрана глобальная категория, показываем её подкатегории
            updateDropdown(blockId, categoriesData[blockId][option]);
        } else {
            // Если выбрана подкатегория, очищаем выпадающий список
            updateDropdown(blockId, []);
        }
        // Обновляем класс empty у хедера
        updateHeaderEmptyClass(blockId);
        // Закрываем выпадающий список и пересчитываем высоту только для .category-block
        closeAndUpdateHeightForCategoryBlock(blockId);
    }

    // Функция для обновления блока выбранных категорий
    function updateSelectedCategories(blockId) {
        const state = getBlockState(blockId);
        const selectedCategoriesBlock = document.querySelector(`[data-block-content="${blockId}"] .category-block__selected-categories`);
        if (!selectedCategoriesBlock) return;
        selectedCategoriesBlock.innerHTML = ''; // Очищаем текущие выбранные категории

        // Добавляем выбранную глобальную категорию
        if (state.category) {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-block__selected-category';
            categoryElement.textContent = state.category;
            // Добавляем атрибут data-type для различения категорий и подкатегорий
            categoryElement.setAttribute('data-type', 'category');
            // Добавляем обработчик клика для повторного выбора категории
            categoryElement.addEventListener('click', () => {
                // Удаляем текущую категорию
                state.category = null;
                state.subcategory = null;
                // Обновляем блок выбранных категорий
                updateSelectedCategories(blockId);
                // Обновляем класс empty у хедера
                updateHeaderEmptyClass(blockId);
                // Открываем выпадающий список с основными категориями
                updateDropdown(blockId, Object.keys(categoriesData[blockId]));
            });
            selectedCategoriesBlock.appendChild(categoryElement);
        }

        // Добавляем выбранную подкатегорию
        if (state.subcategory) {
            const subcategoryElement = document.createElement('div');
            subcategoryElement.className = 'category-block__selected-category';
            subcategoryElement.textContent = state.subcategory;
            // Добавляем атрибут data-type для различения категорий и подкатегорий
            subcategoryElement.setAttribute('data-type', 'subcategory');
            // Добавляем обработчик клика для повторного выбора подкатегории
            subcategoryElement.addEventListener('click', () => {
                // Удаляем текущую подкатегорию
                state.subcategory = null;
                // Открываем список подкатегорий для текущей категории
                if (state.category) {
                    updateDropdown(blockId, categoriesData[blockId][state.category]);
                }
                // Обновляем блок выбранных категорий
                updateSelectedCategories(blockId);
            });
            selectedCategoriesBlock.appendChild(subcategoryElement);
        }
    }

    // Функция для обновления класса empty у хедера
    function updateHeaderEmptyClass(blockId) {
        const toggleButton = document.querySelector(`[data-toggle="${blockId}"]`);
        if (!toggleButton) return;

        // Находим хедер как родительский элемент для toggleButton
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

        // Закрываем блок
        contentBlock.style.maxHeight = '0px';
        contentBlock.classList.remove('open');

        // Пересчитываем высоту, если блок должен быть открыт
        const state = getBlockState(blockId);
        if (state.category || state.subcategory) {
            // Устанавливаем max-height на большое значение для плавной анимации
            contentBlock.style.maxHeight = '1000px'; // Значение должно быть больше, чем максимальная возможная высота
            contentBlock.classList.add('open');
        }

        // Обработка завершения анимации
        contentBlock.addEventListener('transitionend', function () {
            if (contentBlock.style.maxHeight !== '0px') {
                // После завершения анимации сбрасываем max-height на auto
                contentBlock.style.maxHeight = 'auto';
            }
        }, { once: true });
    }

    // Инициализация всех блоков
    const headers = document.querySelectorAll('.filters-form__block-header');
    headers.forEach(header => {
        const toggleButton = header.querySelector('[data-toggle]');
        if (!toggleButton) return;

        const blockId = toggleButton.getAttribute('data-toggle');
        const contentBlock = document.querySelector(`[data-block-content="${blockId}"]`);

        // Устанавливаем класс empty по умолчанию для хедера
        header.classList.add('empty');

        // Инициализация выпадающего списка с основными категориями
        if (categoriesData[blockId]) {
            updateDropdown(blockId, Object.keys(categoriesData[blockId]));
        }

        // Устанавливаем класс empty по умолчанию
        updateHeaderEmptyClass(blockId);

        // Добавляем обработчик клика для заголовка блока
        header.addEventListener('click', function (event) {
            event.preventDefault();
            const contentBlock = document.querySelector(`[data-block-content="${blockId}"]`);
            if (!contentBlock) return;

            if (contentBlock.classList.contains('open')) {
                // Закрываем блок
                contentBlock.style.maxHeight = '0px';
                contentBlock.classList.remove('open');
            } else {
                // Открываем блок
                contentBlock.style.maxHeight = `${contentBlock.scrollHeight}px`;
                contentBlock.classList.add('open');
            }
        });
    });
});