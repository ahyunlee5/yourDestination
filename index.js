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
  $('.weather-top-header').html('<h3>Weather</h3>');
  $('.weather').html(
    `<li><img src="${responseJson.current.weather_icons}" alt="weather icon"></li>
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

function displayEventResults(responseJson) {
  console.log(responseJson);
  $('.events').empty();
  $('.events-top-header').html('<h3>Events</h3>');
  for (let i = 0; i < responseJson.response.groups[0].items.length; i++) {
    $('.events').append(
      `<li><img src='${responseJson.response.groups[0].items[i].venue.categories[0].icon.prefix} + ${responseJson.response.groups[0].items[i].venue.categories[0].icon.suffix}'</li>
      <li>${responseJson.response.groups[0].items[i].venue.name} (${responseJson.response.groups[0].items[i].venue.categories[0].name})</li>
      <li>    - ${responseJson.response.groups[0].items[i].venue.location.formattedAddress}</li>`
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
    limit: 30,
    offset: 5,
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
    .then(responseJson => displayEventResults(responseJson))
    .catch(error => {
      $('.error-message-events').text(`Error Occured: ${error.message}`);
    });
}

// const apiKeyCurrency = '7f0163d4a773b6371639d9b503451423';
// const baseURLCurrency = 'http://apilayer.net/api/live';

// function displayCurrencyResults(responseJson) {
//   console.log(responseJson);
//   console.log('currency');
//   $('.currency').empty();
//   $('.currency').html(
//       `<li>${responseJson.timestamp}</li>
//       <li>${responseJson.quotes}</li>`
//   );

// }

// function getCurrencyInfo() {
//   const params = {
//     access_key: apiKeyCurrency,
//     currencies: {
//       CAD: 'Canadian Dollar',
//       KRW: 'South Korean Won',
//       EUR: 'Euro',
//     },
//     format: 1,
//   };
//   const currencyQueryString = formatQueryParams(params);
//   const currencyURL = baseURLCurrency + '?' + currencyQueryString;

//   console.log(currencyURL);

//   fetch(currencyURL)
//     .then(response => {
//       if(response.ok) {
//         return response.json();
//       }
//       throw new Error (response.statusText);
//     })
//     .then(responseJson => displayCurrencyResults(responseJson))
//     .catch(error => {
//       $('.error-message-events').text(`Error Occured: ${error.message}`);
//     });
// }

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchPlace = $('.search-place').val();
    const hourly = 1;
    const interval = 12;

    getEventsInfo(searchPlace);
    getWeatherInfo(searchPlace, hourly, interval);
    // getCurrencyInfo();
  });
}



function magic() {
  watchForm();
}

$(magic());