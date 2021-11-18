var searchButton = document.querySelector("#search-button");
var userInput = document.querySelector("#user-input");
var weatherHeader = document.querySelector("#weather-header");
var currentTemp = document.querySelector("#current-temp");
var currentWind = document.querySelector("#current-wind");
var currentHumidity = document.querySelector("#current-humidity");
var currentUvIndex = document.querySelector("#current-uv");
var searchResults = document.querySelector("#search-results");


var getCoordinates = function(city) {
    // create API url
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=cf497bbc93c8c77ef641ec280f1648f7";

    // fetch API url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // get coordinates
                var cityLat = data[0].lat;
                var cityLon = data[0].lon;
                // pass coordinates to weather function
                getCurrentWeather(cityLat, cityLon);
                getFutureWeather(cityLat, cityLon);
            });
        } 
    });
};

var getCurrentWeather = function(lat, lon) {
    // create API url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely&appid=cf497bbc93c8c77ef641ec280f1648f7";
    
    // fetch API url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // get values for weather objects
                var uvIndex = data.current.uvi;
                currentTemp.textContent = "Temp: " + data.current.temp + " °F";
                currentWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
                currentHumidity.textContent = "Humidity: " + data.current.humidity + " %";
                currentUvIndex.textContent = uvIndex;
                checkUv(uvIndex);
            });
        } 
    });
};

var checkUv = function(uvi) {
    if (uvi < 3) {
        currentUvIndex.classList.add("favorable");
    } else if (uvi < 6) {
        currentUvIndex.classList.add("moderate");
    } else {
        currentUvIndex.classList.add("severe");
    }
};

var getFutureWeather = function(lat, lon) {
    // create API url
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=cf497bbc93c8c77ef641ec280f1648f7";

    // fetch API url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                // use data to get today's date
                var dateTime = data.list[0].dt_txt;
                var date = dateTime.split(" ", 2);
                weatherHeader.textContent = weatherHeader.textContent + " (" + date[0] + ")";
                // loop to get values for weather objects for each card
                var index = 6;
                for (var i = 1; i < 6; i++) {
                    dateTime = data.list[index].dt_txt;
                    date = dateTime.split(" ", 2);
                    document.querySelector("#card-date-" + i).textContent = date[0];
                    document.querySelector("#card-temp-" + i).textContent = "Temp: " + data.list[index].main.temp + " °F";
                    document.querySelector("#card-wind-" + i).textContent = "Wind: " + data.list[index].wind.speed + " MPH";
                    document.querySelector("#card-humidity-" + i).textContent = "Humidity: " + data.list[index].main.humidity + " %";
                    index = index + 8;
                }
                
            });
        } 
    });
};

searchButton.addEventListener("click", function()   {
    // check that there is user input
    if (userInput.value) {
        var cityName = userInput.value;
        weatherHeader.textContent = cityName;
        userInput.value = "";
        getCoordinates(cityName);
    } else {
        window.alert("Please enter a city");
    }
});