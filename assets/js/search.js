let searchInput = document.getElementById('search');
let searchForm = document.getElementById('search-form');
let searchResultDiv = document.getElementById('search-result');
const urlApiAddress = "https://api-adresse.data.gouv.fr/search/?q=";

// if (!geo) {
//     var geo = {
//         lat: 1,
//         lon: 1,
//     }
// }

searchInput.addEventListener('input', () => {
    const search = searchInput.value;
    if (search === "") hideSearchInput();
    else {
        searchResultDiv.classList.remove("hide");
        const urlSearch = urlApiAddress + searchInput.value.split(' ').join('+');
        fetch(urlSearch)
        .then(res => res.json())
        .then(result => {
            searchResultDiv.innerHTML = "";
            result.features.forEach(el => {
                let aEl = document.createElement('a');
                addGeo(aEl, el.geometry.coordinates);
                aEl.textContent = el.properties.label;
                aEl.href = "#";
                aEl.addEventListener('click', searchAClick);
                searchResultDiv.append(aEl);
            });
            addGeo(searchInput, result.features[0].geometry.coordinates);
        });
        
    }
});

searchForm.addEventListener('submit', searchSubmit);

function searchSubmit(e) {
    e.preventDefault()
    // searchForm.removeEventListener('submit', searchSubmit);
    if (searchInput.dataset.lon !== "none") {
        /*
            { 
                id: {lat: 48, lon: 3 },
                id2: {lat: 48, lon: 3 },
            }
        */
        let cities = JSON.parse(localStorage.getItem("cities")) || {};
        cities[ID()] = { lat: searchInput.dataset.lat, lon: searchInput.dataset.lon };
        localStorage.setItem("cities", JSON.stringify(cities));
        console.log(cities);
        // loadWeather();
        window.location.reload();
        hideSearchInput();
    }
}

function hideSearchInput() {
    searchResultDiv.classList.add("hide");
    searchInput.dataset.lon = searchInput.dataset.lat = "none";
}

function searchAClick(e) {
    e.preventDefault()
    console.log(e.target.dataset);
    searchInput.value = e.target.textContent;
    // searchInput.dataset = e.target.dataset;
    searchInput.dataset.lon = e.target.dataset.lon;
    searchInput.dataset.lat = e.target.dataset.lat;
}

function addGeo(el, geoArr) {
    el.dataset.lon = geoArr[0];
    el.dataset.lat = geoArr[1];
}

let ID = function () {
    // https://gist.github.com/gordonbrander/2230317
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
};
