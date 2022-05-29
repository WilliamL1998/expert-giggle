var cityName = window.prompt("What city?")
// openweathermap's geocoding API with the city name received from user
var cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=fad9ba9090dc8bc0f42ec341c600ef46"
var cityLat
var cityLon
var weatherURL

// Calls openweathermap's geocoding API to get the latitude and longitude of a city and then store them into localStorage
function getCityLatLon() {
    fetch(cityURL)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        // Stores the latitude and longitude of the city as an array, then into localStorage with JSON.stringify
        localStorage.setItem(cityName, JSON.stringify([data[0].lat, data[0].lon]))
        console.log(data)
    })
}

getCityLatLon()

// Calls openweathermap's One Call API to get all the weather data at the specified latitude and longitude found in localStorage
function getWeatherByCity() {
    // retrieve the city latitude and longitude array from localStorage with JSON.parse
    cityLat = JSON.parse(localStorage.getItem(cityName))[0]
    cityLon = JSON.parse(localStorage.getItem(cityName))[1]
    // openweathermap's One Call API with the specified city's latitude and longitude
    weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&appid=fad9ba9090dc8bc0f42ec341c600ef46"
    fetch(weatherURL)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        console.log(data)
    })
}

$(".Start").on("click", getWeatherByCity)