document.addEventListener('DOMContentLoaded', function () {
    const headers = document.querySelectorAll('.filters-form__block-header');

    // Объект для хранения выбранной категории и её подкатегории
    const selectedCategories = {
        category: null,
        subcategory: null,
    };

    // Данные для категорий и подкатегорий
    const categoriesData = {
        "Транспорт": ["Легковые", "Грузовые", "Мотоциклы"],
        "Недвижимость": ["Квартиры", "Дома", "Коммерческая"],
        "Земельные участки": ["Сельхоз", "Лесной фонд", "ИЖС"],
        "Акции и Доли": ["Акции", "Доли в ООО"],
        "Права пользования и лицензии": ["Лицензии", "Патенты", "Жилые комплексы", "Жилые комплексы2", "Жилые комплексы3", "Жилые комплексы4", "Жилые комплексы5", "Жилые комплексы6", "Жилые комплексы7", "Жилые комплексы8",],
        "Строительство и развитие территорий": ["Жилые комплексы", "Коммерческие объекты"],
        "Транспорт2": ["Легковые", "Грузовые", "Мотоциклы"],
        "Недвижимость2": ["Квартиры", "Дома", "Коммерческая"],
        "Земельные участки2": ["Сельхоз", "Лесной фонд", "ИЖС"],
        "Акции и Доли2": ["Акции", "Доли в ООО"],
        "Права пользования и лицензии2": ["Лицензии", "Патенты"],
        "Строительство и развитие территорий2": ["Жилые комплексы", "Коммерческие объекты"],
    };

    // Функция для обновления выпадающего списка
    function updateDropdown(options) {
        const dropdownOptions = document.querySelector('.category-block__dropdown-options');
        dropdownOptions.innerHTML = ''; // Очищаем текущие опции

        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'category-block__dropdown-option';
            optionElement.textContent = option;

            // Добавляем атрибут data-type для различения категорий и подкатегорий
            if (categoriesData[option]) {
                optionElement.setAttribute('data-type', 'category');
            } else {
                optionElement.setAttribute('data-type', 'subcategory');
            }

            // Добавляем обработчик клика для выбора опции
            optionElement.addEventListener('click', () => selectOption(option));
            dropdownOptions.appendChild(optionElement);
        });
    }

    // Функция для выбора опции
    function selectOption(option) {
        // Если выбрана глобальная категория
        if (categoriesData[option]) {
            // Если кликнули на уже выбранную категорию и у неё есть подкатегория, удаляем подкатегорию
            if (selectedCategories.category === option && selectedCategories.subcategory) {
                selectedCategories.subcategory = null; // Удаляем подкатегорию
            } else {
                selectedCategories.category = option; // Устанавливаем новую глобальную категорию
                selectedCategories.subcategory = null; // Удаляем подкатегорию предыдущей категории
            }
        } else {
            // Если выбрана подкатегория, находим её родительскую категорию
            const parentCategory = Object.keys(categoriesData).find(cat => categoriesData[cat].includes(option));
            if (parentCategory) {
                selectedCategories.category = parentCategory; // Устанавливаем родительскую категорию
                selectedCategories.subcategory = option; // Устанавливаем подкатегорию
            }
        }

        // Обновляем блок выбранных категорий
        updateSelectedCategories();

        // Обновляем выпадающий список
        if (categoriesData[option]) {
            // Если выбрана глобальная категория, показываем её подкатегории
            updateDropdown(categoriesData[option]);
        } else {
            // Если выбрана подкатегория, очищаем выпадающий список
            updateDropdown([]);
        }

        // Обновляем класс empty у хедера
        updateHeaderEmptyClass();

        // Закрываем выпадающий список и пересчитываем высоту только для .category-block
        closeAndUpdateHeightForCategoryBlock();
    }

    // Функция для обновления блока выбранных категорий
    function updateSelectedCategories() {
        const selectedCategoriesBlock = document.querySelector('.category-block__selected-categories');
        selectedCategoriesBlock.innerHTML = ''; // Очищаем текущие выбранные категории

        // Добавляем выбранную глобальную категорию
        if (selectedCategories.category) {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-block__selected-category';
            categoryElement.textContent = selectedCategories.category;

            // Добавляем атрибут data-type для различения категорий и подкатегорий
            categoryElement.setAttribute('data-type', 'category');

            // Добавляем обработчик клика для повторного выбора категории
            categoryElement.addEventListener('click', () => {
                // Если у категории есть подкатегория, удаляем её
                if (selectedCategories.subcategory) {
                    selectedCategories.subcategory = null;
                    updateSelectedCategories(); // Обновляем блок выбранных категорий
                }
                updateDropdown(Object.keys(categoriesData)); // Открываем список глобальных категорий
            });

            selectedCategoriesBlock.appendChild(categoryElement);
        }

        // Добавляем выбранную подкатегорию
        if (selectedCategories.subcategory) {
            const subcategoryElement = document.createElement('div');
            subcategoryElement.className = 'category-block__selected-category';
            subcategoryElement.textContent = selectedCategories.subcategory;

            // Добавляем атрибут data-type для различения категорий и подкатегорий
            subcategoryElement.setAttribute('data-type', 'subcategory');

            // Добавляем обработчик клика для повторного выбора подкатегории
            subcategoryElement.addEventListener('click', () => {
                if (selectedCategories.category) {
                    updateDropdown(categoriesData[selectedCategories.category]); // Открываем список подкатегорий
                }
            });

            selectedCategoriesBlock.appendChild(subcategoryElement);
        }
    }

    // Функция для обновления класса empty у хедера
    function updateHeaderEmptyClass() {
        const header = document.querySelector('.category-block .filters-form__block-header');
        if (!selectedCategories.category && !selectedCategories.subcategory) {
            header.classList.add('empty');
            header.classList.remove('no-empty');
        } else {
            header.classList.remove('empty');
            header.classList.add('no-empty');
        }
    }

    // Функция для закрытия и пересчета высоты только для .category-block
    function closeAndUpdateHeightForCategoryBlock() {
        const categoryBlock = document.querySelector('.category-block');
        if (!categoryBlock) return;

        const contentBlock = categoryBlock.querySelector('.filters-form__block-content');
        if (!contentBlock) return;

        // Закрываем блок
        contentBlock.style.height = '0px';
        contentBlock.classList.remove('open');

        // Пересчитываем высоту, если блок должен быть открыт
        if (selectedCategories.category || selectedCategories.subcategory) {
            contentBlock.style.height = `${contentBlock.scrollHeight}px`;
            contentBlock.classList.add('open');
        }

        // Обработка завершения анимации
        contentBlock.addEventListener('transitionend', function () {
            if (contentBlock.style.height !== '0px') {
                contentBlock.style.height = 'auto';
            }
        }, { once: true });
    }

    // Инициализация выпадающего списка с основными категориями
    updateDropdown(Object.keys(categoriesData));

    // Устанавливаем класс empty по умолчанию
    updateHeaderEmptyClass();
});