$(document).ready(function() {
    var cityName
    var cityLat
    var cityLon
    var weatherURL
    var cityURL
    var forecastData = []
    var storedForecastData = []
    var storedCurrentData = []
    var icon = ""
    var src = ""

    // simply stores the user's input as cityName
    function getCityName() {
        cityName = $("input").val()
    }

    function getWeather() {
        // openweathermap's geocoding API with the city name received from user
        cityURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=fad9ba9090dc8bc0f42ec341c600ef46"
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
                displayCurrentData()
                displayForecastData()
            })
        })
    }

    // function that displays the current weather data for a specific city retrieved from localStorage
    function displayCurrentData() {
        storedCurrentData = JSON.parse(localStorage.getItem(cityName + "CurrentData"))
        $(".currentNameDateIcon").text(storedCurrentData[0].name + " (" + moment.unix(storedCurrentData[0].date).format("MMM DD, YYYY") + ") ")
        icon = storedCurrentData[0].icon
        src = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
        $(".currentNameDateIcon").append($("<img src = " + src + ">"))
        $(".currentTemp").text("Temp: " + storedCurrentData[0].temp + "°C")
        $(".currentWind").text("Wind: " + storedCurrentData[0].wind + " m/s")
        $(".currentHumidity").text("Humidity: " + storedCurrentData[0].humidity + " %")
        $(".currentUVI").text("UV Index: " + storedCurrentData[0].uvi)

        if (storedCurrentData[0].uvi < 4) {
            $(".current").attr("id", "favorable")
        } else if (storedCurrentData[0].uvi = 4 && storedCurrentData[0].uvi < 8) {
            $(".current").attr("id", "moderate")
        } else {
            $(".current").attr("id", "severe")
        }
    }

    // function that displays the forecast weather data for a specific city retrieved from localStorage
    function displayForecastData() {
        storedForecastData = JSON.parse(localStorage.getItem(cityName + "ForecastData"))
        $(".forecastIcons").remove()
        for (var j = 0; j < 5; j++){
            $(".forecastDate" + j).text(moment.unix(storedForecastData[j].date).format("MMM DD, YYYY"))
            icon = storedForecastData[j].icon
            src = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            $(".forecastIcon" + j).append($("<img class = forecastIcons src = " + src + ">"))
            $(".forecastTempMin" + j).text("Lowest Temp: " + storedForecastData[j].tempMin + "°C")
            $(".forecastTempMax" + j).text("Highest Temp: " + storedForecastData[j].tempMax + "°C")
            $(".forecastWind" + j).text("Wind: " + storedForecastData[j].wind + " m/s")
            $(".forecastHumidity" + j).text("Humidity: " + storedForecastData[j].humidity + " %")
        }
    }

    // combines the functions above into a single function and add a new button named after the searched city
    function search() {
        getCityName()
        getWeather()
        $(".button-group").prepend($("<button type=\"button\" class=\"btn btn-info btn-block mt-2\">" + cityName + "</button>"))
    }
    
    // initializing button and enter key triggers to call forth the search function above
    $(".btn-primary").click(search)
    $(".form-control").keypress(function(event) {
        if (event.key === "Enter"){
            search()
        }
    })

    // initializing searched city button triggers to call forth display functions again
    $(".button-group").click(function(event) {
        cityName = event.target.innerHTML
        event.target.remove()
        $(".button-group").prepend($("<button type=\"button\" class=\"btn btn-info btn-block mt-2\">" + cityName + "</button>"))
        displayCurrentData()
        displayForecastData()
    })
})