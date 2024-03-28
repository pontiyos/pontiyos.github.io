/**
 * Initiates the process of getting the user's location.
 */
getLocation();
var userLocation = ""; // Stores the user's location
var weatherObj; // Stores weather data

/**
 * Retrieves the user's current location using geolocation API.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser");
    }
}

/**
 * Callback function triggered when the user's position is obtained.
 * @param {Position} position - The position object containing coordinates.
 */
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Displays the user's location and fetches weather data
    displayLocation(lat, lon, function () {
        var resp = JSON.parse(this.responseText);
        weatherObj = resp;
        userLocation = resp.address.city;
        getWeather(lat, lon);
    });
}

/**
 * Fetches weather data from a weather API based on latitude and longitude.
 * @param {number} lat - Latitude of the location.
 * @param {number} lon - Longitude of the location.
 */
function getWeather(lat, lon) {
    let apiBaseUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?';
    let apiUrl = apiBaseUrl + 'lat=' + lat + '&lon=' + lon;

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    const myInit = {
        method: 'GET',
        headers: myHeaders,
        cache: 'default'
    };

    fetch(apiUrl, myInit)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .then(data => {console.log(data)
            weatherInfo(data, userLocation);
        });
}

/**
 * Fetches reverse geocoded location information using latitude and longitude.
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @param {function} callback - Callback function to be executed after receiving location data.
 */
function displayLocation(latitude, longitude, callback) {
    var xttp = new XMLHttpRequest();

    // Note: Replace the below token with your LocationIQ token.
    xttp.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.ace7d9c9f893b1066a483ef3e05a2280&lat=" + latitude + "&lon=" + longitude + "&format=json", true);

    xttp.onreadystatechange = function () {
        if (xttp.readyState == 4 && xttp.status == 200) {
            if (typeof callback === "function") {
                callback.apply(xttp);
            }
        }
    }
    xttp.send();
};

/**
 * Processes weather data and updates the UI with weather information.
 * @param {object} myJSON - Weather data object.
 * @param {string} userLocation - User's location.
 */
function weatherInfo(myJSON, userLocation) {
    let weatherHTML;
    let myLocation = userLocation;

    // Extracts weather information from the JSON data
    let showWeather = myJSON.properties.timeseries[0];
    let weatherCode = myJSON.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
    let temperature = myJSON.properties.timeseries[0].data.instant.details.air_temperature;

    // Constructs HTML for weather information
    weatherHTML = '<a class="weather-txt"> Current weather in ' + myLocation + " " + temperature + '℃ </a>';
    weatherHTML += '<img class="weather-img" src=' + visualWeather(weatherCode) + ' alt=' + weatherCode + '>';
    document.getElementById("main-weather").innerHTML = weatherHTML;
}

/**
 * Generates the URL for weather image based on weather code.
 * @param {string} code - Weather code.
 * @returns {string} - URL for the weather image.
 */
function visualWeather(code) {
    let basePath = "\\weather_png\\";
    let imgPath = basePath + code + ".png";

    return imgPath;
}


function displayWeatherForLocation(){
    if(userLocation){ console.log("displayWeatherForLocation location");}

    if(weatherObj){console.log("displayWeatherForLocation weather");}

}