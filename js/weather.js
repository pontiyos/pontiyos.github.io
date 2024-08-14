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
        //console.log("geolocation : " + navigator.geolocation);
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
        userLocation = resp.address.city;

        // Call getWeather with callbacks for weatherInfo and renderCurrentWeatherBody
        getWeather(lat, lon, function() {
            weatherInfo(weatherObj, userLocation);
        }, function() {
            renderCurrentWeatherBody(weatherObj);
            renderCommingWeatherBody(weatherObj);
        });
    });
}


/**
 * Fetches weather data from a weather API based on latitude and longitude.
 * @param {number} lat - Latitude of the location.
 * @param {number} lon - Longitude of the location.
 * @param {function} weatherCallback - Callback function to be executed with weather data.
 * @param {function} renderCallback - Callback function to be executed after weather data is fetched.
 */
function getWeather(lat, lon, weatherCallback, renderCallback) {
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
                throw new Error(`HTTP error! status: ${res.status}`);
            }
        })
        .then(data => {
            weatherObj = data;
            if (weatherCallback && typeof weatherCallback === "function") {
                weatherCallback();
            }
            if (renderCallback && typeof renderCallback === "function") {
                renderCallback();
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
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

    console.log(myJSON);

    // Extracts weather information from the JSON data
    let showWeather = myJSON.properties.timeseries[2];
    let weatherCode = myJSON.properties.timeseries[2].data.next_1_hours.summary.symbol_code;
    let temperature = myJSON.properties.timeseries[2].data.instant.details.air_temperature;

    // Constructs HTML for weather information
    weatherHTML = '<a class="weather-txt"> Current weather in ' + myLocation + " " + temperature + '℃ </a>';
    weatherHTML += '<img class="weather-img" src=' + visualWeather(weatherCode) + ' alt=' + weatherCode + '>';
    document.getElementById("main-weather").innerHTML = weatherHTML;
}

function beautifyString(string){
    let beautyString ="";

    beautyString = string.replace(/_/g, ' ');
    beautyString = beautyString.charAt(0).toUpperCase() + beautyString.slice(1).toLowerCase();

    return beautyString;
}

function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    
    // Divide the 360 degrees of a circle into 8 equal parts (each 45 degrees)
    const index = Math.round(degrees / 45) % 8;
    
    return directions[index];
}

/**
 * Extracts an array of weather data starting from index 1 to 7.
 * @param {object} weatherJSON - The weather JSON object.
 * @returns {Array} - An array of objects with time and weather data.
 */
function extractWeatherData(weatherJSON, startIndex, endIndex) {
    const weatherArray = [];

    // Ensure timeseries is available and has enough data
    if (weatherJSON && weatherJSON.properties && weatherJSON.properties.timeseries) {
        const timeseries = weatherJSON.properties.timeseries;
        
        // Start from index 1 and go up to index 7
        for (let i = startIndex; i <= endIndex; i++) {
            // Ensure there is data at the current index
            if (timeseries[i]) {
                const time = timeseries[i].time;
                const weatherData = timeseries[i].data;

                // Create an object with time and weather data
                weatherArray.push({
                    time: time,
                    temperature: weatherData.instant.details.air_temperature,
                    windSpeed: weatherData.instant.details.wind_speed,
                    windDirection: getWindDirection(weatherData.instant.details.wind_from_direction),
                    humidity: weatherData.instant.details.relative_humidity,
                    weatherCode: weatherData.next_1_hours.summary.symbol_code,
                    description: beautifyString(weatherData.next_1_hours.summary.symbol_code),
                    rain: weatherData.next_1_hours ? weatherData.next_1_hours.details.precipitation_amount : 0
                });
            }
        }
    }

    return weatherArray;
}

/**
 * Extracts and aggregates daily weather data for the coming 7 days.
 * @param {object} weatherJSON - The weather JSON object.
 * @returns {Array} - An array of objects, each representing a day's weather summary for the next 7 days.
 */
function extractDailyWeatherSummary(weatherJSON) {
    const dailyWeatherArray = [];
    const MAX_DAYS = 7;

    // Ensure timeseries is available and has enough data
    if (weatherJSON && weatherJSON.properties && weatherJSON.properties.timeseries) {
        const timeseries = weatherJSON.properties.timeseries;

        // Temporary object to hold daily data
        let dailyData = {};
        let processedDays = 0;

        for (const entry of timeseries) {
            const time = new Date(entry.time);
            const dateKey = time.toISOString().split('T')[0]; // Extract YYYY-MM-DD

            if (processedDays >= MAX_DAYS) break; // Stop after processing 7 days

            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    date: dateKey,
                    temperatures: [],
                    windSpeeds: [],
                    totalRain: 0,
                    weatherCodes: {},
                    humidity: [],
                };
                processedDays++;
            }

            const weatherData = entry.data;

            // Gather temperatures, wind speeds, and rain
            dailyData[dateKey].temperatures.push(weatherData.instant.details.air_temperature);
            dailyData[dateKey].windSpeeds.push(weatherData.instant.details.wind_speed);
            dailyData[dateKey].humidity.push(weatherData.instant.details.relative_humidity);

            if (weatherData.next_6_hours && weatherData.next_6_hours.details) {
                dailyData[dateKey].totalRain += weatherData.next_6_hours.details.precipitation_amount || 0;
            }

            // Count weather codes for frequency
            const weatherCode = weatherData.next_6_hours ? weatherData.next_6_hours.summary.symbol_code : null;
            if (weatherCode) {
                if (!dailyData[dateKey].weatherCodes[weatherCode]) {
                    dailyData[dateKey].weatherCodes[weatherCode] = 0;
                }
                dailyData[dateKey].weatherCodes[weatherCode]++;
            }
        }

        // Process daily data
        for (let date in dailyData) {
            const dayData = dailyData[date];

            const highTemp = Math.max(...dayData.temperatures);
            const lowTemp = Math.min(...dayData.temperatures);
            const avgWind = dayData.windSpeeds.reduce((a, b) => a + b, 0) / dayData.windSpeeds.length;
            const avgHumidity = dayData.humidity.reduce((a, b) => a + b, 0) / dayData.humidity.length;

            // Determine the most frequent weather code
            const mostFrequentWeatherCode = Object.keys(dayData.weatherCodes).reduce((a, b) => dayData.weatherCodes[a] > dayData.weatherCodes[b] ? a : b);

            // Push the summarized data for the day into the array
            dailyWeatherArray.push({
                date: dayData.date,
                highTemperature: highTemp,
                lowTemperature: lowTemp,
                avgWindSpeed: avgWind.toFixed(1),
                avgHumidity: avgHumidity.toFixed(1),
                totalRain: dayData.totalRain.toFixed(1),
                weatherCode: mostFrequentWeatherCode,
                description: beautifyString(mostFrequentWeatherCode),
            });
        }
    }

    return dailyWeatherArray;
}



/**
 * Builds the HTML for the current weather forecast based on the provided weather data array.
 *
 * @param {Array<Object>} weatherArray - An array of objects containing weather data for each forecast item.
 * @return {string} The HTML string representing the current weather forecast.
 */
function buildCurrentWeatherHtml(weatherArray) {
    let weatherHTML = "";

    // Header for Time
    weatherHTML += '<div class="forecast-header">Time</div>';
    for (let i = 0; i < weatherArray.length; i++) {
        weatherHTML += `<div class="forecast-header">${formatTime(weatherArray[i].time)}</div>`;
    }

    // Icons
    weatherHTML += '<div class="forecast-item">Icon</div>';
    for (let i = 0; i < weatherArray.length; i++) {
        const weatherCode = weatherArray[i].weatherCode || 'unknown'; // Use 'unknown' if weatherCode is not available
        weatherHTML += `<div class="forecast-item icon"><img src="${visualWeather(weatherCode)}" alt="${weatherCode}"></div>`;
    }

    // Temperature
    weatherHTML += '<div class="forecast-item">Temperature(℃)</div>';
    for (let i = 0; i < weatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item temperature">${weatherArray[i].temperature}℃</div>`;
    }

    // Rain (mm)
    weatherHTML += '<div class="forecast-item"><i class="fa fa-tint"></i> Rain (mm)</div>';
    for (let i = 0; i < weatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item rain">${weatherArray[i].rain}</div>`;
    }

    // Humidity (%)
    weatherHTML += '<div class="forecast-item"><i class="fa fa-tint w3-text-blue"></i> Humidity (%)</div>';
    for (let i = 0; i < weatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item humidity">${weatherArray[i].humidity}</div>`;
    }

    // Wind (m/s)
    weatherHTML += '<div class="forecast-item"><i class="fa fa-flag"></i> Wind (m/s)</div>';
    for (let i = 0; i < weatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item wind">${weatherArray[i].windSpeed}  (${weatherArray[i].windDirection})</div>`;
    }

    // Descriptions
    weatherHTML += '<div class="forecast-item">Description</div>';
    for (let i = 0; i < weatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item description">${weatherArray[i].description || 'No description'}</div>`;
    }

    return weatherHTML;
}

/**
 * Builds the HTML for a daily weather forecast.
 *
 * @param {Array} dailyWeatherArray - An array of objects containing daily weather data.
 * @return {string} The HTML string for the daily weather forecast.
 */
function buildDaysWeatherHtml(dailyWeatherArray) {

    let weatherHTML = "";

    // Header for Date
    weatherHTML += '<div class="forecast-header">Date</div>';
    for (let i = 0; i < dailyWeatherArray.length; i++) {
        weatherHTML += `<div class="forecast-header">${dailyWeatherArray[i].date}</div>`;
    }

    // Icons
    weatherHTML += '<div class="forecast-item">Icon</div>';
    for (let i = 0; i < dailyWeatherArray.length; i++) {
        const weatherCode = dailyWeatherArray[i].weatherCode || 'unknown'; // Use 'unknown' if weatherCode is not available
        weatherHTML += `<div class="forecast-item icon"><img src="${visualWeather(weatherCode)}" alt="${weatherCode}"></div>`;
    }

    // High Temperature
    weatherHTML += '<div class="forecast-item">High Temp (℃)</div>';
    for (let i = 0; i < dailyWeatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item temperature">${dailyWeatherArray[i].highTemperature}℃</div>`;
    }

    // Low Temperature
    weatherHTML += '<div class="forecast-item">Low Temp (℃)</div>';
    for (let i = 0; i < dailyWeatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item temperature">${dailyWeatherArray[i].lowTemperature}℃</div>`;
    }

    // Average Wind Speed
    weatherHTML += '<div class="forecast-item"><i class="fa fa-flag"></i> Avg Wind (m/s)</div>';
    for (let i = 0; i < dailyWeatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item wind">${dailyWeatherArray[i].avgWindSpeed} m/s</div>`;
    }

    // Humidity (%)
    weatherHTML += '<div class="forecast-item"><i class="fa fa-tint w3-text-blue"></i> Humidity (%)</div>';
    for (let i = 0; i < dailyWeatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item humidity">${dailyWeatherArray[i].avgHumidity}%</div>`;
    }

    // Total Rain (mm)
    weatherHTML += '<div class="forecast-item"><i class="fa fa-tint"></i> Rain (mm)</div>';
    for (let i = 0; i < dailyWeatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item rain">${dailyWeatherArray[i].totalRain} mm</div>`;
    }

    // Description
    weatherHTML += '<div class="forecast-item">Description</div>';
    for (let i = 0; i < dailyWeatherArray.length; i++) {
        weatherHTML += `<div class="forecast-item description">${dailyWeatherArray[i].description || 'No description'}</div>`;
    }

    return weatherHTML;
}

/**
 * Extracts and formats the time from the date string.
 * @param {string} dateTime - The date-time string in ISO format.
 * @returns {string} - The formatted time.
 */
function formatTime(dateTime) {
    const date = new Date(dateTime);
    // Format the time as HH:mm
    return date.toISOString().substr(11, 5);
}

function renderCurrentWeatherBody(weatherJSON) {
  
    const weatherDataArray = extractWeatherData(weatherJSON,2 ,8);   

    var currentWeatherHTML = "";
    currentWeatherHTML = buildCurrentWeatherHtml(weatherDataArray);

    document.getElementById("current-weather-container").innerHTML = currentWeatherHTML;    

}

/**
 * Renders the HTML for the coming weather body based on the provided weather JSON data.
 *
 * @param {object} weatherJSON - The JSON data containing the weather information.
 * @return {void}
 */
function renderCommingWeatherBody (weatherJSON){

    //const weatherDataArray = extractWeatherData(weatherJSON,2 ,8);
    const dailyWeatherArray = extractDailyWeatherSummary(weatherJSON);
    console.log(dailyWeatherArray);

    var commingWeatherHTML = "";
    commingWeatherHTML = buildDaysWeatherHtml(dailyWeatherArray);

    document.getElementById("comming-weather-container").innerHTML = commingWeatherHTML;
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


/**
 * Displays the weather information for the current location.
 *
 * @return {void} No return value, renders weather information to the page.
 */
function displayWeatherForLocation(){

    if (userLocation) { 
        console.log("displayWeatherForLocation location");
    }

    if (weatherObj) {
        console.log("displayWeatherForLocation weather");
        renderCommingWeatherBody(weatherObj);
        renderCurrentWeatherBody(weatherObj);
    }

}