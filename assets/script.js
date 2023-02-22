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

if(!storedCities) {
    storedCities = [];
}

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
    if(searchCity.val().trim() !== "") {
        converter(searchCity.val().trim());
        saveCitySearch();
        newList();
        searchHistory();
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
        // console.log(data);
        $(curCity).html(data.city.name + " " + data.list[0].dt_txt.slice(0, 10));
        $(curTemp).html(data.list[5].main.temp + '°C');
        $(curWind).html(data.list[5].wind.speed + ' kph');
        $(curHumidity).html(data.list[5].main.humidity + '%');
        fiveDay(data);
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
        }
    })
    .then(function () {
        currWeather();
    })
}

function saveCitySearch() {
    storedCities.push(searchCity.val().trim());
    localStorage.setItem('city-name', JSON.stringify(storedCities)); 
}

function searchHistory() {
    // console.log(storedCities);
    for (let i = 0; i < storedCities.length; i++) {
        var listEl = $(`<li>${storedCities[i]}</li>`);

        $(listEl).attr('class', 'list-group-item-' + [i] + ' btn btn-block mt-2');
        $(".list-group").append(listEl);
        $('.list-group-item-' + [i]).on("click", function() {
            converter(storedCities[i]);
        })
    }
}

function fiveDay(data) {
    console.log(data);
    var counter = 0;
    for (let i = 0; i < data.list.length; i++) {
        
        var iconCode = data.list[i].weather[0].icon;
        var imgEl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            if(data.list[i].dt_txt.includes('12:00:00')) {
                counter++
                $('#forecastDate' + counter).html(data.list[i].dt_txt.slice(0, 10));
                $('#forecastTemp' + counter).html(data.list[i].main.temp + '°C');
                $('#wind' + counter).html(data.list[i].wind.speed + ' kph');
                $('#humidity' + counter).html(data.list[i].main.humidity + '%');
                $('#forecastImg' + counter).attr('src', imgEl);
            }
    }
}

function newList() {
    $('.list-group > *').remove();
}

searchHistory();

function clearSearchHistory(e) {
    e.preventDefault();
    localStorage.clear();
    document.location.reload();
}
