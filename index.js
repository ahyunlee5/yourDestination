'use strict';
const typeWriterVariables = {
  i: 0,
  txt: 'Live to Travel, Travel to Live',
  speed: 100,
};


function typeWriter() {
  if (typeWriterVariables.i < typeWriterVariables.txt.length) {
    document.getElementById('slogan').innerHTML += typeWriterVariables.txt.charAt(typeWriterVariables.i);
    typeWriterVariables.i++;
    setTimeout(typeWriter, typeWriterVariables.speed);
  }
}

typeWriter();

const requirements = {
  apiKeyWeather: 'ee39c62532f58903fd4b58e2a23f45ea',
  baseURLWeather: 'https://api.weatherstack.com/current',
  eventsClientID: 'J5YO3IQNB235ED5HSIF25UGXEKM0EQRIJ2KB0R2IELSNST3Y',
  eventsClientSecret: 'TOH3JWOLW0M11S0KZMTQMJ35USVF5RG1YJG4OWTP5GB0EVEM',
  baseURLEvents: 'https://api.foursquare.com/v2/venues/explore',
};

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}

function displayWeatherResult(responseJson) {
  // var rounding = Math.round(responseJson.main.temp);

  $('.weather').empty();
  $('.weather').html(
    `<li class='weatherInfo'>${responseJson.location.name}</li>
    <img src="${responseJson.current.weather_icons}" alt="weather icon" class='weatherIcon'>
        <li class='temp'>${responseJson.current.temperature}°F</li>
        <li class='weatherInfo'>${responseJson.current.feelslike}°F</li>
        <li class='weatherInfo'>Description: ${responseJson.current.weather_descriptions}</li>`
  );
  $('main').removeClass('hidden');
}

function getWeatherInfo() {
  const params = {
    access_key: requirements.apiKeyWeather,
    query: $('#search-place').val(),
    units: 'f',
  };
  
  const weatherQueryString = formatQueryParams(params);
  const weatherURL = requirements.baseURLWeather + '?' + weatherQueryString;

  fetch(weatherURL)
    .then(response => {
      if (response.ok) {
        console.log(response.Json);
        return response.json();
      } throw new Error (response.statusText);
    })
    .then (responseJson => displayWeatherResult(responseJson))
    .catch(error => {
      $('.error-message-weather').text(`Error Occured: ${error.message}`);
    });
}

function displayEventResults(responseJson) {
  $('.events').empty();
  $('.events-top-header').html('<h3>Points of Interest:</h3>');
  for (let i = 0; i < responseJson.response.groups[0].items.length; i++) {
    let venue = responseJson.response.groups[0].items[i].venue;

    $('.events').append(
      `<li id="icon-contianer"><img src=${venue.categories[0].icon.prefix}64${venue.categories[0].icon.suffix}></li>
      <li class='eventInfo'>${venue.name} (${venue.categories[0].name})</li>
      <li>${venue.location.formattedAddress}</li>`
    );
  }
}
let today = new Date();
let dd = String(today.getDate()).padStart(2,'0');
let mm = String(today.getMonth() + 1).padStart(2,'0');
let yyyy = today.getFullYear();

today = yyyy + mm + dd;

function getEventsInfo() {
  const nearParam = $('#search-place').val().toLowerCase();  
  const params = {
    client_id: requirements.eventsClientID,
    client_secret: requirements.eventsClientSecret,
    near: nearParam,
    section: 'topPicks',
    limit: 30,
    offset: 5,
    sortByPopularity: 1,
    v: today,
  };
  

  const eventsQueryString = formatQueryParams(params);
  const eventsURL = requirements.baseURLEvents + '?' + eventsQueryString;

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

$(magic);