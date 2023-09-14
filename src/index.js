function formatDate(timestamp) {
  let date = new Date(timestamp);

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let dayNumber = date.getDate();

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let year = date.getFullYear();

  let ampm = hours >= 12 ? `PM` : `AM`;
  hours = hours ? hours : 12;

  return `${day}, ${dayNumber} ${month} ${year} | ${hours} : ${minutes} ${ampm}`;
}

function showWeather(response) {
  let city = response.data.name;

  let feelsLike = Math.round(response.data.main.feels_like);
  let windSpeed = Math.round(response.data.wind.speed * 2.237);
  let humidity = response.data.main.humidity;

  celsuisTemp = response.data.main.temp;

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = city;

  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = Math.round(celsuisTemp);

  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = feelsLike;

  let windSpeedElement = document.querySelector("#windSpeed");
  windSpeedElement.innerHTML = windSpeed;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = humidity;

  let descriptionElememt = document.querySelector("#weather-description");
  descriptionElememt.innerHTML = response.data.weather[0].description;

  let dateElement = document.querySelector("#dateTime");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute("src", `icons/${response.data.weather[0].icon}.svg`);
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getDailyForecast(response.data.coord);
}

function formatDays(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return day;
}

function getDailyForecast(coordinates) {
  let apiKey = "2980ff43226d67e53abfcdb6d457dcc8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let maxTemp = Math.round(forecastDay.temp.max);
      let minTemp = Math.round(forecastDay.temp.min);
      let tempIcon = forecastDay.weather[0].icon;
      let tempDescription = forecastDay.weather[0].description;

      forecastHTML =
        forecastHTML +
        `
            <div class="col-2 weekdays">
              <h3>${formatDays(forecastDay.dt)}</h3>
              <img src="icons/${tempIcon}.svg" alt="${tempDescription}" class="weekday-weather" />
              <p class="forecast-temp">
                <span class="forecast-temp-max">${maxTemp}°</span> -
                <span class="forecast-temp-min">${minTemp}°</span>
              </p>
              <p class="weather-type">${tempDescription}</p>
            </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function searchCity(event) {
  event.preventDefault();

  let apiKey = "2980ff43226d67e53abfcdb6d457dcc8";
  let units = "metric";
  let searchInput = document.querySelector("#city-input");
  let city = searchInput.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

function retrievePosition(position) {
  let apiKey = "2980ff43226d67e53abfcdb6d457dcc8";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

function displayTempF(event) {
  event.preventDefault();
  let tempF = (celsuisTemp * 9) / 5 + 32;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = Math.round(tempF);
}

function displayTempC(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  tempElement.innerHTML = Math.round(celsuisTemp);
}

let celsuisTemp = null;

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayTempF);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayTempC);
