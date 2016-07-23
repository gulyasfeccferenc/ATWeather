var FeccWeatherModule = {};

(function() {
  var lat,
      lon,
      city,
      isCached = false,
      actualTemp,
      lastWeather,
      location,
      isCelsius = true; //metric, imperial


  /**
   * refreshDOM - Will refresh the dom with the curren set of value
   *
   */
  function refreshDOM() {
    $('section').removeClass().addClass(lastWeather.toLowerCase());
    $('[data-position]').text(location);
    $('[data-weather-container]').text(Math.floor(getCorrectTemp()) + (isCelsius?' °C':' °F'));
  }


  /**
   * getCorrectTemp - Convert units to Fahrenheit if necessary
   *
   * @return {number}  the temperature in the correct unit
   */
  function getCorrectTemp() {
    return isCelsius ? actualTemp : (actualTemp * 1.8) + 32
  }

  /**
   * getWeatherInfo - Will fetch the actual weather info and refresh
   *                  the weather and the background when it's done.
   *
   * @param  {type} lat  description
   * @param  {type} lon  description
   */
  function getWeatherInfo() {
    var calling = "http://api.openweathermap.org/data/2.5/weather?lat="
    +lat+"&lon="+lon+"&units="
    +(isCelsius?'metric':'imperial')
    +"&appid=8227b9586af3026fcc2675103a7b5940";

    $.get(calling, function(response) {
      lastWeather = response.weather[0].main.toLowerCase();
      actualTemp = response.main.temp;
      cacheValues();
      refreshDOM();
    }, "jsonp");
  }

  function showWeatherInfo() {
    if (isCached) {
      refreshDOM();
    } else {
      getWeatherInfo();
    }
  }

  function cacheValues() {
    if (lat) localStorage.setItem('latitude', lat);
    if (lon) localStorage.setItem('longitude', lon);
    if (location) localStorage.setItem('currentCity', location);
    if (lastWeather) localStorage.setItem('lastWeather', lastWeather);
    if (actualTemp) localStorage.setItem('temperature', actualTemp);
    isCached = true;
  }
  /**
   * fetchGeoInfo - Try to get locational info than cache it.
   *
   */
  function fetchGeoInfo() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon, function(response) {
          if (response) {
            location = response.results[1].formatted_address;
            cacheValues();
            getWeatherInfo();
          }
        })
      })
    } else {
      fetchIPInfo();
    }
  }



  /**
   * fetchIPInfo - Will fetch the latitude and longitude by ID and call
   * getWeatherInfo
   *
   */
  function fetchIPInfo() {
    $.get("http://ipinfo.io", function(response) {
      location = response.city + ', '+ response.country;
      lat = response.loc.split(',')[0];
      lon = response.loc.split(',')[1];
      getWeatherInfo();
    }, "jsonp");
  }

  /**
   * tryLocation - Try if any location value available and fetch new info
   * in none available.
   *
   * @param  {type} fetchNewCallback description
   * @return {type}                  description
   */
  function tryLocation(fetchNewCallback) {
    lat = lat || localStorage.getItem('latitude');
    lon = lon || localStorage.getItem('longitude');
    location = location || localStorage.getItem('currentCity');
    actualTemp = actualTemp || localStorage.getItem('temperature');
    lastWeather = lastWeather || localStorage.getItem('lastWeather');

    if (!lat || !lon || !city) {
      fetchGeoInfo();
    } else if (!actualTemp && !lastWeather) {
      showWeatherInfo();
    } else {
      refreshDOM();
    }
  }


  /**
   * toggleUnits - Will toggle the units from celsius to Fahrenheit and vica-versa.
   * Will refresh the weather container as well.
   *
   * @param  {Event} clickEvent - the fired clickEvent
   */
  function toggleUnits(clickEvent) {
    $(clickEvent.target).text('Show me in ' + ((isCelsius) ? 'Fahrenheit!' : 'Celsius!'));
    isCelsius = !isCelsius;
    refreshDOM();
  }
  /**
   * init - Will initialize our tiny script
   *
   */
  function init() {
    tryLocation();
    $('[data-metric-toggle]').on('click', toggleUnits);
  }

  return FeccWeatherModule.init = init;
})();

FeccWeatherModule.init();
