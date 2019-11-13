'use strict';

let i = 0;
const txt = 'Live to Travel, Travel to Live';
const speed = 100;

function typeWriter() {
  if (i < txt.length) {
    document.getElementById('slogan').innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

typeWriter();

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
  $('.weather-top-header').html('<img src="https://lh3.googleusercontent.com/dEZIXqySRRWUsxYY33wYClESqpWWzZIDWBHrfk5TcVF_fzag1Cebk6OnkJfCMoSuT-NaXiha4bI0_EE3PgVAJzHGALWarS2kaXzhWH7ouYnKN5-QsdPwsbvUZVPSiPbt2fqub033Cw=w2400" alt="weather icon" class="weatherHeaderIcon headerIcon"><h3>Weather</h3>');
  $('.weather').html(
    `<img src="${responseJson.current.weather_icons}" alt="weather icon" class='weatherIcon'>
        <li class='weatherInfo'>Temperature: ${responseJson.current.temperature}°F(feels like: ${responseJson.current.feelslike}°F)</li>
        <li class='weatherInfo'>Description: ${responseJson.current.weather_descriptions[0]}</li>`
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
  $('.events-top-header').html('<img src="https://lh3.googleusercontent.com/Otrv0PBO7rwv4YVlkcqjv9eEFri6pHWL_uQtzZtTvN4-KoXkrIwxzM6IDSw4WP-pFGFAXE1I_LV_IAH_WSBNEiDqXs6JdvcfCvqLnkd-BaVtInFwpYYTs6ln6ttoXiU7hrnRqtvUag=w2400" alt="Foursqure Icon" class="pofHeaderIcon headerIcon"><h3>Points of Interest</h3>');
  for (let i = 0; i < responseJson.response.groups[0].items.length; i++) {

    let venue = responseJson.response.groups[0].items[i].venue;
    let venueId = venue.id;

    $('.events').append(
      `<li>${venue.name} (${venue.categories[0].name})</li>
      <li>    - ${venue.location.formattedAddress}</li>
      <div id="image-container-${venueId}"></div>`
    );
  }
  
  console.log('events working?');
}
let today = new Date();
let dd = String(today.getDate()).padStart(2,'0');
let mm = String(today.getMonth() + 1).padStart(2,'0');
let yyyy = today.getFullYear();

today = yyyy + mm + dd;

function getEventsInfo() {
  const nearParam = $('#search-place').val().toLowerCase();  
  const params = {
    client_id: eventsClientID,
    client_secret: eventsClientSecret,
    near: nearParam,
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