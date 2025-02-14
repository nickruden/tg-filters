# Фильтры
---
## Общая информация о элементах
:exclamation: :exclamation: :exclamation: Каждый элемент имеет _общую структуру_, в которой _нельзя ничего убирать или менять_ :exclamation: :exclamation: :exclamation: <br>
```HTML
<div class="filters-form__element">
  <div class="filters-form__element-top">...</div>
  <div class="filters-form__element-content">...</div>
  <div class="filters-form__element-footer">...</div>
 </div>
```
- **element-top** - используется для указания заголовка поля и, для некоторых полей, добавления кнопки _Очистить_
- **element-content** - здесь указывается элемент, с которым необходимо будет взаимодействовать
- **element-bottom** - необходим для служебной информации некоторых элементов <br> <br> 
:exclamation: :exclamation: :exclamation: ДЛЯ ПРАВИЛЬНОЙ ЛОГИКИ РАБОТЫ, ВАЖНО СОХРАНИТЬ СТРУКТУРУ КАЖОЙ ЧАСТИ ЭЛЕЛЕМЕНТА :exclamation: :exclamation: :exclamation:
---
## Общая информация о блоках
Блоки элементов имеют также свою структуру:
```HTML
<div class="filters-form__block">
  <div class="filters-form__block-header"></div>
  <div class="filters-form__block-content">
    <div class="filters-form__block-content-inner">...</div>
  </div>
</div>
```
- **filters-form__block-header** - используется для указания заголовка блока если он необходим;
- **filters-form__block-content-inner** - содержит все элементы фильтров;

:exclamation: :exclamation: :exclamation: Не важно есть заголовок или нет, обязательно создавать большие блоки фильтров в такой структуре

Если есть заголовок, необходимо следовать следующей структуре:
```HTML
<div class="filters-form__block">
    <div class="filters-form__block-header">
        <div class="filters-form__block-title --title-section" data-toggle="options">
            <h3 class="filters-form__block-title-text">Параметры</h3>
            <button class="filters-form__block-title-button">
                <div class="filters-select__icon">
                    <svg иконка стрелочки>
                </div>
            </button>
        </div>
    </div>
    <div class="filters-form__block-content" data-block-content="options">
        <div class="filters-form__block-content-inner">...</div>
    </div>
</div>
```
Необходимо создать элемент заголовка с классом ```---title-section``` и указанием самого заголовка внутри. Также надо использовать два атрибута для интерактивности: ```data-toggle``` и ```data-block-content```, они одинаковые для одного блока элементов, но разные для разных.

---
## Создание элементов
### :bar_chart: <a id="createInputField">Поле ввода</a> :bar_chart:
```HTML
<div class="filters-form__element">
  <div class="filters-form__element-top">
    <label for="searchInput" class="filters-form__element-lable">Поиск</label>
  </div>
  <div class="filters-form__element-content">
    <div class="filters-input --icon filters-form__input">
      <input type="text" name="searchInput" id="searchInput" class="filters-input__field" placeholder="Поиск по реестру">
      <button class="filters-input__button">
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
           <svg код иконки>
        </svg>
      </button>
    </div>
   </div>
  <div class="filters-form__element-footer"></div>
 </div>
```
Существует два типа полей ввода: с исконкой, без иконки. Иконка указывается как элемент кнопки с картинкой. За переключение отображения иконки отвечает модификатор ```--icon```, без него поле ввода отображается без иконки <br><br>
Что касается логики работы, для независимости полей ввода, необходимо указывать разные атрибуты ```name``` и ```id``` для разных инпутов. Для каждого поля ввода может быть подпись, для этого в ```elemen-top``` необходимо указать ```lable```, атрибут ```for``` которого будет совпадать с ```id``` инпута. Указание надписи является опциональным действием. То есть без неё, также всё работает <br><br>

:bangbang: Важно учитывать, что ```id``` и ```name``` должны быть осмыленные, так как от этого зависит название поля в строке запроса :bangbang:

---
### :bar_chart: <a id="createInputField">Чекбоксы</a> :bar_chart:
```HTML
<div class="filters-form__element">
  <div class="filters-form__element-top"></div>
  <div class="filters-form__element-content">
    <label class="filter-checkbox">
      <input type="checkbox" name="checboxFz178" id="checboxFz178" class="filter-checkbox__old">
      <span class="filter-checkbox__new"></span>
      <span class="filter-checkbox__text">178-ФЗ</span>
    </label>
  </div>
  <div class="filters-form__element-footer"></div>
</div>
```
Здесь важно учесть, что текст чекбокса указывается в ```filter-checkbox__text``` и то, что ```id``` и ```name``` должны быть разные для каждого создаваемого чекбокса <br><br>
:bangbang: Важно учитывать, что ```id``` и ```name``` должны быть осмыленные, так как от этого зависит название поля в строке запроса :bangbang:

---
### :bar_chart: <a id="createInputField">Выпадающие списки</a> :bar_chart:
#### - _Выпадающий список с выбором одного значения:_
```HTML
<div class="filters-form__element">
  <div class="filters-form__element-top">
    <label for="stateControl" class="filters-form__element-lable">Орган контроля</label>
  </div>
  <div class="filters-form__element-content">
    <div class="filters-select filters-form__select">
      <div class="filters-select__header">
       <input type="text" name="stateControl" id="stateControl" class="filters-select__field" placeholder="Не выбрано">
       <div class="filters-select__icon">
          <svg иконка стрелочки />
       </div>
      </div>
    <div class="filters-select__dropdown" data-dropdown-content="stateControl">
      <div class="filters-select__dropdown-body">
        <div class="filters-select__dropdown-options"></div>
      </div>
    </div>
   </div>
  </div>
 <div class="filters-form__element-footer"></div>
</div>
```

Здесь важно контролировать атрибуты ```id```, ```for``` у ```lable(если есть подпись)```, ```name``` и ```data-dropdown-content``` они обязательно должны быть уникальные для разных выпадающих списков, но все они быть одинаковыми для одного выпадающего списка.

#### - _Выпадающий список с выбором множества значений и поиском по ним:_
```HTML
<div class="filters-form__element">
    <div class="filters-form__element-top">
        <label for="legislativeAct" class="filters-form__element-lable">Нормативно правовой акт</label>
        <button class="filters-form__element-clear" data-target="legislativeAct">Очистить</button>
    </div>
    <div class="filters-form__element-content">
        <div class="filters-select filters-form__select">
            <div class="filters-select__header">
                <input type="text" name="legislativeAct" id="legislativeAct" class="filters-select__field" placeholder="Не выбрано">
                <div class="filters-select__icon">
                    <svg иконка стрелочки>
                </div>
            </div>
            <div class="filters-select__dropdown" data-dropdown-content="legislativeAct">
                <div class="filters-select__dropdown-body">
                    <div class="filters-select__dropdown-top">
                        <div class="filters-input --icon filters-select__dropdown-input">
                            <input type="text" name="legislativeActSearchInput" id="legislativeActSearchInput" class="filters-input__field" placeholder="Поиск по реестру"> 
                        </div>
                    </div>
                <div class="filters-select__dropdown-options"></div>
            </div>
        </div>
    </div>
    <div class="filters-form__element-footer"></div>
</div>
```
Здесь целый набор атрибутов, которые нельзя упускать:
- element-top: помимо подписи, где ```for``` у ```lable```, здесь создаётся кнопка _Очистить_, у которой есть атрибут ```data-target```, он полностью совпадает со всеми атрибутами селекта;
- element-content: здесть атрибуты ```name```, ```id``` у ```input``` и также ```data-dropdown-content```, атрибуты у строки поиска ни на что не влияют, но создавать желательно по принципу ```id-селектаSearchInput```; <br><br>

:bangbang: Абсолютно все атрибуты должны быть одинаковые для одного подобного селекта, опираться надо на ```id``` у ```input``` внутри ```filters-select__header``` :bangbang:

#### - _Инициализация селектов_
```javascript
const selectsData = {
    complaints: { // каждый объект селекта, совпадает со значением его атрибутов в вёрстке 
        type: 'select',
        options: [
            { id: "no-complaints", name: "Нет жалоб" },
            { id: "has-compla1010ints", name: "Есть жалобы" },
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
```
Абсолютно каждый селект необходимо инициализировать в файле, то есть указать его параметры выбора. Для этого, необходимо в файле ```\scripts\init\selectsData.js``` указать объект ```selectsData```, и строго соблюдать его структуру, описаную выше. <br><br>
Важно правильно указать тип селекта, ```select``` - обычный селект, ```checkbox``` - селект с множественным выбором. <br><br>
Создавать опции надо также осмыленно, особенно свойство ```id```, так как именно оно будет сохраняться в строке запроса

:bangbang::bangbang: ВАЖНОЕ ЗАМЕЧАНИЕ, НИКАКАЯ ОПЦИЯ НЕ ДОЛЖНА ПОВТОРЯТЬСЯ, ОСОБЕННО ДЛЯ СЕЛЕКТОВ С МНОЖЕСТВЕННЫМ ВЫБОРОМ ```checkbox```, ТАК КАК СДЕЛАЛ ЧТОБ СКРИПТ НЕ ВОСПРИНИМАЛ ПОВТОРЯЮЩИЕСЯ ЗНАЧЕНИЯ :bangbang::bangbang:

---
### :bar_chart: <a id="createInputField">Поле диапазона</a> :bar_chart:
```HTML
<div class="filters-form__element">
    <div class="filters-form__element-top">
        <label for="startPrice" class="filters-form__element-lable">Начальная цена</label>
        <button class="filters-form__element-clear" data-target="rangePrice1">Очистить</button>
    </div>
    <div class="filters-form__element-content">
        <div class="filters-double-input filters-form__double-input">
            <div class="filters-input filters-double-input__input-field-wrap">
                <input type="text" name="priceFrom" data-range-id="rangePrice1" class="filters-input__field" placeholder="от">
            </div>
            <span class="filters-double-input__separator"></span>
            <div class="filters-input filters-double-input__input-field-wrap">
                <input type="text" name="priceTo" data-range-id="rangePrice1" class="filters-input__field" placeholder="до">
            </div>
        </div>
    </div>
    <div class="filters-form__element-footer"></div>
</div>
```

Здесь действует такоеже правило как и для всех прошлых элементов, атрибуты: ```for```, ```data-target```, ```data-range-id``` являются одинаковыми, но добавляется обязательное указание правильных ```name``` для каждого инпута, если это начало, то в обязательном порядке, не важно что в начале, но в конце ```name``` должно быть ключевое слово ```From```, если конец - ```To```. <br><br>
За осмыленность отвечают атрибут data-range-id, именно он отправляется на сервер

---
### :bar_chart: <a id="createInputField">Датапикер</a> :bar_chart:
```HTML
<div class="filters-form__element">
    <div class="filters-form__element-top">
        <label for="dateFrom" class="filters-form__element-lable">Дата окончания срока подачи заявок</label>
        <button class="filters-form__element-clear" data-target="date">Очистить</button>
    </div>
    <div class="filters-form__element-content">
        <div class="datatime-range filters-form__datatime-reange">
            <div class="filters-input --icon datatime-range__input">
                <input type="text" name="dateFrom" id="dateFrom" class="filters-input__field flatpickr-input" placeholder="дд.мм.гггг">
                <button class="filters-input__button" data-toggle="dateFrom">
                    <svg иконка>
                </button>
            </div>
            <div class="filters-input --icon datatime-range__input">
                <input type="text" name="dateTo" id="dateTo" class="filters-input__field flatpickr-input" placeholder="дд.мм.гггг">
                <button class="filters-input__button" data-toggle="dateTo">
                    <svg иконка>
                </button>
            </div>
        </div>
    </div>
    <div class="filters-form__element-footer"></div>
</div>
```

В даном элемента формы совершенно другая логика добавления атрибутов:
- ```<lable for>``` указывает на первое поле даты, то есть на начало;
- ```<button data-target>``` - здесь необходимо указать осмыленную часть названия, то есть уникальную для каждого датапикера;
- ```name``` и ```id``` - обязательно вначале и нигде больше, указать ту осмыленную часть названия датапикера из ```data-target```, а уже после, в зависимости от того, какоэ это инпут, указать в конце ```<data-targetValue>From``` - это начальная дата или ```<data-targetValue>To``` - это завершение диапазона;
- ```data-toggle``` - существует для каждого инпута датапикера и хранит значение ```name``` или ```id``` этого инпута;
- класс ```flatpickr-input``` - является частью инициализации элемента, и указывается у каждого инпута.

То есть идентификатором тут является ```<button data-target>```

---
### :bar_chart: <a id="createInputField">Текстовая область</a> :bar_chart:
```HTML
<div class="filters-form__element">
    <div class="filters-form__element-top">
        <label for="location" class="filters-form__element-lable">Местонахождение имущества</label>
        <button class="filters-form__element-clear" data-target="location">Очистить</button>
    </div>
    <div class="filters-form__element-content">
        <div class="filters-textarea filters-form__textarea">
            <textarea name="location" id="location" class="filters-textarea__field" rows="3" placeholder="Введите адрес"></textarea>
        </div>
    </div>
    <div class="filters-form__element-footer"></div>
</div>
```
Здесь опять как и во всех элементах, атрибуты: ```<lable for>```, ```<button data-target>```, ```name``` и ```id``` одинаковые. 

:bangbang: Важно учитывать, что ```id``` и ```name``` должны быть осмыленные, так как от этого зависит название поля в строке запроса :bangbang:

---
### :bar_chart: <a id="createInputField">Блок типа "категории"</a> :bar_chart:
```HTML
<div class="filters-form__block dropdown-content-block category-block">
    <div class="filters-form__block-header category-block__header">
        <div class="filters-form__block-title --title-section" data-toggle="category">
            <h3 class="filters-form__block-title-text">Категория</h3>
            <button class="filters-form__block-title-button">
                <div class="filters-select__icon">
                    <svg иконка стреклочки>
                </div>
            </button>
        </div>
    </div>
    <div class="filters-form__block-content category-block__content" data-block-content="category">
        <div class="filters-form__block-content-inner">
            <div class="category-block__selected-categories"></div>
            <div class="category-block__dropdown">
                <div class="category-block__dropdown-options"></div>
            </div>
        </div>
    </div>
</div>
```

Особенность этого элемента, то что это элемент-блок, то есть как и говорилось выше, каждый набор фильтров, объеденён в блоки, не важно именнованные они или нет, но здесь всегда надо придерживаться особой структуры, так как в нём нет привычной структуры элемента описанной в самом начале. <br> <br>
Важно понимать следующие моменты:
- класс ```category-block``` обязателен для инициализации;
- атрибуты ```data-toggle``` и ```data-block-content``` одинаковые и осмысленные, так как именно они определяются название параметра, отправляемого на сервер.

Также это ещё один из элементов, который надо явно инициализировать:
```javascript
const categoriesData = {
    category: { // это id блока, указанного в атрибутах ```data-toggle``` и ```data-block-content```
        Транспорт: { // название объекта, то что будет видеть человек в вёрстке категорий
            id: 'transp', // то что будет сохраняться при выборе категории
            subcategories: [ 
                {
                    id: 'leg', // то что будет сохраняться при выборе подкатегории
                    name: 'Легковые', // то что будет видеть человек в вёсртке подкатегорий
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
        ...
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
```

Здесь точно также как и раньше, надо обязательно следовать структуре описанной выше и понимать для чего каждое свойство необходимо(также описано в коде). Сделать это необходимо в файле ```\scripts\init\caregoriesData.js``` объекте ```categoriesData```.

Создавать опции надо также осмыленно, особенно свойства ```id```, так как именно они будет сохраняться в строке запроса

:bangbang::bangbang: ВАЖНОЕ ЗАМЕЧАНИЕ, НИКАКОЕ id КАТЕГОРИИ ИЛИ ПОДКАТЕГОРИИ НЕ ДОЛЖНЫ ПОВТОРЯТЬСЯ, ```name``` ПОДКАТЕГОРИИ МОЖЕТ ПОВТОРЯТЬСЯ, НО НАЗВАНИЕ ГЛОБАЛЬНОГО ОБЪЕКТА КАТЕГОРИИ(ТО ЧТО НА РУССКОМ НАПИСАНО) НЕ ДОЛЖНО ПОВТОРЯТЬСЯ :bangbang::bangbang: