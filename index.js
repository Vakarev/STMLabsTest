const TIMEOUT = 500;

function debounce (callback, timeoutDelay = TIMEOUT) {
  // Используем замыкания, чтобы id таймаута у нас навсегда приклеился
  // к возвращаемой функции с setTimeout, тогда мы его сможем перезаписывать
  let timeoutId;

  return (...rest) => {
    // Перед каждым новым вызовом удаляем предыдущий таймаут,
    // чтобы они не накапливались
    clearTimeout(timeoutId);

    // Затем устанавливаем новый таймаут с вызовом колбэка на ту же задержку
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);

    // Таким образом цикл "поставить таймаут - удалить таймаут" будет выполняться,
    // пока действие совершается чаще, чем переданная задержка timeoutDelay
  };
}

//функция рендера и фильтра данных
const getTableData = (personData) => {
    const tableBody = document.querySelector('.table-data');
    let dataHtml = '';

    //создание строк таблицы
    for (let person of personData) {
        const personFullDate = new Date(person.registered.date);
        const getDay = personFullDate.getDate();
        const getMonth = personFullDate.getMonth();
        const getYear = personFullDate.getFullYear();
        const formatPersonFullDate = `${getDay}.${getMonth}.${getYear}`;

        dataHtml += `<tr class="user-data"><td class="name">${person.name.title} ${person.name.first} ${person.name.last}</td>
        <td class="tooltip-container"><img class="avatar" src="${person.picture.thumbnail}"><img class="tooltip hidden" src="${person.picture.large}"></td>
        <td>${person.location.state} ${person.location.city}</td>
        <td>${person.email}</td><td>${person.phone}</td><td>${formatPersonFullDate}</td></tr>`;
    }

    //добавление созданной структуры в тело таблицы
    tableBody.innerHTML = dataHtml;

    //показ тултипа при наведении на аватарку
    const avatars = tableBody.querySelectorAll('.avatar')
    const tooltips = tableBody.querySelectorAll('.tooltip')
            
    for (let i = 0; i < avatars.length; i++) {
        avatars[i].addEventListener('mouseover', () => {
            tooltips[i].classList.remove('hidden');
        })
        avatars[i].addEventListener('mouseout', () => {
            tooltips[i].classList.add('hidden');
        })
    }

    const inputField = document.querySelector('.name-field');

    //Фильтрация данных. Передаю колбеком в debounce
    inputField.oninput = debounce(function() {
        const value = inputField.value.toLowerCase().trim();
        const nameFieldList = document.querySelectorAll('.name');
        const usersData = document.querySelectorAll('.user-data');
        const clearButton = document.querySelector('.clear-button');
        const errorMessage = document.querySelector('.error-message');
        let hiddenElements = [];

        //Функция убирает hidden с элементов после ресета
        const removeHidden = () => {
            for (let j = 0; j < usersData.length; j++) {
                usersData[j].classList.remove('hidden');
            }
        }

        //Сравнение введенного в поле значения с имеющимися именами.
        //ненужные скрывает. Если очистить поле, классы hidden удаляются
        if (value != '') {
            for (let j = 0; j < usersData.length; j++) {
                if (nameFieldList[j].innerText.toLowerCase().search(value) == -1) {
                    usersData[j].classList.add('hidden');
                }

                //Накопление массива-счетчика
                if (usersData[j].classList.contains('hidden')) {
                    hiddenElements.push(usersData[j])
                }
            }
        } else {
            removeHidden();
            errorMessage.classList.add('hidden');
        }

        //Очищистка поля по клику
        clearButton.addEventListener('click', () => {
            inputField.value = '';
            errorMessage.classList.add('hidden');

            removeHidden();
        })

        //Если не найдено совпадений показ соответствующего сообщения
        if (hiddenElements.length === 15) {
            errorMessage.classList.remove('hidden');
        }
    }, TIMEOUT);
}

//Получение данных с сервера и вызов функции
fetch('https://randomuser.me/api/?results=15')
.then((results) => {
    results.json().then(function(data) {
        getTableData(data.results);
    })
})
