import { updateStore } from './store.js';

document.addEventListener('DOMContentLoaded', function () {
    const blockStates = {};

    // Для инициалиции надо
    const categoriesData = {
        category: { // ID блока
            Транспорт: {
                id: 'transp', 
                subcategories: [
                    {
                        id: 'leg',
                        name: 'Легковые',
                     },
                    {
                        id: 'gruz',
                        name: 'Грузовые',
                     },
                    {
                        id: 'moto',
                        name: 'Мотоциклы',
                     },
                ]
            },
            Транспорт2: {
                id: 'transp2', 
                subcategories: [
                    {
                        id: 'leg2',
                        name: 'Легковые2',
                     },
                    {
                        id: 'gruz2',
                        name: 'Грузовые2',
                     },
                    {
                        id: 'moto2',
                        name: 'Мотоциклы2',
                     },
                ]
            },
            Недвижимость: {
                id: 'nedv', 
                subcategories: [
                    {
                        id: 'appart',
                        name: 'Квартиры',
                     },
                    {
                        id: 'houses',
                        name: 'Дома',
                     },
                    {
                        id: 'commerc',
                        name: 'Коммерческая',
                     },
                ]
            },
            'Земельные участки': {
                id: 'zeml', 
                subcategories: [
                    {
                        id: 'selx',
                        name: 'Сельхоз',
                     },
                    {
                        id: 'lesfond',
                        name: 'Лесной фонд',
                     },
                    {
                        id: 'izhs',
                        name: 'ИЖС',
                     },
                ]
            },
            'Акции и Доли': {
                id: 'akcii', 
                subcategories: [
                    {
                        id: 'akcii',
                        name: 'Акции',
                     },
                    {
                        id: 'doliooo',
                        name: 'Доли в ООО',
                     },
                ]
            },
            'Права пользования и лицензии': {
                id: 'prava', 
                subcategories: [
                    {
                        id: 'licens',
                        name: 'Лицензии',
                     },
                    {
                        id: 'patenti',
                        name: 'Патенты',
                     },
                ]
            },
            'Строительство и развитие территорий': {
                id: 'stroit', 
                subcategories: [
                    {
                        id: 'ziliekomp',
                        name: 'Жилые комплексы',
                     },
                    {
                        id: 'patenti',
                        name: 'Коммерческие объекты',
                     },
                ]
            },
        },
    };

    // Функция для получения или создания состояния блока
    function getBlockState(blockId) {
        if (!blockStates[blockId]) {
            blockStates[blockId] = {
                type: 'categoryBlock',
                value: {
                    category: null,
                    subcategory: null,
                },
            };
        }
        return blockStates[blockId];
    }

    // Функция для обновления выпадающего списка
    function updateDropdown(blockId, options) {
        const dropdownOptions = document.querySelector(
            `[data-block-content="${blockId}"] .category-block__dropdown-options`
        );
        if (!dropdownOptions) return;
        dropdownOptions.innerHTML = '';
        options.forEach((option) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'category-block__dropdown-option';
            optionElement.textContent = option;

            if (option.subcategories) {
                optionElement.textContent = Object.keys(categoriesData[blockId]).find(
                    key => categoriesData[blockId][key].id === option.id
                );
                optionElement.setAttribute('data-type', 'category');
                optionElement.setAttribute('data-id', option.id);
            } else {
                // Если это подкатегория, отображаем её name
                optionElement.textContent = option.name;
                optionElement.setAttribute('data-type', 'subcategory');
                optionElement.setAttribute('data-id', option.id);
            }

            optionElement.addEventListener('click', () =>
                selectOption(blockId, option)
            );
            updateStore('categoryBlocksData', blockStates);
            dropdownOptions.appendChild(optionElement);
        });
        const simpleBarInstance = new SimpleBar(dropdownOptions);
            simpleBarInstance.recalculate();
    }

    // Функция для выбора опции
    function selectOption(blockId, option) {
        const state = getBlockState(blockId);

        // выбрана глобальная категория
        if (option.subcategories) {
            // кликнули на уже выбранную категорию
            if (state.value.category === option.id) {
                state.value.category = null;
                state.value.subcategory = null;

                updateSelectedCategories(blockId);

                updateHeaderEmptyClass(blockId);

                updateDropdown(blockId, Object.values(categoriesData[blockId]));
                return;
            } else {
                state.value.category = option.id;
                state.value.subcategory = null;
            }
        } else {
            // Если выбрана подкатегория, находим её родительскую категорию
            const parentCategory = Object.values(categoriesData[blockId]).find(
                (cat) => cat.subcategories.some(sub => sub.id === option.id)
            );
            if (parentCategory) {
                // Если подкатегория уже выбрана, удаляем её
                if (state.value.subcategory === option.id) {
                    state.value.subcategory = null;
                    // Открываем список подкатегорий для текущей категории
                    updateDropdown(
                        blockId,
                        parentCategory.subcategories
                    );
                } else {
                    state.value.category = parentCategory.id;
                    state.value.subcategory = option.id;
                }
            }
        }

        // Обновляем блок выбранных категорий
        updateSelectedCategories(blockId);
        if (option.subcategories) {
            // Если выбрана глобальная категория, показываем её подкатегории
            updateDropdown(blockId, option.subcategories);
        } else {
            updateDropdown(blockId, []);
        }

        updateHeaderEmptyClass(blockId);

        closeAndUpdateHeightForCategoryBlock(blockId);
        updateStore('categoryBlocksData', blockStates);
    }

    // Функция для обновления блока выбранных категорий
    function updateSelectedCategories(blockId) {
        const state = getBlockState(blockId);
        const selectedCategoriesBlock = document.querySelector(
            `[data-block-content="${blockId}"] .category-block__selected-categories`
        );
        if (!selectedCategoriesBlock) return;
        selectedCategoriesBlock.innerHTML = '';

        // Добавляем выбранную глобальную категорию
        if (state.value.category) {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-block__selected-category';
            
            const categoryName = Object.keys(categoriesData[blockId]).find(
                key => categoriesData[blockId][key].id === state.value.category
            );
            categoryElement.textContent = categoryName;

            // атрибут data-type для различения категорий и подкатегорий
            categoryElement.setAttribute('data-type', 'category');
            categoryElement.setAttribute('data-id', state.value.category);

            // обработчик клика для повторного выбора категории
            categoryElement.addEventListener('click', () => {
                state.value.category = null;
                state.value.subcategory = null;

                updateSelectedCategories(blockId);

                updateHeaderEmptyClass(blockId);

                updateDropdown(blockId, Object.values(categoriesData[blockId]));
            });

            selectedCategoriesBlock.appendChild(categoryElement);
        }

        // Добавляем выбранную подкатегорию
        if (state.value.subcategory) {
            const subcategoryElement = document.createElement('div');
            subcategoryElement.className = 'category-block__selected-category';

            const parentCategory = Object.values(categoriesData[blockId]).find(
                cat => cat.subcategories.some(sub => sub.id === state.value.subcategory)
            );
            const subcategoryName = parentCategory.subcategories.find(
                sub => sub.id === state.value.subcategory
            ).name;
            subcategoryElement.textContent = subcategoryName;

            // Атрибуты для подкатегории
            subcategoryElement.setAttribute('data-type', 'subcategory');
            subcategoryElement.setAttribute('data-id', state.value.subcategory);

            subcategoryElement.addEventListener('click', () => {
                state.value.subcategory = null;
                if (state.value.category) {
                    const parentCategory = Object.values(categoriesData[blockId]).find(
                        cat => cat.id === state.value.category
                    );
                    updateDropdown(blockId, parentCategory.subcategories);
                }
                updateSelectedCategories(blockId);
            });
            selectedCategoriesBlock.appendChild(subcategoryElement);
        }
    }

    // Функция для обновления класса empty у хедера
    function updateHeaderEmptyClass(blockId) {
        const toggleButton = document.querySelector(
            `[data-toggle="${blockId}"]`
        );
        if (!toggleButton) return;

        const header = toggleButton.closest('.filters-form__block-header');
        if (!header) return;

        const state = getBlockState(blockId);
        if (!state.value.category && !state.value.subcategory) {
            header.classList.add('empty');
            header.classList.remove('no-empty');
        } else {
            header.classList.remove('empty');
            header.classList.add('no-empty');
        }
    }

    // Функция для закрытия и пересчета высоты только для .category-block
    function closeAndUpdateHeightForCategoryBlock(blockId) {
        const contentBlock = document.querySelector(
            `[data-block-content="${blockId}"]`
        );
        if (!contentBlock) return;

        contentBlock.style.maxHeight = '0px';
        contentBlock.classList.remove('open');

        // Пересчитываем высоту, если блок должен быть открыт
        const state = getBlockState(blockId);
        if (state.value.category || state.value.subcategory) {
            contentBlock.style.maxHeight = '1000px';
            contentBlock.classList.add('open');
        }

        contentBlock.addEventListener(
            'transitionend',
            function () {
                if (contentBlock.style.maxHeight !== '0px') {
                    contentBlock.style.maxHeight = 'auto';
                }
            },
            { once: true }
        );
    }

    // Инициализация всех блоков
    const caregoryHeaders = document.querySelectorAll(
        '.category-block .filters-form__block-header'
    );
    caregoryHeaders.forEach((header) => {
        const toggleButton = header.querySelector('[data-toggle]');
        if (!toggleButton) return;

        const blockId = toggleButton.getAttribute('data-toggle');
        const contentBlock = document.querySelector(
            `[data-block-content="${blockId}"]`
        );

        header.classList.add('empty');

        // Инициализация выпадающего списка с основными категориями
    if (categoriesData[blockId]) {
        // Преобразуем объект категорий в массив объектов вида { name: "Транспорт", id: "transp", subcategories: [...] }
        const categories = Object.entries(categoriesData[blockId]).map(([categoryName, categoryData]) => ({
            name: categoryName,
            id: categoryData.id,
            subcategories: categoryData.subcategories
        }));
        
        updateDropdown(blockId, categories);
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
