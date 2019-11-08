'use strict';

const apiKeyWeather = 'ee39c62532f58903fd4b58e2a23f45ea';
const baseURLWeather = 'http://api.weatherstack.com/current';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayWeatherResult(responseJson) {
  console.log(responseJson);
  $('.weather').empty();
  $('.weather').html(
    `<li>${responseJson.location.name}:</li>
    <li><img src="${responseJson.current.weather_icons}" alt="weather icon"></li>
        <li>Temperature: ${responseJson.current.temperature}</li>
        <li>Description: ${responseJson.current.weather_description}</li>
        <li>Feels like: ${responseJson.current.feelslike}</li>`
  );
  $('main').removeClass('hidden');
  console.log('weather functioning?');
}

function getWeatherInfo() {
  const params = {
    access_key: apiKeyWeather,
    query: $('#search-place').val(),
    hourly: 1,
    interval: 12,
    units: 'f',
  };
  
  const weatherQueryString = formatQueryParams(params);
  const weatherURL = baseURLWeather + '?' + weatherQueryString;

  console.log(weatherURL);

  fetch(weatherURL)
    .then(response => {
      if (response.ok) {
        return response.json();
      } throw new Error (response.statusText);
    })
    .then (responseJson => displayWeatherResult(responseJson))
    .catch(error => {
      $('.error-message-weather').text(`Error Occured: ${error.message}`);
    });
}

const eventsClientID = 'J5YO3IQNB235ED5HSIF25UGXEKM0EQRIJ2KB0R2IELSNST3Y';
const eventsClientSecret = 'TOH3JWOLW0M11S0KZMTQMJ35USVF5RG1YJG4OWTP5GB0EVEM';
const baseURLEvents = 'https://api.foursquare.com/v2/venues/explore';

function displayEventResults(responseJsun) {
  console.log(responseJsun);
  $('.events').empty();
  for (let i=0; i < responseJsun.totalResults; i++) {
    $('.events').append(
      `<li><h1>${responseJsun.groups[i].items.venue.name}</h1></li>
      <li><h2>${responseJsun.groups[i].categories.name}</h2></li>
      <li><h3>${responseJsun.groups[i].items.venue.formattedAddress}</h3></li>`
    );}
  
  console.log('events working?');
}

let today = new Date();
let dd = String(today.getDate()).padStart(2,'0');
let mm = String(today.getMonth() + 1).padStart(2,'0');
let yyyy = today.getFullYear();

today = yyyy + mm + dd;

function getEventsInfo() {
  const params = {
    client_id: eventsClientID,
    client_secret: eventsClientSecret,
    near: $('#search-place').val(),
    section: 'topPicks',
    limit: 50,
    offset: 10,
    sortByPopularity: 1,
    v: today,
  };
  
  const eventsQueryString = formatQueryParams(params);
  const eventsURL = baseURLEvents + '?' + eventsQueryString;

  console.log(eventsURL);

  fetch(eventsURL)
    .then(response => {
      if(response.ok) {
        return response.json();
      }
      throw new Error (response.statusText);
    })
    .then(responseJsun => displayEventResults(responseJsun))
    .catch(error => {
      $('.error-message-events').text(`Error Occured: ${error.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchPlace = $('.search-place').val();
    const hourly = 1;
    const interval = 12;

    getEventsInfo(searchPlace);
    getWeatherInfo(searchPlace, hourly, interval);
  });
}



function magic() {
  watchForm();
}

$(magic());