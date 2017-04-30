(function localWeather() {
  const API = {
    location: 'https://www.googleapis.com/geolocation/v1/geolocate',
    address: {
      host: 'https://maps.googleapis.com/maps/api/geocode/json',
      params: 'result_type=political|sublocality|sublocality_level_2'
    },
    weather: {
      host: 'http://api.openweathermap.org/data/2.5/weather',
      icon: 'http://openweathermap.org/img/w/'
    }
  };

  const MAPS_KEY = 'AIzaSyBbGteiBBLBNomNfXMKy_IpMYgaydXC0ZA';
  const WEATHER_KEY = 'b3e04cf774d814fce1dec23f7fea957f';

  // Get coordinates from googleapis
  fetch(`${API.location}?key=${MAPS_KEY}`, {method: 'POST'})
    .then(res => res.json())
    .then(json => {
      const { lat, lng } = json.location;
      const urls = [
        `${API.address.host}?latlng=${lat},${lng}&${API.address.params}&key=${MAPS_KEY}`,
        `${API.weather.host}?lat=${lat}&lon=${lng}&appid=${WEATHER_KEY}&units=metric`
      ];
      // Get human-readable address and weather data
      Promise.all(urls.map(url => fetch(url).then(res => res.json())))
        .then(responses => {
          const [ locality, weather ] = responses;
          render(locality, weather);
        })
    })
    .catch(handleError);

    function render(localityInfo, weatherInfo) {
      const weatherWidget = document.querySelector('#weatherWidget');
      weatherWidget.appendChild(renderWeather(weatherInfo));
      weatherWidget.appendChild(renderAddress(localityInfo));
    }

    function renderWeather(weatherInfo) {
      const weatherContainer = document.createElement('p');
      weatherContainer.className = 'widget-weather';
      const wind = renderWindConditions(weatherInfo.wind);

      const imageContainer = document.createElement('div');
      const image = document.createElement('img');
      const imageDescription = document.createElement('p');
      image.src = `${API.weather.icon}${weatherInfo.weather[0].icon}.png`;
      imageDescription.innerHTML = weatherInfo.weather[0].description;
      console.log(weatherInfo.weather[0].description);
      imageContainer.className = 'widget-image-container';
      imageContainer.appendChild(image);
      imageContainer.appendChild(imageDescription);


      const degrees = document.createElement('span');
      const degreesString = `${Math.round(weatherInfo.main.temp)}&degC`
      degrees.innerHTML = degreesString;
      degrees.className = 'widget-degrees';

      const elements = [wind, imageContainer, degrees];
      elements.forEach(element => weatherContainer.appendChild(element));
      return weatherContainer;
    }

    function renderWindConditions(wind) {
      const windContainer = document.createElement('span');
      windContainer.className = 'widget-wind';
      const windDirection = degToDirection(wind.deg);
      const windString = `Wind ${wind.speed.toFixed(1)} m/s ${windDirection}`;
      windContainer.innerHTML = windString;
      return windContainer;
    }

    function degToDirection(deg) {
      if (deg > 22.5 && deg < 67.5) {
        return 'NE';
      } else if (deg > 67.5 && deg < 112.5) {
        return 'E';
      } else if (deg > 112.5 && deg < 157.5) {
        return 'SE';
      } else if (deg > 157.5 && deg < 202.5) {
        return 'S';
      } else if (deg > 202.5 && deg < 247.5) {
        return 'SW';
      } else if (deg > 247.5 && deg < 292.5) {
        return 'W';
      } else if (deg > 292.5 && deg < 337.5) {
        return 'NW';
      } else {
        return 'N';
      }
    }

    function renderAddress(localityInfo) {
      const address = document.createElement('p');
      address.className = 'widget-address';
      address.innerHTML = localityInfo.results[0].formatted_address;
      return address;
    }

    function handleError(error) {
      console.log('Request failed', error);
    }
})();
