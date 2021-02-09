let searchInput = document.getElementById('search');
let searchForm = document.getElementById('search-form');
let searchResultDiv = document.getElementById('search-result');
const urlApiAddress = "https://api-adresse.data.gouv.fr/search/?q=";


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
                aEl.dataset.city = el.properties.postcode;
                aEl.textContent = el.properties.label;
                aEl.href = "#";
                aEl.addEventListener('click', searchAClick);
                searchResultDiv.append(aEl);
            });
            searchInput.dataset.search = result.features[0].properties.postcode;
        });
        
    }
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if (searchInput.dataset.search !== "none") {
        const save = searchInput.dataset.search;
        hideSearchInput();
        console.log(save);
    }
})

function hideSearchInput() {
    searchResultDiv.classList.add("hide");
    searchInput.dataset.search = "none";
}

function searchAClick(e) {
    e.preventDefault()
    searchInput.value = e.target.textContent;
    searchInput.dataset.search = e.target.dataset.city;
}
