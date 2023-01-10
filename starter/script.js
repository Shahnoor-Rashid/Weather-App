'use strict';

const searchBtn = document.querySelector('#searchBtn');
const cityname = document.querySelector('.cityName');
const date = document.querySelector('.date');
const inputCityName = document.querySelector('#inputCityName');
const weatherImage = document.querySelector('.weatherIcon');
const temp = document.querySelector('.temp');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const uvi = document.querySelector('.uvi');
const cardHeader = document.querySelector('.heading');
var today = new Date();
console.log(today);
const [day, month, year] = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
console.log(day, month, year);


var cityList = [];
var city_name;
localCityList();
currentCityWeather();
function renderCity() {
    const city_list = document.querySelector('#cityList');
    $("#cityList").empty();
    document.querySelector('#inputCityName').value = "";
    // document.createElement('hr');
    for (var i = 0; i < cityList.length; i++) {
        var newEl = document.createElement('div');
        newEl.classList.add("list-group-item", "list-group-item-action", "list-group-item-primary", "city");
        newEl.setAttribute("data-name", cityList[i]);
        newEl.innerHTML = cityList[i];
        city_list.prepend(newEl);
    }
}

function currentCityWeather() {

    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));
    console.log("storedWeather:" + storedWeather);
    if (storedWeather !== null) {
        displayWeather(storedWeather);
        displayFiveDayForecast(storedWeather);
    } else {
        displayWeather('Melbourne');
        displayFiveDayForecast('Melbourne');
    }
}

function localCityList() {
    var storedCities = JSON.parse(localStorage.getItem('cities'));
    if (storedCities != null) {
        cityList = storedCities;
        renderCity();
    }
    else {
        console.log("local Storage: ", storedCities);
        localStorage.setItem('cities', JSON.stringify(cityList));
        renderCity();
    }
}
$("#inputCityName").keypress(function (e) {
    if (e.which == 13) {
        $("#searchBtn").click();
    }
})

searchBtn.addEventListener('click', function () {
    const cityName = document.querySelector('#inputCityName');
    var city_name = cityName.value.trim();
    console.log(city_name);
    if (city_name == "") {
        alert('Please Enter correct name!!!')
    }
    else if (cityList.length < 1) {
        cityList.push(city_name);
        console.log(cityList);
    }
    else if (cityList.length > 5) {
        cityList.shift();
        cityList.push(city_name);
        console.log(cityList);
    }
    else {
        cityList.push(city_name);
        console.log(cityList);
    }
    cityArray();
    localCurrentCity(city_name);
    localCityList();
    displayWeather(city_name);
    displayFiveDayForecast(city_name);
    location.reload();

})
function cityArray() {
    localStorage.setItem('cities', JSON.stringify(cityList));
}
function localCurrentCity(city_name) {
    localStorage.setItem("currentCity", JSON.stringify(city_name));
    // var currentCity = localStorage.getItem("currentCity");
}  
async function displayWeather(city_name) {
    let weatherdata = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=cd34f9c36fc9fbead917d73e1e4a5b2e`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            var lat = data['coord']['lat'];
            var lon = data['coord']['lon'];
            var cityName = data['name'];
            cityname.innerHTML = cityName;
            date.innerHTML = `(${month}/${day}/${year})`;
            console.log(lat, lon);
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=cd34f9c36fc9fbead917d73e1e4a5b2e`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    var weatherIcon = data['current']['weather'][0]['icon'];
                    //creating weather icon using the api documentation
                    weatherImage.setAttribute("src", `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`);
                    var tempValue = data['current']['temp'];
                    console.log(tempValue);
                    temp.innerHTML = `Temp: ${tempValue} °F`;
                    var windValue = data['current']['wind_speed'];
                    console.log(windValue);
                    wind.innerHTML = `Wind: ${windValue} MPH`;
                    var humidityValue = data['current']['humidity'];
                    console.log(humidityValue);
                    humidity.innerHTML = `Humidity: ${humidityValue} %`;
                    var uviValue = data['current']['uvi'];
                    console.log(uviValue);

                    //creating if/else statements to color the UVI index box
                    uvi.innerHTML = `UV Index: `;
                    var uvNumber = document.createElement('span');
                    if (uviValue > 0 && uviValue <= 2.99) {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("low");
                    } else if (uviValue >= 3 && uviValue <= 5.99) {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("moderate");
                    } else if (uviValue >= 6 && uviValue <= 7.99) {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("high");
                    } else if (uviValue >= 8 && uviValue <= 10.99) {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("vhigh");
                    } else {
                        var newSpan = uvi.appendChild(uvNumber);
                        newSpan.innerHTML = `${uviValue}`;
                        newSpan.classList.add("extreme");
                    }

                });
        });
}

