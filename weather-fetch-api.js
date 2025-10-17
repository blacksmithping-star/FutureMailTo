async function getWeather(city) {
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=22.3&longitude=91.8&current_weather=true`);
  const data = await res.json();
  document.getElementById("weather").textContent =
    `Temperature: ${data.current_weather.temperature}°C`;
}

getWeather("Chittagong");
