
const categoriesData = {
    transport: {
        name: "Транспорт",
        subcategories: ["Легковые", "Грузовые", "Мотоциклы"]
    },
    "real-estate": {
        name: "Недвижимость",
        subcategories: ["Квартиры", "Дома", "Коммерческая"]
    },
    land: {
        name: "Земельные участки",
        subcategories: ["Сельхоз", "Лесной фонд", "ИЖС"]
    },
    shares: {
        name: "Акции и Доли",
        subcategories: ["Акции", "Доли в ООО", "Ценные бумаги"]
    },
    licenses: {
        name: "Права пользования и лицензии",
        subcategories: ["Лицензии на ПО", "Патенты", "Товарные знаки"]
    },
    construction: {
        name: "Строительство и развитие территорий",
        subcategories: ["Жилые комплексы", "Коммерческие объекты", "Инфраструктура"]
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const selectedCategoriesBlock = document.querySelector('.category-block__selected-categories');
    const dropdownOptions = document.querySelector('.category-block__dropdown-options');
    const blockTitle = document.querySelector('.category-block .filters-form__block-title'); // Получаем заголовок
    const dataForm = {}; // Объект для хранения финальных данных
    let currentSelectedCategory = null;

    // Функция для отображения основных категорий
    function renderMainCategories() {
        dropdownOptions.innerHTML = ''; // Очищаем текущие опции
        for (const key in categoriesData) {
            const category = categoriesData[key];
            const optionElement = document.createElement('div');
            optionElement.className = 'category-block__dropdown-option';
            optionElement.textContent = category.name;
            optionElement.setAttribute('data-category', key);
            dropdownOptions.appendChild(optionElement);
        }
        toggleDropdown(true);
    }

    // Инициализация: отображаем основные категории
    renderMainCategories();

    // Функция для обновления стилей заголовка
    function updateBlockTitleStyle() {
        if (selectedCategoriesBlock.children.length > 0) {
            blockTitle.classList.add('has-content');
        } else {
            blockTitle.classList.remove('has-content');
        }
    }

     // Вызывать функцию изначально чтоб установить класс
    updateBlockTitleStyle();

    // Обработчик выбора категории или подкатегории
    dropdownOptions.addEventListener('click', function (event) {
        const selectedOption = event.target;
        if (selectedOption.classList.contains('category-block__dropdown-option')) {
            const categoryKey = selectedOption.getAttribute('data-category');
            const subcategory = selectedOption.getAttribute('data-subcategory');

            if (categoryKey) { // Если выбрана основная категория
                handleCategorySelection(categoriesData[categoryKey], categoryKey);
            } else if (subcategory) { // Если выбрана подкатегория
                handleSubcategorySelection(subcategory, selectedOption.getAttribute('data-parent-category'));
            }
        }
    });

    // Функция для обработки выбора основной категории
    function handleCategorySelection(category, categoryKey) {
        // Если выбрана та же категория, которая уже выбрана, очистить её
        if (currentSelectedCategory && currentSelectedCategory.dataset.category === categoryKey) {
            clearSelectedCategory();
             updateBlockTitleStyle(); // Обновляем стили заголовка
            renderMainCategories();
            return;
        }

        // Очищаем выбранные категории и подкатегории
        selectedCategoriesBlock.innerHTML = '';

        // Добавляем выбранную категорию в блок выбранных категорий
        const selectedCategoryElement = document.createElement('div');
        selectedCategoryElement.className = 'selected-category-item';
        selectedCategoryElement.textContent = category.name;
        selectedCategoryElement.dataset.category = categoryKey;
        selectedCategoriesBlock.appendChild(selectedCategoryElement);

        // Сохраняем выбранную категорию в dataForm
        dataForm.category = category.name;
        currentSelectedCategory = selectedCategoryElement;

        // Отображаем подкатегории выбранной категории
        updateDropdown(category.subcategories, categoryKey);
          updateBlockTitleStyle(); // Обновляем стили заголовка
        console.log(dataForm); // Выводим текущее состояние dataForm
    }

    // Функция для обработки выбора подкатегории
    function handleSubcategorySelection(subcategory, parentCategory) {
        // Очищаем ранее выбранные подкатегории
        Array.from(selectedCategoriesBlock.children).forEach(item => {
            if (item.dataset.parentCategory) {
                item.remove();
            }
        });

        // Добавляем выбранную подкатегорию в блок выбранных категорий
        const selectedSubcategoryElement = document.createElement('div');
        selectedSubcategoryElement.className = 'selected-category-item';
        selectedSubcategoryElement.textContent = subcategory;
        selectedSubcategoryElement.dataset.parentCategory = parentCategory;
        selectedCategoriesBlock.appendChild(selectedSubcategoryElement);

        // Сохраняем выбранную подкатегорию в dataForm
        dataForm.subcategory = subcategory;

        // Скрываем выпадающий список
        toggleDropdown(false);
          updateBlockTitleStyle(); // Обновляем стили заголовка

        console.log(dataForm); // Выводим текущее состояние dataForm
    }

    // Функция для обновления выпадающего списка
    function updateDropdown(subcategories, categoryKey) {
        dropdownOptions.innerHTML = ''; // Очищаем текущие опции
        subcategories.forEach(subcategory => {
            const optionElement = document.createElement('div');
            optionElement.className = 'category-block__dropdown-option';
            optionElement.textContent = subcategory;
            optionElement.setAttribute('data-subcategory', subcategory);
            optionElement.setAttribute('data-parent-category', categoryKey);
            dropdownOptions.appendChild(optionElement);
        });
        toggleDropdown(true);
    }

    // Обработчик клика по уже выбранным категориям/подкатегориям
    selectedCategoriesBlock.addEventListener('click', function (event) {
        const clickedItem = event.target;
        if (clickedItem.classList.contains('selected-category-item')) {
            const categoryKey = clickedItem.dataset.category;
            const subcategory = clickedItem.dataset.parentCategory ? clickedItem.textContent : null;

            if (categoryKey) { // Если выбрана основная категория
                handleCategorySelection(categoriesData[categoryKey], categoryKey);
            } else if (subcategory) { // Если выбрана подкатегория
                const parentCategory = clickedItem.dataset.parentCategory;
                handleSubcategorySelection(clickedItem.textContent, parentCategory);
                toggleDropdown(true);
            }
        }
    });

    // Функция для плавного раскрытия/сворачивания выпадающего списка
    function toggleDropdown(expand) {
        if (expand) {
            dropdownOptions.classList.add('expanded');
        } else {
            dropdownOptions.classList.remove('expanded');
        }
    }

    // Функция для очистки выбранной категории и подкатегорий
    function clearSelectedCategory() {
        if (currentSelectedCategory) {
            currentSelectedCategory.remove();
            currentSelectedCategory = null;
            delete dataForm.category;
            delete dataForm.subcategory;
            
             // Очищаем все подкатегории
             Array.from(selectedCategoriesBlock.children).forEach(item => {
                if (item.dataset.parentCategory) {
                    item.remove();
                }
            });
               
             console.log(dataForm); // Выводим текущее состояние dataForm
            }
    }
});
