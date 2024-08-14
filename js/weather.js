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
 * Initiates the process of getting the user's location.
 */
getLocation();
var userLocation = ""; // Stores the user's location
var weatherObj; // Stores weather data

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
    const url = `https://us1.locationiq.com/v1/reverse.php?key=pk.ace7d9c9f893b1066a483ef3e05a2280&lat=${latitude}&lon=${longitude}&format=json`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (typeof callback === "function") {
                callback.call({ responseText: JSON.stringify(data) });
            }
        })
        .catch(error => console.error('Error fetching location data:', error));
}

/**
 * Processes weather data and updates the UI with weather information.
 * @param {object} myJSON - Weather data object.
 * @param {string} userLocation - User's location.
 */
function weatherInfo(myJSON, userLocation) {
    let weatherHTML;
    let myLocation = userLocation;

    // Extracts weather information from the JSON data
    let showWeather = myJSON.properties.timeseries[2];
    let weatherCode = myJSON.properties.timeseries[2].data.next_1_hours.summary.symbol_code;
    let temperature = myJSON.properties.timeseries[2].data.instant.details.air_temperature;

    // Constructs HTML for weather information
    weatherHTML = '<a class="weather-txt"> Current weather in ' + myLocation + " " + temperature + '℃ </a>';
    weatherHTML += '<img class="weather-img" src=' + visualWeather(weatherCode) + ' alt=' + weatherCode + '>';
    document.getElementById("main-weather").innerHTML = weatherHTML;
}

/**
 * Beautifies a string by replacing underscores with spaces and capitalizing the first letter.
 *
 * @param {string} string - The input string to be beautified.
 * @return {string} The beautified string.
 */
function beautifyString(string){
    let beautyString ="";

    beautyString = string.replace(/_/g, ' ');
    beautyString = beautyString.charAt(0).toUpperCase() + beautyString.slice(1).toLowerCase();

    return beautyString;
}

/**
 * Returns the wind direction based on the given degrees.
 *
 * @param {number} degrees - The degrees of the wind direction.
 * @return {string} The wind direction (N, NE, E, SE, S, SW, W, NW).
 */
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
    // Helper function to create a section of HTML
    const createSection = (header, items, className) => {
        let sectionHTML = `<div class="${className}">${header}</div>`;
        items.forEach(item => {
            sectionHTML += `<div class="${className}">${item}</div>`;
        });
        return sectionHTML;
    };

    // Extract data
    const times = weatherArray.map(data => formatTime(data.time));
    const icons = weatherArray.map(data => `<img src="${visualWeather(data.weatherCode || 'unknown')}" alt="${data.weatherCode || 'unknown'}">`);
    const temperatures = weatherArray.map(data => `${data.temperature}℃`);
    const rains = weatherArray.map(data => data.rain);
    const humidities = weatherArray.map(data => data.humidity);
    const winds = weatherArray.map(data => `${data.windSpeed} (${data.windDirection})`);
    const descriptions = weatherArray.map(data => data.description || 'No description');

    // Build HTML
    const weatherHTML = [
        createSection('Time', times, 'forecast-header'),
        createSection('Icon', icons, 'forecast-item icon'),
        createSection('Temperature(℃)', temperatures, 'forecast-item temperature'),
        createSection('<i class="fa fa-tint"></i> Rain (mm)', rains, 'forecast-item rain'),
        createSection('<i class="fa fa-tint w3-text-blue"></i> Humidity (%)', humidities, 'forecast-item humidity'),
        createSection('<i class="fa fa-flag"></i> Wind (m/s)', winds, 'forecast-item wind'),
        createSection('Description', descriptions, 'forecast-item description')
    ].join('');

    return weatherHTML;
}

/**
 * Builds the HTML for a daily weather forecast.
 *
 * @param {Array} dailyWeatherArray - An array of objects containing daily weather data.
 * @return {string} The HTML string for the daily weather forecast.
 */
function buildDaysWeatherHtml(dailyWeatherArray) {
    // Helper function to create a section of HTML
    const createSection = (header, items, className) => {
        let sectionHTML = `<div class="${className}">${header}</div>`;
        items.forEach(item => {
            sectionHTML += `<div class="${className}">${item}</div>`;
        });
        return sectionHTML;
    };

    // Extract data
    const dates = dailyWeatherArray.map(data => data.date);
    const icons = dailyWeatherArray.map(data => `<img src="${visualWeather(data.weatherCode || 'unknown')}" alt="${data.weatherCode || 'unknown'}">`);
    const highTemps = dailyWeatherArray.map(data => `${data.highTemperature}℃`);
    const lowTemps = dailyWeatherArray.map(data => `${data.lowTemperature}℃`);
    const avgWinds = dailyWeatherArray.map(data => `${data.avgWindSpeed} m/s`);
    const humidities = dailyWeatherArray.map(data => `${data.avgHumidity}%`);
    const rains = dailyWeatherArray.map(data => `${data.totalRain} mm`);
    const descriptions = dailyWeatherArray.map(data => data.description || 'No description');

    // Build HTML
    const weatherHTML = [
        createSection('Date', dates, 'forecast-header'),
        createSection('Icon', icons, 'forecast-item icon'),
        createSection('High Temp (℃)', highTemps, 'forecast-item temperature'),
        createSection('Low Temp (℃)', lowTemps, 'forecast-item temperature'),
        createSection('<i class="fa fa-flag"></i> Avg Wind (m/s)', avgWinds, 'forecast-item wind'),
        createSection('<i class="fa fa-tint w3-text-blue"></i> Humidity (%)', humidities, 'forecast-item humidity'),
        createSection('<i class="fa fa-tint"></i> Rain (mm)', rains, 'forecast-item rain'),
        createSection('Description', descriptions, 'forecast-item description')
    ].join('');

    return weatherHTML;
}

/**
 * Extracts and formats the time from the date string.
 * @param {string} dateTime - The date-time string in ISO format.
 * @returns {string} - The formatted time.
 */
function formatTime(dateTime) {
    return dateTime.slice(11, 16);
}

/**
 * Renders the HTML for the current weather body based on the provided weather JSON data.
 *
 * @param {object} weatherJSON - The JSON data containing the current weather information.
 * @return {void}
 */
function renderCurrentWeatherBody(weatherJSON) {
  const currentWeatherContainer = document.getElementById("current-weather-container");
  if (currentWeatherContainer) {  // Check if the element exists
    currentWeatherContainer.innerHTML = buildCurrentWeatherHtml(extractWeatherData(weatherJSON, 2, 8));
  }
}

/**
 * Renders the HTML for the coming weather body based on the provided weather JSON data.
 *
 * @param {object} weatherJSON - The JSON data containing the weather information.
 * @return {void}
 */
function renderCommingWeatherBody (weatherJSON){
    const commingWeatherContainer = document.getElementById("comming-weather-container");
    if (commingWeatherContainer) {  // Check if the element exists
        const dailyWeatherArray = extractDailyWeatherSummary(weatherJSON);
        document.getElementById("comming-weather-container").innerHTML = buildDaysWeatherHtml(dailyWeatherArray);
    }
}


/**
 * Generates the URL for weather image based on weather code.
 * @param {string} code - Weather code.
 * @returns {string} - URL for the weather image.
 */
function visualWeather(code) {
    return `weather_png/${code}.png`;
}

/**
 * Displays the weather information for the current location.
 *
 * @return {void} No return value, renders weather information to the page.
 */
function displayWeatherForLocation() {
    if (weatherObj) {
     renderCommingWeatherBody(weatherObj);
     renderCurrentWeatherBody(weatherObj);
    }
}
