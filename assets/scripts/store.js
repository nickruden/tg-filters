export const filtersData = {};

let timeoutId;

export function updateStore(key, value) {
  filtersData[key] = value;
  console.log(Object.values(filtersData))
  // debouncedFetch();
}

function debouncedFetch() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    sendToServer(filtersData);
  }, 300);
}

const buildQueryString = (data) => {
  let params = [];
  // console.log(Object.entries(data));

  Object.entries(data).map(([key, value]) => {
    Object.entries(value).map(([key, value]) => {
      let mergeData = `${key}=${value.value}`
      // console.log(key, value, mergeData)
  })
  })

  return params.join('&');
}

function sendToServer(data) {
  const queryString = buildQueryString(data);
  // console.log(queryString)
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