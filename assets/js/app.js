const APIID = "1b80a43843a074455ece98fbe1997942";
const urlAPIpre = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lang=fr&exclude=hourly,alerts,minutely`;
let dateNow = null;
let nextButton = document.getElementById('next');
let previousButton = document.getElementById('previous');
let dropButton = document.getElementById('drop');
let index = 0;

if (Object.keys(getCities()).length === 0) {
    if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(successGeo, errorGeo);
    } else {
        errorGeo();
        console.log("Geolocation is not supported by this browser.");
    }
}

function getCities() {
    return JSON.parse(localStorage.getItem("cities"));
}
// errorGeo();

function successGeo(pos) {
    addGeoToStorage({ lat: pos.coords.latitude, lon: pos.coords.longitude });
}

function errorGeo(params) {
    addGeoToStorage({ lat: 48.8534, lon: 2.3488 })
}

function addGeoToStorage(coords) {
    let city = {}
    city[ID()] = { lat: coords.lat, lon: coords.lon };
    localStorage.setItem("cities", JSON.stringify(city));
}

function getTime(options) {
    return dateNow.toLocaleDateString('Fr-fr', options);
}

function dateToString(date) {
    return `${date.getHours()}h${(date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes()}`;
}

function loadWeather(i=0) {
    index++;
    console.log(index);
    let cities = getCities();
    const id = Object.keys(cities)[i];
    const { lon, lat } = cities[id];
    const urlAPI = urlAPIpre + `&lat=${lat}&lon=${lon}&appid=${APIID}`;
    dateNow = new Date();
    // document.querySelector(".weather-container").dataset.id = id;
    fetch(urlAPI)
    .then(r => r.json())
    .then(result => {
        document.querySelector('h1').textContent = result.current.temp + "°";
        document.getElementById('weather-text').textContent = result.current.weather[0].description;
        document.querySelector('img').setAttribute('src', `http://openweathermap.org/img/wn/${result.current.weather[0].icon}@2x.png`);
        document.getElementById('weather-min').textContent = result.daily[0].temp.min;
        document.getElementById('weather-max').textContent = result.daily[0].temp.max;
        document.getElementById('day-letter').textContent = getTime({ weekday: 'long' });
        document.getElementById('day').textContent = getTime({ day: '2-digit' });
        document.getElementById('month-letter').textContent = getTime({ month: 'long' });
        document.getElementById('maj').textContent = dateToString(dateNow);
        document.getElementById('sunrise').textContent = dateToString(new Date(result.current.sunrise * 1000));
        document.getElementById('sunset').textContent = dateToString(new Date(result.current.sunset * 1000));

    });
    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`)
    .then(r => r.json())
    .then(result => {
        console.log(result.features[0].properties.city);
        document.getElementById('city').textContent = result.features[0].properties.city;
    });
    
    if (len(getCities()) <= 1) {
        previousButton.disabled = nextButton.disabled = dropButton.disabled = true;
    } else {
        previousButton.disabled = nextButton.disabled = dropButton.disabled = false;
    }

    nextButton.addEventListener('click', next);

    previousButton.addEventListener('click', previous);
    
    function next() {
        i = (i + 1 >= len(cities)) ? 0 : i + 1;
        removeEvent();
        loadWeather(i);
    }

    function previous() {
        i = (i - 1 < 0) ? len(cities) - 1 : i - 1;
        removeEvent();
        loadWeather(i);
    }

    function removeEvent() {
        nextButton.removeEventListener("click", next);
        previousButton.removeEventListener("click", previous);
    }

    dropButton.addEventListener("click", drop);

    function drop(e) {
        e.preventDefault();
        console.log(id)
        dropButton.removeEventListener("click", drop);
        if (len(cities) > 1) {
            delete cities[id];
            localStorage.setItem("cities", JSON.stringify(cities));
            // loadWeather();
            window.location.reload();
        }
    }

}

loadWeather();


function len(param) {
    if (param instanceof Object) {
        return Object.keys(param).length;
    }
    console.error("error ", param, "is not instant of Object");
    return null;
}