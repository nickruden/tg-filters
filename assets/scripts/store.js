// store.js
export const filtersData = {}; // Глобальный объект для хранения данных

let timeoutId;

// Функция для обновления данных в хранилище
export function updateStore(key, value) {
  filtersData[key] = value;
  console.log(filtersData)
//   debouncedSendToServer(); // Отправляем данные на сервер с дебаунсом
}

// Функция для отправки данных на сервер с задержкой (дебаунс)
function debouncedSendToServer() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    sendToServer(filtersData);
  }, 300); // Задержка 300 мс
}

// Функция отправки данных на сервер
function sendToServer(data) {
  fetch('/api/update', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .catch((error) => console.error('Ошибка при отправке данных:', error));
}