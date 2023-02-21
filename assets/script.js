//API key
const APIKey = 'b021cd3fa8ba82e69ade9c4e24ffde08';

//Search/History section HTML elements
var searchCity = $('#searchCity');
var clearHistory = $('#clearHistory');
var searchBtn = $('#searchBtn');

// Current day HTML elements
var curWeather = $('#curWeather');
var curCity = $('#curCity');
var curTemp = $('#curTemp');
var curWind = $('#curWind');
var curHumidity = $('#curHumidity');

var storedCities = JSON.parse(localStorage.getItem('city-name'));

// Initializing cords
var cord = {
    lon: 0,
    lat: 0
}

// Buttons
$('#searchBtn').on('click', disWeatherSearch);
$('#clearHistory').on('click', clearSearchHistory);

// Display search
function disWeatherSearch(e) {
    e.preventDefault();
    searchHistory();
    if(searchCity.val().trim() !== "") {
        converter(searchCity.val().trim());
    } else {
        alert("Please enter a city name");
    }
}

// Grabbing API data
function currWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${cord.lat}&lon=${cord.lon}&units=metric&appid=${APIKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        $(curCity).html(data.city.name);
        $(curTemp).html(data.list[5].main.temp + '°C');
        $(curWind).html(data.list[5].wind.speed + ' kph');
        $(curHumidity).html(data.list[5].main.humidity + '%');
    })
}

// City name to lon/lat
function converter(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${APIKey}`)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if (!data.length) {
            alert('City name must exist');
        } else {
            cord.lon = data[0].lon;
            cord.lat = data[0].lat;
            // console.log(data);
            // Setting items in local storage here to avoid adding empty strings and city names that don't exist
            storedCities = storedCities || [];
            storedCities.push(searchCity.val().trim());
            localStorage.setItem('city-name', JSON.stringify(storedCities)); 
        }
    })
    .then(function () {
        currWeather();
    })
}

function searchHistory() {
     
    for (let i = 0; i < storedCities.length; i++) {
        var listEl = $(`<li>${storedCities[i]}</li>`);
        $(listEl).attr('class', 'list-group-item-' + [i] + ' btn btn-block mt-2');
        $(".list-group").append(listEl);

        $('.list-group-item-' + [i]).on("click", function() {
            console.log("ive been clicked ", storedCities[i]);
        })
    }
       
}

searchHistory();

function clearSearchHistory(e) {
    e.preventDefault();
    localStorage.clear();
    document.location.reload();
}