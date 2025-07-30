// Weather app by Mohit Parihar
// Adds a human touch: friendly messages, rotating facts, and clear code

const API_KEY = "885372eae5ee3e40c210030cf7983225";

const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const description = document.getElementById('description');
const temperature = document.getElementById('temperature');
const feelsLike = document.getElementById('feelsLike');
const tempMin = document.getElementById('tempMin');
const tempMax = document.getElementById('tempMax');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const dateTime = document.getElementById('dateTime');
const errorDiv = document.getElementById('error');
const loading = document.getElementById('loading');
const factDiv = document.getElementById('fact');

// Fun, human weather facts
const weatherFacts = [
  "Did you know? The highest temperature ever recorded on Earth was 56.7°C (134°F) in Death Valley, USA!",
  "Raindrops can fall at speeds of about 22 miles per hour.",
  "The coldest temperature ever recorded was -89.2°C (-128.6°F) in Antarctica.",
  "A bolt of lightning is five times hotter than the surface of the sun!",
  "Snowflakes always have six sides, but no two are exactly alike.",
  "The wettest place on Earth is Mawsynram, India.",
  "Did you know? Frogs can predict rain!",
  "The fastest wind speed ever recorded was 407 km/h (253 mph) during a tornado.",
  "The smell of rain is called 'petrichor'.",
  "Did you know? The Sahara Desert can get cold enough to snow!"
];

function getRandomFact() {
  return weatherFacts[Math.floor(Math.random() * weatherFacts.length)];
}

function formatDateTime(unix, timezone) {
  // unix: seconds, timezone: seconds offset from UTC
  const date = new Date((unix + timezone) * 1000);
  return date.toUTCString().replace('GMT', '').trim();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;

  errorDiv.textContent = '';
  weatherResult.classList.add('hidden');
  loading.classList.remove('hidden');
  factDiv.textContent = '';

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error("Oops! Couldn't find that city. Try another one?");
      } else {
        throw new Error("Sorry, something went wrong. Please try again in a moment.");
      }
    }
    const data = await res.json();

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    description.textContent = data.weather[0].description;
    temperature.textContent = Math.round(data.main.temp);
    feelsLike.textContent = Math.round(data.main.feels_like);
    tempMin.textContent = Math.round(data.main.temp_min);
    tempMax.textContent = Math.round(data.main.temp_max);
    humidity.textContent = data.main.humidity;
    wind.textContent = data.wind.speed;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    dateTime.textContent = formatDateTime(data.dt, data.timezone);

    // Show a random weather fact
    factDiv.textContent = getRandomFact();

    weatherResult.classList.remove('hidden');
    weatherResult.classList.add('weather-card');
    setTimeout(() => weatherResult.classList.remove('weather-card'), 800); // animate fadeIn
  } catch (err) {
    errorDiv.textContent = err.message;
  } finally {
    loading.classList.add('hidden');
  }
});