const APIID = "1b80a43843a074455ece98fbe1997942";
const urlAPIpre = `https://api.openweathermap.org/data/2.5/onecall?units=metric&lang=fr&exclude=hourly,alerts,minutely`;
let dateNow = null;
let nextButton = document.getElementById('next');
let previousButton = document.getElementById('previous');
let dropButton = document.getElementById('drop');
let index = 0;
let images = [];
let cities = JSON.stringify(localStorage.getItem('cities')) || [];

const colorTransparent = 'rgba(0,0,0,0)';

if (Object.keys(getCities()).lexngth === 0) {
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
    // city[ID()] = coords;
    localStorage.setItem("cities", JSON.stringify(city));
}

function getTime(options, dt = new Date()) {
    return dt.toLocaleDateString('Fr-fr', options);
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
    // document.querySelector(".weather-container").dataset.id = id;
    fetch(urlAPI)
    .then(r => r.json())
    .then(result => {
        document.querySelector('h1').textContent = result.current.temp + "°";
        document.getElementById('weather-text').textContent = result.current.weather[0].description;
        document.querySelector('img').setAttribute('src', `https://openweathermap.org/img/wn/${result.current.weather[0].icon}@2x.png`);
        document.getElementById('weather-min').textContent = result.daily[0].temp.min;
        document.getElementById('weather-max').textContent = result.daily[0].temp.max;
        document.getElementById('day-letter').textContent = getTime({ weekday: 'long' });
        document.getElementById('day').textContent = getTime({ day: '2-digit' });
        document.getElementById('month-letter').textContent = getTime({ month: 'long' });
        document.getElementById('maj').textContent = dateToString(new Date());
        document.getElementById('sunrise').textContent = dateToString(new Date(result.current.sunrise * 1000));
        document.getElementById('sunset').textContent = dateToString(new Date(result.current.sunset * 1000));

        // graph

        clearChart();
        result.daily.forEach(day => {
            // { x: new Date(2016, 00, 01), y: [7, 18] }
            // { label: "Monday", y: [15, 26], name: "rainy" }
            updateChart({
                label: getTime({ weekday: 'long' }, new Date(day.dt * 1000)),
                y: [day.temp.min, day.temp.max],
                icon: day.weather[0].icon,
            });

        });

        addImages(chart);
        // console.log(getTime({ weekday: 'long' }, ))
        // console.log( getTime({weekday: 'long'}, new Date(result.daily[7].dt * 1000)) );

        // let min = [];
        // let max = [];

        // clearChart();

        // let firstDay = true;
        // result.daily.forEach(day => {
        //     const dayName = getTime({ weekday: 'long' }, new Date(day.dt * 1000));
        //     if (firstDay) {
        //         firstDay = false;
        //     } else {
        //         updateLabels(dayName);
        //         min.push(day.temp.min);
        //         max.push(day.temp.max);
        //     }
        // });
        // console.log(result.daily[0])
        // updateDatas({ label: 'min', data: min, borderColor: 'rgb(30,144,255)', backgroundColor: colorTransparent });
        // updateDatas({ label: 'max', data: max, borderColor: 'rgb(255,99,71)', backgroundColor: colorTransparent });

    });

    fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lon}&lat=${lat}`)
    .then(r => r.json())
    .then(result => {
        console.log(result.features[0].properties.city);
        document.getElementById('city').textContent = result.features[0].properties.city;
        // chart.title.text = "Météo de la semaine à " + result.features[0].properties.city;
        // chart.render();
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
        // removeEvent();
        loadWeather(i);
    }

    function previous() {
        i = (i - 1 < 0) ? len(cities) - 1 : i - 1;
        // removeEvent();
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

// var ctx = document.getElementById('myChart').getContext('2d');
// var myChart = new Chart(ctx, {
//     type: 'line',
//     labels: [],
//     data: {
//         label: [],
//         datasets: []
//     }
// });

// function updateLabels(label) {
//     myChart.data.labels.push(label);
//     myChart.update();
// }

// function updateDatas(dataset) {
//     // myChart.data.datasets = [];
//     myChart.data.datasets.push(dataset);
//     myChart.update();
// }

function updateChart(data) {
    chart.options.data[0].dataPoints.push(data);
    chart.render();
}

function clearChart() {
    removeImages();
    images = [];
    chart.data[0].dataPoints = [];
    chart.data[0].options.dataPoints = [];
}

// function clearChart() {
//     myChart.data.labels = [];
//     myChart.data.datasets = [];
//     myChart.update();
// }

var chart = new CanvasJS.Chart("chartContainer", {
    // exportEnabled: true,
    animationEnabled: true,
    backgroundColor: "#a4ebf3",
    title: {
        text: "Météo de la semaine à "
    },
    axisY: {
        maximum: 40,
        title: "Température (°C)",
        suffix: " °C",
        gridThickness: 0
    },
    data: [{
        type: "rangeSplineArea",
        fillOpacity: 0,
        color: "#174874 eq²²²3214",
        lineColor: "#2e6da4",
        indexLabel: "{y[#index]}°",
        labelValueFormatString: "DDDD",
        toolTipContent: "{label} </br> <strong>Température: </strong> </br> Min: {y[0]} °C, Max: {y[1]} °C",
        dataPoints: [],
    }]
});
chart.render();

function removeImages() {
    images.forEach(img => {
        $("#chartContainer>.canvasjs-chart-container ." + img.attr('class')).remove();
    });
}

function addImages(chart) {
    for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
        const icon = chart.data[0].dataPoints[i].icon;
        images.push($("<img>").attr("src", `https://openweathermap.org/img/wn/${icon}@2x.png`));
        images[i].attr("class", icon).appendTo($("#chartContainer>.canvasjs-chart-container"));
        positionImage(images[i], i);
    }
}

function positionImage(image, index) {
    var imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[index].x);
    var imageTop = chart.axisY[0].convertValueToPixel(chart.axisY[0].maximum);

    image.width("40px").css({
        "left": imageCenter - 20 + "px",
        "position": "absolute", "top": imageTop + "px",
        "position": "absolute"
    });
}

$(window).resize(function () {
    let imageCenter = 0;
    for (var i = 0; i < chart.data[0].dataPoints.length; i++) {
        imageCenter = chart.axisX[0].convertValueToPixel(chart.data[0].dataPoints[i].x) - 20;
        images[i].css({ "left": imageCenter });
    }
});
