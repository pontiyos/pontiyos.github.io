//This should be mmoved to DB or other JS

const cities = {
    tokyo: {
      name: "Tokyo",
      latitude: 35.682839,
      longitude: 139.759455,
      country: "Japan"
    },
    delhi: {
      name: "Delhi",
      latitude: 28.704060,
      longitude: 77.102493,
      country: "India"
    },
    shanghai: {
      name: "Shanghai",
      latitude: 31.230391,
      longitude: 121.473701,
      country: "China"
    },
    são_paulo: {
      name: "São Paulo",
      latitude: -23.550520,
      longitude: -46.633308,
      country: "Brazil"
    },
    mexico_city: {
      name: "Mexico City",
      latitude: 19.432608,
      longitude: -99.133209,
      country: "Mexico"
    },
    cairo: {
      name: "Cairo",
      latitude: 30.044420,
      longitude: 31.235712,
      country: "Egypt"
    },
    dhaka: {
      name: "Dhaka",
      latitude: 23.810331,
      longitude: 90.412521,
      country: "Bangladesh"
    },
    mumbai: {
      name: "Mumbai",
      latitude: 19.076090,
      longitude: 72.877426,
      country: "India"
    },
    beijing: {
      name: "Beijing",
      latitude: 39.904202,
      longitude: 116.407394,
      country: "China"
    },
    osaka: {
      name: "Osaka",
      latitude: 34.693737,
      longitude: 135.502167,
      country: "Japan"
    },
    karachi: {
      name: "Karachi",
      latitude: 24.860735,
      longitude: 67.001137,
      country: "Pakistan"
    },
    chongqing: {
      name: "Chongqing",
      latitude: 29.563761,
      longitude: 106.550464,
      country: "China"
    },
    istanbul: {
      name: "Istanbul",
      latitude: 41.008240,
      longitude: 28.978359,
      country: "Turkey"
    },
    buenos_aires: {
      name: "Buenos Aires",
      latitude: -34.603684,
      longitude: -58.381559,
      country: "Argentina"
    },
    kolkata: {
      name: "Kolkata",
      latitude: 22.572646,
      longitude: 88.363895,
      country: "India"
    },
    lagos: {
      name: "Lagos",
      latitude: 6.524379,
      longitude: 3.379206,
      country: "Nigeria"
    },
    kinshasa: {
      name: "Kinshasa",
      latitude: -4.441931,
      longitude: 15.266293,
      country: "Democratic Republic of the Congo"
    },
    manila: {
      name: "Manila",
      latitude: 14.599512,
      longitude: 120.984222,
      country: "Philippines"
    },
    tianjin: {
      name: "Tianjin",
      latitude: 39.343357,
      longitude: 117.361649,
      country: "China"
    },
    rio_de_janeiro: {
      name: "Rio de Janeiro",
      latitude: -22.906847,
      longitude: -43.172897,
      country: "Brazil"
    },
    stockholm: {
      name: "Stockholm",
      latitude: 59.329323,
      longitude: 18.068581,
      country: "Sweden"
    },
    copenhagen: {
      name: "Copenhagen",
      latitude: 55.676098,
      longitude: 12.568337,
      country: "Denmark"
    },
    malmö: {
      name: "Malmö",
      latitude: 55.605874,
      longitude: 13.000731,
      country: "Sweden"
    },
    helsingborg: {
      name: "Helsingborg",
      latitude: 56.046467,
      longitude: 12.694512,
      country: "Sweden"
    },
    göteborg: {
      name: "Göteborg",
      latitude: 57.708870,
      longitude: 11.974560,
      country: "Sweden"
    },
    // Added cities with partial matches
    new_york: {
      name: "New York",
      latitude: 40.712776,
      longitude: -74.005974,
      country: "United States"
    },
    mexico_city: {
      name: "Mexico City",
      latitude: 19.432608,
      longitude: -99.133209,
      country: "Mexico"
    },
    new_delhi: {
      name: "New Delhi",
      latitude: 28.613939,
      longitude: 77.209021,
      country: "India"
    },
    kansas_city: {
      name: "Kansas City",
      latitude: 39.099728,
      longitude: -94.578568,
      country: "United States"
    },
    los_angeles: {
      name: "Los Angeles",
      latitude: 34.052235,
      longitude: -118.243683,
      country: "United States"
    },
    kyoto: {
      name: "Kyoto",
      latitude: 35.011636,
      longitude: 135.768029,
      country: "Japan"
    },
    hagen: {
        name: "Hagen",
        latitude: 51.367077,
        longitude: 7.463284,
        country: "Germany"
    },
    la_paz: {
      name: "La Paz",
      latitude: -16.500000,
      longitude: -68.150002,
      country: "Bolivia"
    }
};


/**START OF ACCTUAL WEATHER */

var script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/moment@2.30.1/moment.min.js";
document.head.appendChild(script);


let searchTimeout;
/**
 * Retrieves the user's current location using geolocation API.
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            showPosition(position);

            // Display the weather sections and buttons now that we have the location
            document.getElementById('current-weather').style.display = 'block';
            document.getElementById('coming-weather').style.display = 'block';
            document.getElementById('current-weather-btn-wrapper').style.display = 'block';
            document.getElementById('seven-weather-btn-wrapper').style.display = 'block';
        });
    } else {
        console.log("Geolocation is not supported by this browser");
        // You can also show a message or fallback UI if geolocation is not supported
        alert("Geolocation isn't supported");
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
function fetchWeatherData(lat, lon, cityName) {
    // Display the weather sections and buttons when fetching data manually
    document.getElementById('current-weather').style.display = 'block';
    document.getElementById('coming-weather').style.display = 'block';
    document.getElementById('current-weather-btn-wrapper').style.display = 'block';
    document.getElementById('seven-weather-btn-wrapper').style.display = 'block';

    // Displays the user's selected location and fetches weather data
    displayLocation(lat, lon, function () {
        var resp = JSON.parse(this.responseText);

        // Use the cityName provided or fallback to the detected city name
        const userLocation = cityName || resp.address.city;

        // Update the UI with the city name
        updateWeatherSections(userLocation);

        // Call getWeather with callbacks for weatherInfo and renderCurrentWeatherBody
        getWeather(lat, lon, function() {
            weatherInfo(weatherObj, userLocation);
        }, function() {
            renderCurrentWeatherBody(weatherObj);
            renderCommingWeatherBody(weatherObj);
        });
    });
}


function updateWeatherSections(cityName) {
    // Update the text of the headers and buttons with the selected city name
    const currentWeatherHeader = document.getElementById('current-weather-header');
    const comingWeatherHeader = document.getElementById('coming-weather-header');
    const currentWeatherLink = document.querySelector('a[href="weather.html#current-weather-container"]');
    const comingWeekLink = document.querySelector('a[href="weather.html#comming-weather-container"]');

    if (currentWeatherHeader) {
        currentWeatherHeader.textContent = `Current Weather in ${cityName}`;
    }

    if (comingWeatherHeader) {
        comingWeatherHeader.textContent = `Coming Week in ${cityName}`;
    }

    if (currentWeatherLink) {
        currentWeatherLink.textContent = `Current Weather in ${cityName}`;
    }

    if (comingWeekLink) {
        comingWeekLink.textContent = `Coming Week in ${cityName}`;
    }

    // Scroll to the current weather section
    document.getElementById("current-weather").scrollIntoView({ behavior: "smooth" });
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
    const apiKey = 'pk.ace7d9c9f893b1066a483ef3e05a2280'; // Use your actual API key
    const acceptLanguage = 'en';
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json&accept-language=${acceptLanguage}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (typeof callback === "function") {
                callback.call({ responseText: JSON.stringify(data) });
            }
        })
        .catch(error => console.error('Error fetching location data:', error));
}

let autoCompleteResults = [];


function autoCompleteLocation(locationString) {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    const apiKey = 'pk.ace7d9c9f893b1066a483ef3e05a2280'; // Use your actual API key
    const acceptLanguage = 'en';
    const encodedLocationString = encodeURIComponent(locationString);
    const url = `https://us1.locationiq.com/v1/autocomplete?q=${encodedLocationString}&key=${apiKey}&accept-language=${acceptLanguage}`;


    return fetch(url, options)
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data);

            // Map the API response to the format expected by displaySearchResults
            autoCompleteResults = data.map(location => ({
                name: location.display_name,
                latitude: location.lat,
                longitude: location.lon,
                country: location.address.country || "Unknown Country"  // Use a default value if country is missing
            }));

            return autoCompleteResults;
        })
        .catch(err => {
            console.error('Error fetching autocomplete data:', err);
            return [];
        });
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

function searchLocation() {
    let customLocation = document.getElementById('custom-weather-input').value;
    console.log("customLocation = " + customLocation);

    // Cancel the current timeout and start a new one
    clearTimeout(searchTimeout);

    // Hide the results area if the search input is empty
    const searchDisplay = document.getElementById('search-display');
    if (customLocation.trim() === '') {
        searchDisplay.style.display = 'none'; // Hide the search results area
    } else {
        searchDisplay.style.display = 'block'; // Show the search results area
        // Set a new timeout for 1 second (or adjust as needed)
        searchTimeout = setTimeout(() => {
            handlePartialSearch(customLocation);
        }, 1000);
    }
}

function searchWeatherLocation() {
    // Get the input value
    let customLocation = document.getElementById('custom-weather-input').value;
    
    // Cancel any ongoing timeout to prevent the partial search from being triggered
    clearTimeout(searchTimeout);

    // Check if the input length is 3 characters or more
    if (customLocation.length >= 3) {
      // Do something with the input, for now, we'll just log it
      console.log("customLocation = " + customLocation);
    }
  }

  async function handlePartialSearch(customLocation) {
    console.log("Handling search for location: " + customLocation);

    // Filter cities that contain the entered characters (case insensitive)
    const matchingCities = Object.values(cities).filter(city => 
        city.name.toLowerCase().includes(customLocation.toLowerCase())
    );

    if (matchingCities.length > 0) {
        // If we find matching cities locally, display them
        console.log("Matching cities:", matchingCities);
        displaySearchResults(matchingCities);
    } else {
        // If no matches are found locally, call the autocomplete API
        console.log("No matching cities found locally. Fetching from API...");
        const apiResults = await autoCompleteLocation(customLocation);
        displaySearchResults(apiResults);
    }
}


function displaySearchResults(results) {
    const searchDisplay = document.getElementById('search-display');
    searchDisplay.innerHTML = ''; // Clear any existing results

    results.forEach((result, index) => {
        const button = document.createElement('button');
        button.id = `city-${index}`;
        button.className = 'location-select weather-select';  // Apply the 'weather-select' class
        button.innerHTML = result.name;
        button.onclick = () => getWeatherForLocation(result.name);
        
        searchDisplay.appendChild(button);
    });

    searchDisplay.style.display = 'grid';  // Ensure display is grid
}



function getWeatherForLocation(locationName) {
    // Search in the cities array first
    let selectedCity = Object.values(cities).find(city => city.name === locationName);

    // If not found in cities, search in the autoCompleteResults array
    if (!selectedCity) {
        selectedCity = autoCompleteResults.find(city => city.name === locationName);
    }

    if (selectedCity) {
        const lat = selectedCity.latitude;
        const lon = selectedCity.longitude;

        console.log(`Fetching weather for: ${locationName} (Lat: ${lat}, Lon: ${lon})`);
        fetchWeatherData(lat, lon, locationName);
    } else {
        console.log("City not found!");
    }
}


function getLocationsMatchingPartialInput() {
    /**
     * Long term goal
     * Check aginst backend if we have looked for that before - ideally in cache but backend is ok
     * If yes return list based on that else get from API based on the partial string
     * Ensure that we have a maximum of 10 results as well as a slight delay so that we don't ping backend/API too often
     * For now we will just return hardcoded list and if not in the list we will check with API
     */
}

/**
 * Builds the HTML for the current weather forecast based on the provided weather data array.
 *
 * @param {Array<Object>} weatherArray - An array of objects containing weather data for each forecast item.
 * @return {string} The HTML string representing the current weather forecast.
 */
function buildCurrentWeatherHtml(weatherArray) {
    // Helper function to create a section of HTML with an id
    const createSection = (header, items, className, idPrefix) => {
        let sectionHTML = `<div class="${className}" id="${idPrefix}-header">${header}</div>`;
        items.forEach((item, index) => {
            sectionHTML += `<div class="${className}" id="${idPrefix}-${index}">${item}</div>`;
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

    // Build HTML with IDs
    const weatherHTML = [
        createSection('Time', times, 'forecast-header', 'time'),
        createSection('Icon', icons, 'forecast-item icon', 'icon'),
        createSection('Temperature(℃)', temperatures, 'forecast-item temperature', 'temperature'),
        createSection('<i class="fa fa-tint"></i> Rain (mm)', rains, 'forecast-item rain', 'rain'),
        createSection('<i class="fa fa-tint w3-text-blue"></i> Humidity (%)', humidities, 'forecast-item humidity', 'humidity'),
        createSection('<i class="fa fa-flag"></i> Wind (m/s)', winds, 'forecast-item wind', 'wind'),
        createSection('Description', descriptions, 'forecast-item description', 'description')
    ].join('');

    return weatherHTML;
}

function buildDaysWeatherHtml(dailyWeatherArray) {
    // Helper function to create a section of HTML
    const createSection = (header, items, className, idPrefix) => {
        let sectionHTML = `<div class="${className}" id="${idPrefix}-header">${header}</div>`;
        items.forEach((item, index) => {
            sectionHTML += `<div class="${className}" id="${idPrefix}-${index}">${item}</div>`;
        });
        return sectionHTML;
    };

    // Extract data and include day of the week with a new line before the date
    const dates = dailyWeatherArray.map(data => {
        const formattedDate = moment(data.date).format('YYYY-MM-DD'); // Format date as needed
        const dayOfWeek = moment(data.date).format('dddd'); // Get the day of the week (e.g., Monday, Tuesday)
        return `${dayOfWeek}<br>(${formattedDate})`; // Combine day and date with a line break
    });

    const icons = dailyWeatherArray.map(data => `<img src="${visualWeather(data.weatherCode || 'unknown')}" alt="${data.weatherCode || 'unknown'}">`);
    const highTemps = dailyWeatherArray.map(data => `${data.highTemperature}℃`);
    const lowTemps = dailyWeatherArray.map(data => `${data.lowTemperature}℃`);
    const avgWinds = dailyWeatherArray.map(data => `${data.avgWindSpeed} m/s`);
    const humidities = dailyWeatherArray.map(data => `${data.avgHumidity}%`);
    const rains = dailyWeatherArray.map(data => `${data.totalRain} mm`);
    const descriptions = dailyWeatherArray.map(data => data.description || 'No description');

    // Build HTML with unique IDs for each section
    const weatherHTML = [
        createSection('Date', dates, 'forecast-header', 'date'),
        createSection('Icon', icons, 'forecast-item icon', 'icon'),
        createSection('High Temp (℃)', highTemps, 'forecast-item temperature', 'high-temp'),
        createSection('Low Temp (℃)', lowTemps, 'forecast-item temperature', 'low-temp'),
        createSection('<i class="fa fa-flag"></i> Avg Wind (m/s)', avgWinds, 'forecast-item wind', 'avg-wind'),
        createSection('<i class="fa fa-tint w3-text-blue"></i> Humidity (%)', humidities, 'forecast-item humidity', 'humidity'),
        createSection('<i class="fa fa-tint"></i> Rain (mm)', rains, 'forecast-item rain', 'rain'),
        createSection('Description', descriptions, 'forecast-item description', 'description')
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


  
  