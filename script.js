const app = document.querySelector('#app');
const loader = document.querySelector('.lds-spinner');
const widget = document.querySelector('#widget');
const popup = document.querySelector('#popup');
const popupInput = document.querySelector('#popup .popup__input');
const popupBtn = document.querySelector('#popup .popup__btn');
const chooseNewCityBtn = document.querySelector('#choosenewcity');
const URLAPI = 'https://api.openweathermap.org/data/2.5/weather';
const APIKey = 'ef5e642f38ab90f576544232a2ec299e';
const unitsOfMeasurement = 'metric'

let store = {
  city: "London",
  name: '',
  temp: 0,
  tempMin: 0,
  tempMax: 0,
  pressure: 0,
  humidity: 0,
  speed: 0,
  deg: 0,
  gust: 0,
  cloudsAll: 0,
  sunrise: 0,
  sunset: 0,
  weatherMain: '',
  timezone: 0,
}

const fetchData = async () => {
  const response = await fetch(`${URLAPI}?q=${store.city}&appid=${APIKey}&units=${unitsOfMeasurement}`);
  const data = await response.json();

  const {
    name,
    timezone,
    main: {
      temp,
      temp_min: tempMin,
      temp_max: tempMax,
      pressure,
      humidity,
    },
    wind: {
      speed,
      deg,
      gust,
    },
    clouds: {
      all: cloudsAll,
    },
    sys: {
      sunrise,
      sunset
    },
    weather: [
      main,
    ]
  } = data;

  store = {
    ...store,
    name,
    timezone,
    temp,
    tempMin,
    tempMax,
    pressure,
    humidity,
    speed,
    deg,
    gust,
    cloudsAll,
    sunrise,
    sunset,
    main
  }

  renderComponent();

}

function renderComponent() {
  const {
    city,
    timezone,
    name,
    temp, 
    tempMin, 
    tempMax, 
    pressure, 
    humidity, 
    speed, 
    deg, 
    gust, 
    cloudsAll, 
    sunrise, 
    sunset, 
    main} = store;
  const checkedGust = gust === true ? gust : "";
  let directionWind ='';
  let localTime = timezone / 3600;

  if (deg < 90) {
    directionWind ='north';
  } else if (deg < 180){
    directionWind ='west';
  } else if (deg < 2700){
    directionWind ='south';
  } else {
    directionWind ='east';
  };


  widget.innerHTML = `

  <div class="widget__header">
    <div class="widget__left">
      <div class="widget__date">${moment().format("DD.MM.YYYY")}</div>
      <div class="widget__time">${moment().utcOffset(localTime).format('HH:mm')}</div> 
      <div class="widget__day">${moment().format("dddd")}</div>
    </div>
    <div class="widget__center">
      <div class="widget__image"><img src="http://openweathermap.org/img/wn/${main.icon}@4x.png" alt=""></div>
    </div>
    <div class="widget__right">
      <div class="widget__city" id="#widgetcity">${name}</div>
      <div class="widget__temperature">${Math.floor(temp)}°C</div>
      <div class="widget__min-max">${Math.floor(tempMin)}/${Math.floor(tempMax)}°C, ${main.main}</div>
    </div>
  </div>
  <div class="widget__content">
    <ul class="widget__list">
      <li class="widget__item">
        <div class="widget__title">Pressure</div>
        <div class="widget__subtitle">${pressure}mm</div>
      </li>
      <li class="widget__item">
        <div class="widget__title">Humidity</div>
        <div class="widget__subtitle">${humidity}%</div>
      </li>
      <li class="widget__item">
        <div class="widget__title">Wind speed</div>
        <div class="widget__subtitle">${speed}m/s</div>
      </li>
      <li class="widget__item">
        <div class="widget__title">Direction of the wind</div>
        <div class="widget__subtitle">${directionWind}</div>
      </li>
      <li class="widget__item">
        <div class="widget__title">Sunrise</div>
        <div class="widget__subtitle">${moment.unix(sunrise).format("HH:mm")}</div>
      </li>
      <li class="widget__item">
        <div class="widget__title">Sunset</div>
        <div class="widget__subtitle">${moment.unix(sunset).format("HH:mm")}</div>
      </li>
      <li class="widget__item">
        <div class="widget__title">Cloudy</div>
        <div class="widget__subtitle">${cloudsAll}%</div>
    </li>
    </ul>
  </div>

  `
}

fetchData();

function toogleWindow() {
  widget.classList.toggle('hide');
  popup.classList.toggle('hide');
  loader.classList.toggle('hide');
}

function seekCity(e) {
  e.preventDefault();
  store.city = popupInput.value;

  toogleWindow();
  fetchData();
}

popupBtn.addEventListener('click', seekCity);
chooseNewCityBtn.addEventListener('click', toogleWindow);

