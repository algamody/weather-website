 const apiKey = "ec745d5a3c584ffeb3f132223251505";

// document.addEventListener('keydown', (e) => {
//   // تأكد أن الضغط تم داخل input وأن الزر هو Enter
//   if (e.key === 'Enter' && document.getElementById("city").value !== '') {
//     getWeather(); // استدعاء دالة الطقس
//   }
// });

async function getWeather() {
  const city = document.getElementById('city').value;
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=en`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Can not fetch the data -> Error: ' + response.status + ' (' + response.statusText + ')');
    const data = await response.json();

    const weatherDiv = document.getElementById("weather");
    weatherDiv.innerHTML = `
        <h3>Weather in ${data.location.name}, ${data.location.country}</h3>
        <p>Temperature: ${data.current.temp_c}°C</p>
        <p>Condition: ${data.current.condition.text}</p>
        <img src="https:${data.current.condition.icon}" alt="Weather condition">
        <p>Humidity: ${data.current.humidity}%</p>
      `;

    if (data.current.is_day === 1) {
      console.log('day')
      document.body.classList.add('day');
      document.body.classList.remove('night');
    } else {
      document.body.classList.add('night');
      document.body.classList.remove('day');
    }
  } catch (error) {
    document.getElementById("weather").innerText = "Something went wrong , or there is no city with this name";
    console.error(error);
  }
}

let debounceTimer;

document.getElementById('city').addEventListener('input', () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const query = document.getElementById('city').value.trim();
    if (query.length >= 2) {
      fetchSuggestions(query);
    } else {
      document.getElementById('suggestions').innerHTML = '';
    }
  }, 400);
});

async function fetchSuggestions(query) {
  const url = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching suggestions');
    const suggestions = await response.json();

    const suggestionsBox = document.getElementById('suggestions');
    if (suggestions.length === 0) {
      suggestionsBox.innerHTML = '<div class="list-group-item">No results</div>';
      return;
    }
    console.log(suggestions);
    suggestionsBox.innerHTML = suggestions.map(city =>
      `<div class="list-group-item suggestion-item" onclick="selectCity('${city.name}, ${city.country}')">
        ${city.name}, ${city.country}
      </div>`
    ).join('');
  } catch (error) {
    console.error('Suggestion Error:', error);
  }
}

function selectCity(cityName) {
  document.getElementById('city').value = cityName;
  document.getElementById('suggestions').innerHTML = '';
  getWeather(); // الدالة الأصلية التي تجلب الطقس
}
