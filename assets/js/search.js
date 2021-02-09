let searchInput = document.getElementById('search');
let searchForm = document.getElementById('search-form');
let searchResultDiv = document.getElementById('search-result');
const urlApiAddress = "https://api-adresse.data.gouv.fr/search/?q=";

if (!geo) {
    var geo = {
        lat: 1,
        lon: 1,
    }
}

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

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (searchInput.dataset.lon !== "none") {
        geo.lon = searchInput.dataset.lon;
        geo.lat = searchInput.dataset.lat;
        console.log(geo);
        hideSearchInput();
    }
})

function hideSearchInput() {
    searchResultDiv.classList.add("hide");
    searchInput.dataset.lon = searchInput.dataset.lat = "none";
}

function searchAClick(e) {
    e.preventDefault()
    searchInput.value = e.target.textContent;
    searchInput.dataset = e.target.dataset;
}

function addGeo(el, geoArr) {
    el.dataset.lon = geoArr[0];
    el.dataset.lat = geoArr[1];
}
