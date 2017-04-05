(function localWeather() {
  const API = {
    location: 'https://www.googleapis.com/geolocation/v1/geolocate?key=',
    address: {
      host: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=',
      params: 'result_type=political|sublocality|sublocality_level_2'
    },
    weather: 'http://api.openweathermap.org/data/2.5/weather?lat='
  };

  const MAPS_KEY = 'AIzaSyBbGteiBBLBNomNfXMKy_IpMYgaydXC0ZA';
  const WEATHER_KEY = 'b3e04cf774d814fce1dec23f7fea957f';

  function handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response.json());
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }

  function handleError(error) {
    console.log('Request failed', error);
  }

  function getLocality(lat, lng) {
    fetch(`${API.address.host}${lat},${lng}&${API.address.params}&key=${MAPS_KEY}`)
      .then(handleResponse)
      .then(json => {
        console.log(json.results[0].formatted_address);
      })
      .catch(handleError);
  }

  function getWeather(lat, lng) {
    fetch(`${API.weather}${lat}&lon=${lng}&appid=${WEATHER_KEY}&units=metric`)
      .then(handleResponse)
      .then(json => {
        console.log(json.main.temp);
      })
      .catch(handleError);
  }

  function init() {
    fetch(`${API.location}${MAPS_KEY}`, {method: 'POST'})
      .then(handleResponse)
      .then(json => {
        const { lat, lng } = json.location;
        console.log(lat, lng);
        getLocality(lat, lng);
        getWeather(lat, lng);
      })
      .catch(handleError);
  }

  init();

})();
// function httpRequest(method, url) {
//
//   return new Promise(function(resolve, reject) {
//
//     var xhr = new XMLHttpRequest();
//     xhr.open(method, url, true);
//
//     xhr.onload = function() {
//       if (this.status == 200) {
//         resolve(this.response);
//       } else {
//         var error = new Error(this.statusText);
//         error.code = this.status;
//         reject(error);
//       }
//     };
//
//     xhr.onerror = function() {
//       reject(new Error("Network Error"));
//     };
//
//     xhr.send();
//   });
//
// }
//
// httpRequest('POST', 'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBbGteiBBLBNomNfXMKy_IpMYgaydXC0ZA')
//   .then(
//     response => {
//       const coords = JSON.parse(response).location;
//       const parentDiv = document.getElementById('weather');
//       getLocality(coords.lat, coords.lng, parentDiv);
//       getWeather(coords.lat, coords.lng, parentDiv);
//     },
//     error => console.log(error)
//   );
//
// function getLocality(lat, lng, parent) {
//   httpRequest('GET', `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=political|sublocality|sublocality_level_2&key=AIzaSyBbGteiBBLBNomNfXMKy_IpMYgaydXC0ZA`)
//     .then(
//       response => {
//         const address = document.createElement('p');
//         const result = JSON.parse(response).results[0].formatted_address;
//         address.innerHTML = result;
//         parent.appendChild(address);
//       },
//       error => console.log(error)
//     );
// }
//
// function getWeather(lat, lng, parent) {
//   httpRequest('GET', `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=b3e04cf774d814fce1dec23f7fea957f&units=metric`)
//     .then(
//       response => {
//         const weather = document.createElement('p');
//         const result = JSON.parse(response);
//         weather.innerHTML = result.main.temp;
//         parent.appendChild(weather);
//       },
//       error => console.log(error)
//     );
// }
