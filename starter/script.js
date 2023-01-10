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
