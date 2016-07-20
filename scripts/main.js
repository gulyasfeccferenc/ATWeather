var lat,
    lon,
    units = 'metric';

/**
 * refreshLocation - description
 *
 * @param  {type} location description
 * @return {type}          description
 */
function refreshLocation(location) {
  $('[data-position]').text(location);
}

/**
 * refreshWeather - description
 *
 * @param  {type} temp description
 * @param  {type} unit description
 * @return {type}      description
 */
function refreshWeather(temp, unit) {
  var metric = ' °C';
  if (unit != 'metric') metric = ' F';
  $('[data-weather-container]').text(Math.floor(temp) + metric);
}


/**
 * refreshBackground - description
 *
 * @param  {type} weather description
 * @return {type}         description
 */
function refreshBackground(weather) {
  //console.log(weather[0].main);
  $('section').removeClass().addClass(weather[0].main.toLowerCase());
}


/**
 * getWeatherInfo - Will fetch the actual weather info and refresh
 *                  the weather and the background when it's done.
 *
 * @param  {type} lat  description
 * @param  {type} lon  description
 * @param  {type} unit description
 */
function getWeatherInfo(lat, lon, unit) {
  var calling = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units="+unit+"&appid=8227b9586af3026fcc2675103a7b5940";

  $.get(calling, function(response) {
    refreshWeather(response.main.temp, units);
    refreshBackground(response.weather);
  }, "jsonp");
}

/**
 * fetchGeoInfo - Will fetch where the current user are, based on her IP
 *
 * @param  {function} callback
 */
function fetchGeoInfo(callback) {
  $.get("http://ipinfo.io", function(response) {
    refreshLocation(response.city + ', '+ response.country);
    lat = response.loc.split(',')[0];
    lon = response.loc.split(',')[1];
    getWeatherInfo(lat, lon, units);
  }, "jsonp");
}


/**
 * init - Will initialize our tiny script
 *
 */
function init() {
  var $button = $('[data-metric-toggle]');

  fetchGeoInfo();

  $button.on('click', function () {
    if (units == 'metric') {
      units = 'imperial';
      $button.text('Show me in Celcius!');
    } else {
      units = 'metric';
      $button.text('Show me in Fahrenheit!');
    }

    getWeatherInfo(lat, lon, units);
  })
}

init();
