var searchButton = document.querySelector("#search-button");
var userInput = document.querySelector("#user-input");
var weatherHeader = document.querySelector("#weather-header");
var currentIcon = document.querySelector("#current-icon");
var currentTemp = document.querySelector("#current-temp");
var currentWind = document.querySelector("#current-wind");
var currentHumidity = document.querySelector("#current-humidity");
var currentUvIndex = document.querySelector("#current-uv");
var searchResults = document.querySelector("#search-results");
var inputList = document.querySelector("#input-list");
var createSearchHistory = true;


var getCoordinates = function(city) {
    // create API url to get lat and lon
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=cf497bbc93c8c77ef641ec280f1648f7";

    // fetch API url
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                //console.log(data.length);
                
                // check for valid city input
                if (data.length === 0) {
                    window.alert("Please enter a valid city");
                } else {
                    weatherHeader.textContent = city;

                    // create new search history button if new search
                    if (createSearchHistory) {
                        saveInput(city);
                    }
                    // get coordinates
                    var cityLat = data[0].lat;
                    var cityLon = data[0].lon;

                    // pass coordinates to weather function
                    getCurrentWeather(cityLat, cityLon);
                    getFutureWeather(cityLat, cityLon);
                }
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
                //console.log(data);
                // get values for weather objects

                // get icon
                currentIcon.style.visibility = "visible";
                currentIcon.src = "https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
                
                var uvIndex = data.current.uvi;
                currentTemp.textContent = "Temp: " + data.current.temp + " °F";
                currentWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
                currentHumidity.textContent = "Humidity: " + data.current.humidity + " %";
                currentUvIndex.textContent = uvIndex;

                // run function to color code uv index
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
                //console.log(data);
                // use data to get today's date
                var dateTime = data.list[0].dt_txt;
                var dateTimeArr = dateTime.split(" ", 2);
                weatherHeader.textContent = weatherHeader.textContent + " (" + dateTimeArr[0] + ")";

                var cardNumber = 0;

                // loop to get values for weather objects for each card
                for (var i = 0; i < data.list.length; i++) {
                    // get date
                    dateTime = data.list[i].dt_txt;
                    dateTimeArr = dateTime.split(" ", 2);

                    if (dateTimeArr[1] === "15:00:00") {
                    // get icon
                    document.querySelector("#card-icon-" + cardNumber).style.visibility = "visible";
                    document.querySelector("#card-icon-" + cardNumber).src = "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
                    
                    document.querySelector("#card-date-" + cardNumber).textContent = dateTimeArr[0];
                    document.querySelector("#card-temp-" + cardNumber).textContent = "Temp: " + data.list[i].main.temp + " °F";
                    document.querySelector("#card-wind-" + cardNumber).textContent = "Wind: " + data.list[i].wind.speed + " MPH";
                    document.querySelector("#card-humidity-" + cardNumber).textContent = "Humidity: " + data.list[i].main.humidity + " %";
                    cardNumber++;
                    }
                }
                
            });
        } 
    });
};

var saveInput = function(city) {
    city = city.toLowerCase();
    localStorage.setItem("city", city);
    loadInput();
};

var loadInput = function() {
    var listItem = document.createElement("li");
    listItem.textContent = localStorage.getItem("city");
    listItem.classList.add("list-group-item");
    inputList.appendChild(listItem);
};

var hideIcons = function() {
    currentIcon.style.visibility = "hidden";
    for (var i = 0; i < 5; i++) {
        document.querySelector("#card-icon-" + i).style.visibility = "hidden";
    }
};

searchButton.addEventListener("click", function()   {
    // check that there is user input
    if (userInput.value) {
        var cityName = userInput.value;
        userInput.value = "";
        createSearchHistory = true;
        getCoordinates(cityName);
    } else {
        window.alert("Please enter a city");
    }
});

inputList.addEventListener("click", function(event) {
    //console.log(event.target.value);
    if (event.target.value === 0) {
        createSearchHistory = false;
        getCoordinates(event.target.textContent);
    }
});

hideIcons();