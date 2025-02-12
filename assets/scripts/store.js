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
    console.log(Object.entries(value))
    Object.entries(value).map(([key, value]) => {
      let mergeData = ``;
      // ПРОВЕРКА НА ПУСТОЕ ЗНАЧЕНИЕ И ОБЪЕКТ
      if ((typeof value.value == 'object') || !(value.value)) {
        // Если массив, то просто перечисление
        if (Array.isArray(value.value)) {
          mergeData = `${key}=${value.value.join(',')}`;
          params.push(mergeData);
        }
      } else {
        mergeData = `${key}=${value.value}`
        params.push(mergeData);
      }
  })
  })

  return params.join('&');
}

function sendToServer(data) {
  const queryString = buildQueryString(data);
  console.log('Итоговая строка запроса: ', queryString)
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