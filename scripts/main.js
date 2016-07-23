var FeccWeatherModule = {};

(function() {
  var lat,
      lon,
      city,
      actualTemp = 20,
      cachedWeather = false,
      isCelsius = true; //metric, imperial

  /**
   * refreshLocation - will refresh the position's text with the
   * given location
   *
   * @param  {string} location description
   */
  function refreshLocation(location) {
    $('[data-position]').text(location);
  }

  /**
   * refreshWeather - Refresh the current weather output depends on what
   * unit is selected.
   *
   * @param  {string} temp - Actual temperature
   * @param  {string} unit - metric/imperial
   */
  function refreshWeather(temp) {
    $('[data-weather-container]').text(Math.floor(temp) + (isCelsius?' °C':' °F'));
  }


  /**
   * refreshBackground - Will set the background according to the current
   * weather type
   *
   * @param  {string} weather - the actual weather type
   */
  function refreshBackground(weather) {
    $('section').removeClass().addClass(weather[0].main.toLowerCase());
  }


  /**
   * getWeatherInfo - Will fetch the actual weather info and refresh
   *                  the weather and the background when it's done.
   *
   * @param  {type} lat  description
   * @param  {type} lon  description
   */
  function getWeatherInfo(lat, lon) {

    var calling = "https://api.openweathermap.org/data/2.5/weather?lat="
        +lat+"&lon="+lon+"&units="
        +(isCelsius?'metric':'imperial')
        +"&appid=8227b9586af3026fcc2675103a7b5940";

    $.get(calling, function(response) {
      cacheValues(response.weather, respones.main.temp, unit);
      refreshWeather(response.main.temp, units);
      refreshBackground(response.weather);
    }, "jsonp");
  }

  function cacheValues() {

  }
  /**
   * fetchGeoInfo - Try to get locational info than cache it.
   *
   */
  function fetchGeoInfo() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(pos) {
        var getCity = "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&sensor=true";
        console.warn(pos.coords);
      })
    } else {
      fetchIPInfo();
    }

  }


  function fetchIPInfo() {
    $.get("http://ipinfo.io", function(response) {
      refreshLocation(response.city + ', '+ response.country);
      lat = response.loc.split(',')[0];
      lon = response.loc.split(',')[1];
      //getWeatherInfo(lat, lon, unit);
      cacheValues();
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
    city = city || localStorage.getItem('currentCity');

    if (!lat || !lon) {
      fetchGeoInfo();
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
    refreshWeather(
      isCelsius ? actualTemp
      : (actualTemp * 1.8) + 32
    );
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
