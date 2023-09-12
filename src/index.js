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
  let country = response.data.country;
  let feelsLike = Math.round(response.data.main.feels_like);
  let windSpeed = Math.round(response.data.wind.speed * 2.237);
  let humidity = response.data.main.humidity;

  celsuisTemp = response.data.main.temp;

  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = city;

  let countryElement = document.querySelector("#country");
  countryElement = country;

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
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
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
