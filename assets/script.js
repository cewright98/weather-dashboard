var searchButton = document.querySelector("#search-button");
var userInput = document.querySelector("#user-input");
var weatherHeader = document.querySelector("#weather-header");
var currentTemp = document.querySelector("#current-temp");
var currentWind = document.querySelector("#current-wind");
var currentHumidity = document.querySelector("#current-humidity");
var currentUvIndex = document.querySelector("#current-uv");
var searchResults = document.querySelector("#results");

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
            });
        } 
    });
};

var getCurrentWeather = function(lat, lon) {
    // create API url
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,daily&appid=cf497bbc93c8c77ef641ec280f1648f7";
    
    // fetch API url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                // get values for weather objects
                console.log(data);
                console.log(data.current.temp);
                currentTemp.textContent = "Temp: " + data.current.temp + " °F";
                currentWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
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