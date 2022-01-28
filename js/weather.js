getLocation();
var userLocation = "";

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser");
    }
  }

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +" Longitude: " + position.coords.longitude );
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    displayLocation(lat,lon, function(){
        var resp = JSON.parse(this.responseText);
        userLocation = resp.address.city;
        getWeather(lat,lon);
    });
   
}
function getWeather (lat,lon){
    //let apiBaseUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/complete?';
    let apiBaseUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?';
    let apiUrl = apiBaseUrl+'lat='+lat+'&lon='+lon;

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    const myInit = {
        method: 'GET',
        headers: myHeaders,
        cache: 'default'
    };

    fetch(apiUrl, myInit)
    .then(res => { 
        if(res.ok){
            console.log("OK")
            return res.json();
        }
        else{
            console.log("ERROR");
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    })
    .then(data => {
        console.log(data);
        weatherInfo(data,userLocation);
    })

}

function displayLocation(latitude,longitude,callback){
    var xttp = new XMLHttpRequest();

    // Paste your LocationIQ token below.
    xttp.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.ace7d9c9f893b1066a483ef3e05a2280&lat=" +latitude + "&lon=" + longitude + "&format=json", true);
    //xttp.send();
    xttp.onreadystatechange = function () {
        if (xttp.readyState == 4 && xttp.status == 200) {

            if (typeof callback === "function") {
                callback.apply(xttp);
            }

        }
        else{
            console.log("ERROR");
        }
    }
    xttp.send();

  }; 

function weatherInfo (myJSON,userLocation){ 

    let weatherHTML;
    let myLocation = userLocation;

    //Full set
    let showWeather = myJSON.properties.timeseries[0];
    //Symbol-code
    let weatherCode = myJSON.properties.timeseries[0].data.next_1_hours.summary.symbol_code;
    //Temp
    let temperature = myJSON.properties.timeseries[0].data.instant.details.air_temperature;
    //Unit
    //let showWeather4 = myJSON.properties.meta.units.air_temperature;

    weatherHTML = '<a class="weather-txt"> Current weather in ' + myLocation + " " + temperature  +'℃ </a>';
    weatherHTML += '<img class="weather-img" src='+ visualWeather(weatherCode) +' alt='+ weatherCode +'>';
    document.getElementById("main-weather").innerHTML = weatherHTML;
 
}

function visualWeather (code){
    let basePath = "\\weather_png\\";
    let imgPath = basePath + code + ".png";

    return imgPath;
}


