export const filtersData = {};

let timeoutId;

export function updateStore(key, value) {
    filtersData[key] = value;
    debouncedFetch();
}

function debouncedFetch() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        sendToServer(filtersData);
    }, 300);
}

const buildQueryString = (data) => {
    let params = [];

    Object.entries(data).map(([key, value]) => {
        Object.entries(value).map(([key, value]) => {
            let mergeData = ``;

            // ПРОВЕРКА НА ПУСТОЕ ЗНАЧЕНИЕ И ОБЪЕКТ
            if (typeof value.value == 'object' || !value.value) {
                if (value.type === 'range') {
                    if (value.value.From && value.value.To) {
                      mergeData = `${key}From=${value.value.From}$${key}To=${value.value.To}`;
                        params.push(mergeData);
                  } else if (value.value.From) {
                    mergeData = `${key}From=${value.value.From}`;
                      params.push(mergeData);
                  } else if (value.value.To) {
                    mergeData = `${key}To=${value.value.To}`;
                      params.push(mergeData);
                  }
                }

                if (value.type === 'date') {
                    if (value.value.from && value.value.to) {
                        mergeData = `${key}Start=${value.value.from}$${key}End=${value.value.to}`;
                        params.push(mergeData);
                    } else if (value.value.from) {
                      mergeData = `${key}Start=${value.value.from}`;
                        params.push(mergeData);
                    } else if (value.value.to) {
                      mergeData = `${key}End=${value.value.to}`;
                        params.push(mergeData);
                    }
                }

                if (value.type === 'categoryBlock') {
                  // Проверяем, что значение subcategory или category не null
                  if (value.value.subcategory) {
                      mergeData = `${key}=${value.value.subcategory}`;
                      params.push(mergeData);
                  } else if (value.value.category) {
                      mergeData = `${key}=${value.value.category}`;
                      params.push(mergeData);
                  }
                  // Если оба значения null, ничего не добавляем
              }

                if (Array.isArray(value.value)) {
                    mergeData = `${key}=${value.value.join(',')}`;
                    params.push(mergeData);
                }

                return;
            } else {
                mergeData = `${key}=${value.value}`;
                params.push(mergeData);
            }
        });
    });

    return params.join('&');
};

function sendToServer(data) {
    const queryString = buildQueryString(data);
    console.log('Итоговая строка запроса: ', queryString);
    // fetch('/api/update', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // })
    //   .then((response) => response.json())
    //   .catch((error) => console.error('Ошибка при отправке данных:', error));
}
