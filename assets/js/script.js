$(document).ready(function() {
    var cityName
    var cityLat
    var cityLon
    var weatherURL
    var forecastData = []
    var cityURL

    // Calls openweathermap's geocoding API to get the latitude and longitude of a city and then store them into localStorage
    function getCityName() {
        cityName = $("input").val()
    }

    function getWeather() {
        // openweathermap's geocoding API with the city name received from user
        cityURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=fad9ba9090dc8bc0f42ec341c600ef46"
        fetch(cityURL)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            // Stores the latitude and longitude of the city as an array, then into localStorage with JSON.stringify
            cityName = data[0].name
            cityLat = data[0].lat
            cityLon = data[0].lon
        })
        // Calls openweathermap's One Call API to get all the weather data at the specified latitude and longitude found in localStorage
        .then(function() {
        // openweathermap's One Call API with the specified city's latitude and longitude
            weatherURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=metric&appid=fad9ba9090dc8bc0f42ec341c600ef46"
            fetch(weatherURL)
            .then(function(response) {
                return response.json()
            })
            .then(function(data) {
               // stores the city's specific current weather data in localStorage
                localStorage.setItem(cityName + "CurrentData", JSON.stringify([{name: cityName, date: data.current.dt, icon: data.current.weather[0].icon, temp: data.current.temp, humidity: data.current.humidity, wind: data.current.wind_speed, uvi: data.current.uvi}]))
                forecastData = []
                // for loop that iterates through the next 5 days of forecast data and stores specified datapoint into localStorage
                for (var i = 0; i < 5; i++) {
                    forecastData.push({date: data.daily[i].dt, icon: data.daily[i].weather[0].icon, tempMax: data.daily[i].temp.max, tempMin: data.daily[i].temp.min, wind: data.daily[i].wind_speed, humidity: data.daily[i].humidity})
                }
                localStorage.setItem(cityName + "ForecastData", JSON.stringify(forecastData))
            })
        })
    }

    // combines the three functions above into a single function to be called when the button is clicked
    function search() {
        getCityName()
        getWeather
    }

    $(".btn-primary").on("click", search)

    // function that displays the current weather data for a specific city retrieved from localStorage
    function displayCurrentWeatherData() {
        $(".currentNameDateIcon").text("Hello")
    }

    displayCurrentWeatherData()
})