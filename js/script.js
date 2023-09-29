import playList from './playList.js';

const timeNow = document.querySelector('.time');
const dateToday = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const userName = document.querySelector('.name');
const body = document.querySelector('body');
const nextBtn = document.querySelector('.slide-next');
const prevBtn = document.querySelector('.slide-prev');
const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const quote = document.querySelector('.quote');
const quoteAuthor = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const playBtn = document.querySelector('.play');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const timeLine = document.querySelector('.time-line-progress');
let playNum = 0;
const audio = new Audio();
let isPlay = false;
let lang =
{
    lang: 'en',
    city: 'Minsk',
    wind: 'Wind speed',
    windMetrick: 'm/s',
    humidity: 'Humidity',
    settings:
    {
        btn: 'SETTINGS',
        text: 'Language:'
    },
    error:
    {
        h: 'ERROR',
        text: 'city not found'
    },
    date:
    {
        weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },
    greeting:
    {
        night: 'Good night,',
        morning: 'Good morning,',
        afternoon: 'Good afternoon,',
        evening: 'Good evening,',
        placeholder: '[enter your name]'
    }
};

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    timeNow.textContent = currentTime;
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
};

function showDate() {
    const date = new Date();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentWeekDay = date.getDay('en-US');
    const currentDay = date.getDate('en-US');
    const currentMonth = date.getMonth('en-US');
    if (lang.lang === 'en') {
        dateToday.textContent = lang.date.weekdays[currentWeekDay] + ', ' + lang.date.months[currentMonth] + ' ' + currentDay;
    } else {
        dateToday.textContent = lang.date.weekdays[currentWeekDay] + ', ' + currentDay + ' ' + lang.date.months[currentMonth];
    }

};

function showGreeting() {
    const date = new Date();
    const hours = date.getHours();
    if (hours / 6 < 1) {
        greeting.textContent = lang.greeting.night;
    } else if (hours / 6 >= 1 && hours / 6 < 2) {
        greeting.textContent = lang.greeting.morning;
    } else if (hours / 6 >= 2 && hours / 6 < 3) {
        greeting.textContent = lang.greeting.afternoon;
    } else if (hours / 6 >= 3 && hours / 6 < 4) {
        greeting.textContent = lang.greeting.evening;
    };
    userName.placeholder = lang.greeting.placeholder;
};

function setLocalStorage() {
    localStorage.setItem('userName', userName.value);
    localStorage.setItem('city', city.value);
};

function getLocalStorage() {
    if (localStorage.getItem('userName')) {
        userName.value = localStorage.getItem('userName');
    };
    (localStorage.getItem('city')) ? city.value = localStorage.getItem('city') : city.value = lang.city;
    getWether();
};

function getRandomNum() {
    let number = Math.floor(Math.random() * (20 - 1) + 1);
    return (number + '').padStart(2, '0');
};

function setBg() {
    let timeOfDay = greeting.textContent.slice(5, -1);
    body.style.backgroundImage = `url("https://raw.githubusercontent.com/Taraikovich/stage1-tasks/main/images/${timeOfDay}/${getRandomNum()}.jpg")`;
};

function getSlideNext() {
    let nextPictureNumber = body.style.backgroundImage.slice(-8, -6) * 1 + 1;
    if (nextPictureNumber > 20) nextPictureNumber = 1;
    let pictureNext = body.style.backgroundImage.slice(76, -8) + (nextPictureNumber + '').padStart(2, '0');
    let img = new Image();
    img.src = `https://raw.githubusercontent.com/Taraikovich/stage1-tasks/main/images/${pictureNext}.jpg`
    img.addEventListener('load', () => {
        body.style.backgroundImage = `url("${img.src}")`;
    });
};

function getSlidePrev() {
    let prevPictureNumber = body.style.backgroundImage.slice(-8, -6) * 1 - 1;
    if (prevPictureNumber < 1) prevPictureNumber = 20;
    let picturePrev = body.style.backgroundImage.slice(76, -8) + (prevPictureNumber + '').padStart(2, '0');
    let img = new Image();
    img.src = `https://raw.githubusercontent.com/Taraikovich/stage1-tasks/main/images/${picturePrev}.jpg`
    img.addEventListener('load', () => {
        body.style.backgroundImage = `url("${img.src}")`;
    });
};

async function getWether() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang.lang}&appid=36b79dc83dc782a0d41da40d3313ca94&units=metric`;
    if ((await fetch(url)).ok) {
        const res = await fetch(url);
        const data = await res.json();
        weatherIcon.textContent = '';
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        (Math.floor(data.main.temp) > 0) ? temperature.textContent = `+${Math.round(data.main.temp)} °C` : temperature.textContent = `${Math.round(data.main.temp)} °C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${lang.wind}: ${Math.round(data.wind.speed)} ${lang.windMetrick}`;
        humidity.textContent = `${lang.humidity}: ${data.main.humidity} %`;
    } else {
        weatherIcon.textContent = `${lang.error.h}`;
        temperature.textContent = `${lang.error.text}`;
        weatherIcon.className = 'weather-icon owf';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
    };
};


async function getQuotes() {
    const quotes = `./assets/quote${lang.lang}.json`;
    const res = await fetch(quotes);
    const data = await res.json();
    let number = Math.floor(Math.random() * (data.length - 1) + 1);
    quote.textContent = `"${data[number].text}"`;
    quoteAuthor.textContent = `- ${data[number].author}`;
}
let start;
let stopTimeer;
function playAudio() {
    audio.src = playList[playNum].src;
    timeLine.children[0].textContent = playList[playNum].title;
    let currentTime = `${((Math.floor(audio.currentTime / 60) + '').padStart(2, '0'))}:${((Math.floor(audio.currentTime) - Math.floor(audio.currentTime / 60) * 60) + '').padStart(2, '0')}`;
    let duration = ` / ${playList[playNum].duration}`;
    timeLine.children[2].textContent = currentTime + duration;

    audio.currentTime = stopTimeer || 0;
    if (!isPlay) {
        audio.play();
        isPlay = true;
        start = setInterval(showTimeLine, 500);
    } else {
        audio.pause();
        isPlay = false;
        clearInterval(start);
    };
    playBtn.classList.toggle('pause');
    if (isPlay) {
        playListContainer.children[playNum].classList.toggle('item-active');
    } else {
        playListContainer.children[playNum].classList.toggle('item-active');
    };

};

function showTimeLine() {
    let currentTime = `${((Math.floor(audio.currentTime / 60) + '').padStart(2, '0'))}:${((Math.floor(audio.currentTime) - Math.floor(audio.currentTime / 60) * 60) + '').padStart(2, '0')}`;
    let duration = ` / ${playList[playNum].duration}`;
    timeLine.children[1].children[0].style.width = `${audio.currentTime / audio.duration * 100}%`;
    point.style.left = timeLine.children[1].children[0].offsetWidth + 'px';
    if (timeLine.children[1].children[0].offsetWidth === 0) point.style.left = '0px';
    if (timeLine.children[1].children[0].offsetWidth >= 235) point.style.left = '235px';
    timeLine.children[2].textContent = currentTime + duration;
    stopTimeer = audio.currentTime;
};

function playNext() {
    playListContainer.children[playNum].classList.remove('item-active');
    stopTimeer = 0;
    playNum += 1;
    if (playNum > playList.length - 1) playNum = 0;
    if (isPlay) {
        isPlay = false;
        playAudio();
    } else {
        isPlay = true;
        playAudio();
        playListContainer.children[playNum].classList.remove('item-active');
    };
    // playListContainer.children[playNum].classList.remove('item-active');
    playBtn.classList.toggle('pause');
    timeLine.children[1].children[0].style.width = `0%`;
};

function playPrev() {
    stopTimeer = 0;
    playListContainer.children[playNum].classList.remove('item-active');
    playNum -= 1;
    if (playNum < 0) playNum = playList.length - 1;
    if (isPlay) {
        isPlay = false;
        playAudio();
    } else {
        isPlay = true;
        playAudio();
        playListContainer.children[playNum].classList.remove('item-active');
    };

    playBtn.classList.toggle('pause');
    timeLine.children[1].children[0].style.width = `0%`;
};

function createPlayList() {
    playList.forEach(elemnt => {
        const li = document.createElement('li');
        li.classList.add('play-item');
        li.textContent = elemnt.title;
        playListContainer.append(li);
    });
};

showTime();
getQuotes();
setBg();
createPlayList();



window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);
window.addEventListener('load', () => {
    isPlay = true;
    playAudio();
    playBtn.classList.toggle('pause');
    playListContainer.children[playNum].classList.remove('item-active');
});
city.addEventListener('change', getWether);
changeQuote.addEventListener('click', getQuotes);
playBtn.addEventListener('click', playAudio);
playPrevBtn.addEventListener('click', playPrev);
playNextBtn.addEventListener('click', playNext);
audio.addEventListener('ended', playNext);
nextBtn.addEventListener('click', getSlideNext);
prevBtn.addEventListener('click', getSlidePrev);
timeLine.children[1].addEventListener('click', (event) => {
    audio.currentTime = audio.duration * ((event.clientX - timeLine.children[1].getBoundingClientRect().left) / 250);
    stopTimeer = audio.duration * ((event.clientX - timeLine.children[1].getBoundingClientRect().left) / 250);
    timeLine.children[1].children[0].style.width = `${audio.currentTime / audio.duration * 100}%`;
    point.style.left = timeLine.children[1].children[0].offsetWidth + 'px';
    if (timeLine.children[1].children[0].offsetWidth === 0) point.style.left = '0px';
    if (timeLine.children[1].children[0].offsetWidth >= 235) point.style.left = '235px';
});

let playListLi = document.querySelectorAll('.play-list li');
playListLi.forEach((element, index) => {
    element.addEventListener('click', () => {

        if (isPlay && index !== playNum) {
            isPlay = false;
            audio.currentTime = 0;
            playNext()
            playBtn.classList.toggle('pause');
        };
        if (index !== playNum) stopTimeer = 0;
        playNum = index;
        playAudio();
    });
});

let volume = document.querySelector('.set-volume');
audio.volume = 0.7;
// let degreeVolume = audio.volume;
volume.children[1].children[0].style.width = `${audio.volume * 100}px`;
volume.children[0].addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.volume = 0;
        volume.children[0].classList.toggle('muted');
    } else {
        audio.volume = volume.children[1].children[0].getBoundingClientRect().width / 100;
        volume.children[0].classList.toggle('muted');
    }
});
volume.children[1].addEventListener('click', (e) => {
    volume.children[1].children[0].style.width = `${e.clientX - volume.children[1].getBoundingClientRect().left}px`;
    audio.volume = volume.children[1].children[0].getBoundingClientRect().width / 100;
    volDot.style.left = volume.children[1].children[0].style.width;
    // degreeVolume = audio.volume;
});

let volDot = document.querySelector('.volDot');
volDot.onmousedown = function (event) {
    event.preventDefault();
    let shiftX = event.clientX - volume.children[1].getBoundingClientRect().left;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event) {
        let newLeft = event.clientX - volume.children[1].getBoundingClientRect().left;
        if (newLeft < 0) newLeft = 0;
        if (newLeft > 100) newLeft = 100;
        volume.children[1].children[0].style.width = `${newLeft}px`;
        volDot.style.left = newLeft + 'px';
        audio.volume = newLeft / 100;
    };

    function onMouseUp() {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
    };
};

let point = document.querySelector('.point');
point.onmousedown = function (event) {
    let shiftX = event.clientX - point.getBoundingClientRect().left;
    // let startWidth = timeLine.children[1].children[0].offsetWidth;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    function onMouseMove(event) {
        let newLeft = event.clientX - shiftX - timeLine.children[1].getBoundingClientRect().left;
        let newWidth = point.getBoundingClientRect().left - timeLine.children[1].getBoundingClientRect().left;

        if (newLeft < 0) {
            newLeft = 0;
            newWidth = 0;
        }
        let rightEdge = timeLine.children[1].offsetWidth - point.offsetWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }
        if (newWidth > 250) newWidth = '250px';

        point.style.left = newLeft + 'px';
        timeLine.children[1].children[0].style.width = `${newWidth}px`;
        stopTimeer = audio.duration * (newWidth / 250);
        audio.currentTime = audio.duration * (newWidth / 250);
    };

    function onMouseUp(event) {
        point.style.left = event.clientX - timeLine.children[1].getBoundingClientRect().left;
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('mousemove', onMouseMove);
    };
};

timeLine.children[1].ondragstart = function () {
    return false;
};

volDot.ondragstart = function () {
    return false;
};

let setBtn = document.querySelector('.setBtn');
let settings = document.querySelector('.settings');

function showSettings() {
    settings.classList.toggle('settings-hide');
    setBtn.classList.toggle('setBtn-open');
    if (setBtn.textContent.length > 0) {
        setBtn.textContent = '';
    } else {
        setBtn.textContent = lang.settings.btn;
    }
    console.log('0');
};

setBtn.addEventListener('click', showSettings);

let lengBtn = document.querySelectorAll('.flag');
let langSub = document.querySelector('.language');



lengBtn.forEach((el, i) => {
    el.addEventListener('click', () => {
        if (i === 0) {
            lang =
            {
                lang: 'en',
                city: 'Minsk',
                wind: 'Wind speed',
                windMetrick: 'm/s',
                humidity: 'Humidity',
                settings:
                {
                    btn: 'SETTINGS',
                    text: 'Language:'
                },
                error:
                {
                    h: 'ERROR',
                    text: 'city not found'
                },
                date:
                {
                    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                },
                greeting:
                {
                    night: 'Good night,',
                    morning: 'Good morning,',
                    afternoon: 'Good afternoon,',
                    evening: 'Good evening,',
                    placeholder: '[enter your name]'
                }
            };
        } else {
            lang =
            {
                lang: 'ru',
                city: 'Минск',
                wind: 'Скорость ветра',
                windMetrick: 'м/с',
                humidity: 'Влажность',
                settings:
                {
                    btn: 'НАСТРОЙКИ',
                    text: 'Язык:'
                },
                error:
                {
                    h: 'Ошибка',
                    text: 'город не найден'
                },
                date:
                {
                    weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
                    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
                },
                greeting:
                {
                    night: 'Доброй ночи,',
                    morning: 'Доброе утро,',
                    afternoon: 'Добрый день,',
                    evening: 'Добрый вечер,',
                    placeholder: '[введите свое имя]'
                }
            };
        };
        getWether();
        showTime();
        getQuotes();
        getLocalStorage();
        langSub.children[0].textContent = lang.settings.text;
    })
});

console.log(`
Score: 123/ 150
Часы и календарь +15
время выводится в 24-часовом формате, например: 21:01:00 +5
время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается) +5
выводится день недели, число, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня" +5
Язык и формат вывода даты определяется языком приложения.
при изменении дня недели, даты, месяца эти данные меняются в приложении (в ходе кросс-чека этот пункт не проверяется)
Приветствие +10
текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь) +5
с 6:00 до 11:59 - Good morning / Доброе утро / Добрай раніцы
с 12:00 до 17:59 - Good afternoon / Добрый день / Добры дзень
с 18:00 до 23:59 - Good evening / Добрый вечер / Добры вечар
с 00:00 до 5:59 - Good night / Доброй/Спокойной ночи / Дабранач
при изменении времени суток, если в это время приложение открыто, меняется текст приветствия (в ходе кросс-чека этот пункт не проверяется)
пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется, данные о нём хранятся в local storage +5
Смена фонового изображения +20
При загрузке или перезагрузке приложения фоновое изображение выбирается из расположенной на GitHub коллекции изображений.
Репозиторий с изображениями необходимо форкнуть, и использовать изображения форкнутого репозитория, а не школьного.
Сами изображения желательно оптимизировать, например, конвертировать в формат WebP с целью уменьшения веса и увеличения скорости загрузки.
Также можно использовать свою собственную коллекцию изображений.
Скачать картинки на компьютер и использовать локальные файлы нельзя.
ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20) +5
Пример ссылки на фоновое изображение: https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/evening/18.jpg, здесь
evening - время суток, другие значения afternoon, morning, night
18 - рандомный (случайный) номер изображения, от 01 до 20.
изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана.
изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке) +5
изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке) +5
при смене слайдов важно обеспечить плавную смену фоновых изображений. Не должно быть состояний, когда пользователь видит частично загрузившееся изображение или страницу без фонового изображения. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения +5
Виджет погоды +15
город по умолчанию - Минск, пока пользователь не ввёл другой город
при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage +5
для указанного пользователем населённого пункта выводятся данные о погоде, если их возвращает API
данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел +5
выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) +5
Виджет цитата дня +10
при загрузке страницы приложения отображается рандомная цитата и её автор +5
В качестве источника цитаты можно использовать как API, так и созданный вами или найденный в интернете JSON-файл с цитатами и их авторами. API с цитатами не отличаются надёжностью и долговечностью, используемый в качестве источника цитат собственный JSON-файл гарантирует работоспособность вашего приложения. Запросы к JSON также осуществляются асинхронно, таким образом необходимые знания о работе с асинхронными запросами вы получите
при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую) +5
Аудиоплеер +15
при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause +3
при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play +3
треки можно пролистывать кнопками Play-next и Play-prev
треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev) +3
трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем +3
после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. +3
Для удобства проверки треки возьмите небольшой продолжительности. Обрезать треки можно здесь: https://mp3cut.net/ru/
плейлист генерируется средствами JavaScript (в ходе кросс-чека этот пункт не проверяется)
Продвинутый аудиоплеер (реализуется без использования библиотек) +20
примерные внешний вид и функциональность плеера https://howlerplayer.github.io/
добавлен прогресс-бар в котором отображается прогресс проигрывания +3
при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека +3
над прогресс-баром отображается название трека +3
отображается текущее и общее время воспроизведения трека +3
есть кнопка звука при клике по которой можно включить/отключить звук +2
добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука +3
можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте +3
Перевод приложения на два языка (en/ru или en/be) +15
Для перевода приложения может использоваться библиотека, например, i18n или аналогичная.
переводится язык и меняется формат отображения даты +3
переводится приветствие и placeholder +3
переводится прогноз погоды в т.ч описание погоды (OpenWeatherMap API предоставляет такую возможность) и город по умолчанию +3
переводится цитата дня (используйте подходящий для этой цели API, возвращающий цитаты на нужном языке или создайте с этой целью JSON-файл с цитатами на двух языках) +3
переводятся настройки приложения. При переключении языка приложения в настройках, язык настроек тоже меняется +3
не переводятся данные, которые вводит пользователь: имя, город, тег для получения фонового изображения от API
Настройки приложения +20
в настройках приложения можно указать язык приложения (en/ru или en/be) +3
`)








