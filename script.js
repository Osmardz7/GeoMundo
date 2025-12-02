const btn = document.querySelector('button');
const countries = document.querySelector('#countries');
const countriesUrl = 'https://restcountries.com/v3.1/all?fields=flags,name,capital,region,population,area,languages,currencies,borders,maps';
const inputCountry = document.getElementById("searchInput");
const countriesContainer = document.getElementById("countries");
const regionFilter = document.getElementById("regionFilter");
let regionCountries = [];

function generateHTML(data) {
    let html = '';
    data.map (country => {
        const languages = country.languages
        ?Object.values(country.languages).join(", ") : "Não informado";

        const currencies = country.currencies
        ? Object.values(country.currencies).map (c => `${c.name} (${c.symbol})`).join(", "): "Não informado";

        const borders = country.borders?.length
        ?country.borders.join(", ") : "Não informada(s)";

        const map = country.maps?.googleMaps || "Mapa não disponível"
        html += `
        <div>
            <h2>${country.name.common}</h2>
            <img src="${country.flags.png}" alt="">
            <p><strong>Nome Oficial = </strong>${country.name.official}</p>
            <p><strong>Capital = </strong>${country.capital}</p>
            <p><strong>Região = </strong>${country.region}</p>
            <p><strong>População = </strong>${country.population.toLocaleString('pt-BR')}</p>
            <p><strong>Área = </strong>${country.area.toLocaleString('pt-BR')} km²</p>
            <p><strong>Idiomas = </strong>${languages}</p>
            <p><strong>Moeda = </strong>${currencies}</p>
            <p><strong>Fronteira(s) = </strong>${borders}</p>
            <p><strong>Localização = </strong><a class="map-btn" href="${map}" target="_blank">Ver mapa</a></p>
        </div>
        `;
    })
    countries.innerHTML = html;
}

regionFilter.addEventListener("change", () => {
    const selected = regionFilter.value;

    if (selected === "") {
        generateHTML(regionCountries);
        return;
    }
    const filtered = regionCountries.filter(
        country => country.region === selected
    );
    generateHTML(filtered);
});

btn.addEventListener ('click', (event) => {
    event.target.innerHTML = '<div class="loader"></div>';

    fetch (countriesUrl)
    .then (response => response.json())
    .then(data => {
        regionCountries = data;
        generateHTML(data);
    })
    .catch (err => {
        countries.innerHTML = '<h3>Erro ao mostrar dados</h3>';
        console.log(err);
    })
    .finally(() => btn.remove());
});

inputCountry.addEventListener ("keypress", function (event) {
    if (event.key === "Enter") {
        const countryName = inputCountry.value.trim();
    if (countryName === "") {
        inputCountry.value ="";
        inputCountry.placeholder ="Digite o nome de um país !"
    }
        fetchCountry(countryName);
    }
});

function showCountry(country) {
    const languages = country.languages
    ?Object.values(country.languages).join(", ") : "Não informado";

    const borders = country.borders?.length
    ?country.borders.join(", ") : "Não informada(s)";

    const map = country.maps?.googleMaps || "Mapa não disponível"
    countriesContainer.innerHTML = `

        <div class="country-card">
            <h2>${country.name.common}</h2>
            <img src="${country.flags.png}" alt="">
            <p><strong>Nome Oficial = </strong>${country.name.official}</p>
            <p><strong>Capital = </strong> ${country.capital}</p>
            <p><strong>Região = </strong> ${country.region}</p>
            <p><strong>População = </strong> ${country.population.toLocaleString('pt-BR')}</p>
            <p><strong>Área = </strong>${country.area.toLocaleString('pt-BR')} km²</p>
            <p><strong>Idiomas = </strong>${languages}</p>
            <p><strong>Fronteira(s) = </strong>${borders}</p>
            <p><strong>Localização = </strong><a class="map-btn" href="${map}" target="_blank">Ver mapa</a></p>
        </div>
    `;
}

function fetchCountry(name) {
    const url = `https://restcountries.com/v3.1/name/${name}`;

fetch(url)
    .then (response => {
        if (!response.ok) {
            inputCountry.value = "";
            inputCountry.placeholder = "País não encontrado/Inexistente";
        }
        return response.json();
})
    .then(data => {
        showCountry(data[0]);
})
};
