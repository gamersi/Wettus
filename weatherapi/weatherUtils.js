import getCurrentLocation from "./getCurrentLocation";

let latitude = 0,
    longitude = 0,
    error = null;
async function loadWeather() {
    let location = await getCurrentLocation();
    latitude = location.latitude;
    longitude = location.longitude;
    error = location.error;
    getCurrentWeather();
}

let weatherAPIKey = "740c9668aca4207867df2b5fba35b8eb";
let currentWeatherURL = null;


let jsonData = "yay";
let dataLoaded = false;

function getCurrentWeather() {
    return new Promise((resolve, reject) => {
        loadWeather().then(() => {
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
        return `http://openweathermap.org/img/w/${this.icon}.png`;
    }

    getFormattedCity() {
        return `${this.city}`;
    }
}

export {
    getCurrentWeather,
    jsonData,
    dataLoaded,
    CurrentWeather
};
