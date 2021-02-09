const APIID = "ad0ac530c9126d51a5ba8e160be31b09"
const urlAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=48.9167&lon=2.55&units=metric&lang=fr&appid=${APIID}`;

const dateNow = new Date();
fetch(urlAPI)
.then(r => r.json())
.then(result => {
    document.querySelector('h1').innerHTML = result.current.temp + "°";
    document.getElementById('weather-text').textContent = result.current.weather[0].description;
    document.querySelector('img').setAttribute('src', `http://openweathermap.org/img/wn/${result.current.weather[0].icon}@2x.png`);
    document.getElementById('weather-min').textContent = result.daily[0].temp.min;
    document.getElementById('weather-max').textContent = result.daily[0].temp.max;
    document.getElementById('day-letter').textContent = getTime({ weekday: 'long' });
    document.getElementById('day').textContent = getTime({ day: '2-digit' });
    document.getElementById('month-letter').textContent = getTime( { month: 'long' });
    document.getElementById('maj').textContent = `${dateNow.getHours()}h ${dateNow.getMinutes()}m`;
})

function getTime(options) {
    return dateNow.toLocaleDateString('Fr-fr', options);
}