let currentTime = new Date();

function formatDate(date) {
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[dayIndex];
  return `${day}, ${hour}:${minutes}`;
}

let dateElement = document.querySelector("#dateTime");
dateElement.innerHTML = formatDate(currentTime);

function showWeather(response) {
  let city = response.data.name;
  let temperature = Math.round(response.data.main.temp);
  let windSpeed = Math.round(response.data.wind.speed * 2.237);
  let humidity = response.data.main.humidity;

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = city;

  let tempElement = document.querySelector("#temperature");
  tempElement.innerHTML = temperature;

  let windSpeedElement = document.querySelector("#windSpeed");
  windSpeedElement.innerHTML = windSpeed;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = humidity;
}

function searchCity(event) {
  event.preventDefault();

  let apiKey = "182df172ea7c823ab5acd8f5e73fa9aa";
  let units = "metric";
  let searchInput = document.querySelector("#city-input");
  let city = searchInput.value;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

function retrievePosition(position) {
  let apiKey = "182df172ea7c823ab5acd8f5e73fa9aa";
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

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);
