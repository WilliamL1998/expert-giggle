var cityName = window.prompt("What city?")
// openweathermap's geocoding API with the city name received from user
var cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=fad9ba9090dc8bc0f42ec341c600ef46"
var cityLat
var cityLon
var weatherURL
var forecastData = []

// Calls openweathermap's geocoding API to get the latitude and longitude of a city and then store them into localStorage
function getCityLatLon() {
    fetch(cityURL)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        // Stores the latitude and longitude of the city as an array, then into localStorage with JSON.stringify
        cityName = data[0].name
        localStorage.setItem(cityName + "Coordinates", JSON.stringify([data[0].lat, data[0].lon]))
        console.log(data)
        console.log(cityName)
    })
}

getCityLatLon()

// Calls openweathermap's One Call API to get all the weather data at the specified latitude and longitude found in localStorage
function getWeatherByCity() {
    // retrieve the city latitude and longitude array from localStorage with JSON.parse
    cityLat = JSON.parse(localStorage.getItem(cityName + "Coordinates"))[0]
    cityLon = JSON.parse(localStorage.getItem(cityName + "Coordinates"))[1]
    // openweathermap's One Call API with the specified city's latitude and longitude
    weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=metric&appid=fad9ba9090dc8bc0f42ec341c600ef46"
    fetch(weatherURL)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        localStorage.setItem(cityName + "CurrentData", JSON.stringify([{name: cityName, date: data.current.dt, icon: data.current.weather[0].icon, temp: data.current.temp, humidity: data.current.humidity, windSpeed: data.current.wind_speed, uvi: data.current.uvi}]))
        for (var i = 0; i < 5; i++) {
            forecastData.push({date: data.daily[i].dt, icon: data.daily[i].weather[0].icon, tempMax: data.daily[i].temp.max, tempMin: data.daily[i].temp.min, windSpeed: data.daily[i].wind_speed, humidity: data.daily[i].humidity})
        }
        localStorage.setItem(cityName + "ForecastData", JSON.stringify(forecastData))
        console.log(data)
    })
}

$(".Start").on("click", getWeatherByCity)