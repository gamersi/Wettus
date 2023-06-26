import getCurrentLocation from "./getCurrentLocation";
import { storeData, getData } from "./storageUtil";

let latitude = 0,
    longitude = 0,
    error = null,
    forecastData = null;

async function loadLocation() {
    let start = new Date().getTime();
    let location = await getCurrentLocation();
    latitude = location.latitude;
    longitude = location.longitude;
    error = location.error;
    console.log("Location load took",  (new Date().getTime() - start)/1000 + "s");
}

export let weatherAPIKey = "n/a"
let currentWeatherURL = null;

export function getWeatherAPIKey() {
    return weatherAPIKey;
}

async function loadWeatherAPIKey() {
    let key = await getData("weatherAPIKey");
    if(key != null) {
        weatherAPIKey = key;
        console.log("weatherAPIKey loaded from storage -", weatherAPIKey);
    }
}
loadWeatherAPIKey();

export function setWeatherAPIKey(key) {
    weatherAPIKey = key;
    storeData("weatherAPIKey", key);
}


let jsonData = "n/a";
let dataLoaded = false;

function getCurrentWeather() {
    return new Promise((resolve, reject) => {
        loadLocation().then(() => {
            console.log("API key", weatherAPIKey);
            currentWeatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=metric&lang=de`;
            if(error || latitude == null || longitude == null) {
                latitude = 0;
                longitude = 0;
                position = null;
                error = null;
                currentWeatherURL = `http://api.openweathermap.org/data/2.5/weather?lat=0&lon=0&appid=${weatherAPIKey}&units=metric&lang=de`;
            }
            fetch(currentWeatherURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    jsonData = json;
                    dataLoaded = true;
                    resolve(jsonData);
                })
                .catch(function (error) {
                    console.log("current weather fetch error", error);
                    reject(error);
                });
            });
    });
}

function getWeatherForecast() {
    return new Promise((resolve, reject) => {
        loadLocation().then(() => {
            currentWeatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${weatherAPIKey}&units=metric&lang=de`;
            if(error || latitude == null || longitude == null) {
                latitude = 0;
                longitude = 0;
                position = null;
                error = null;
                currentWeatherURL = `http://api.openweathermap.org/data/2.5/forecast?lat=0&lon=0&appid=${weatherAPIKey}&units=metric&lang=de`;
            }
            fetch(currentWeatherURL)
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    jsonData = json;
                    dataLoaded = true;
                    resolve(jsonData);
                })
                .catch(function (error) {
                    console.log("weather forecast fetch error", error);
                    reject(error);
                });
            });
    });
}

function loadWeatherForecast() {
    // getWeatherForecast() and then stores it in a variable for later use, if it is not already loaded. returns it then
    return new Promise((resolve, reject) => {
        if(forecastData == null) {
            getWeatherForecast().then((data) => {
                forecastData = data;
                resolve(forecastData);
            }).catch((error) => {
                reject(error);
            });
        } else {
            resolve(forecastData);
        }
    });
}
class CurrentWeather {
    constructor(data) {
        this.city = data.name;
        this.country = data.sys.country;
        this.temperature = data.main.temp;
        this.description = data.weather[0].description;
        this.icon = data.weather[0].icon;
        this.windSpeed = data.wind.speed;
        this.windDirection = data.wind.deg;
        this.humidity = data.main.humidity;
        this.pressure = data.main.pressure;
        this.cloudiness = data.clouds.all;
        this.sunrise = data.sys.sunrise;
        this.sunset = data.sys.sunset;
    }

    getFormattedTemperature() {
        return `${Math.round(this.temperature)}°C`;
    }

    getFormattedWindSpeed() {
        return `${Math.round(this.windSpeed)} m/s`;
    }

    getFormattedWindDirection() {
        return `${Math.round(this.windDirection)}°`;
    }

    getFormattedHumidity() {
        return `${Math.round(this.humidity)}%`;
    }

    getFormattedPressure() {
        return `${Math.round(this.pressure)} hPa`;
    }

    getFormattedCloudiness() {
        return `${Math.round(this.cloudiness)}%`;
    }

    getFormattedSunrise() {
        return this.getFormattedTime(this.sunrise);
    }

    getFormattedSunset() {
        return this.getFormattedTime(this.sunset);
    }

    getFormattedTime(unixTime) {
        let date = new Date(unixTime * 1000);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        return hours + ':' + minutes.substring(-2) + ':' + seconds.substring(-2);
    }

    getFormattedDate() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        // fill in leading zeros
        day = day < 10 ? "0" + day : day;
        month = month < 10 ? "0" + month : month;
        return day + '.' + month + '.' + year;
    }

    getFormattedDescription() {
        return this.description.charAt(0).toUpperCase() + this.description.slice(1);
    }

    getFormattedIcon() {
        return `http://openweathermap.org/img/w/${this.icon}@4x.png`;
    }

    getFormattedCity() {
        return `${this.city}`;
    }
}

export {
    getCurrentWeather,
    jsonData,
    dataLoaded,
    CurrentWeather,
    loadWeatherForecast
};