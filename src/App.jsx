import React, { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]); // new state to store search history

  const apiKey = "06f6d5234ea441798ed112304240609";
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${input}&aqi=yes`;

  useEffect(() => {
    if (input && input.length >= 50 && !loading) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
          setSearchHistory((prevHistory) => [...prevHistory, data].reverse()); // add new search to end of array
          setLoading(false); // Set loading to false on success
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false); // Set loading to false on error
        });
    }
  }, [input, loading]);
  const handleInputChange = (e) => {
    setInput(e.target.value);
    setWeatherData({});
    setLoading(true); // Set loading to true
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input && input.length >= 3) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setWeatherData(data);
          setSearchHistory((prevHistory) => [...prevHistory, data]); // add new search to history
          setLoading(false); // Set loading to false on success
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false); // Set loading to false on error
        });
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter city name"
        />
        <button type="submit">Get Weather</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {searchHistory.map((weather, index) => (
            <div key={index} className="card">
              <h2>Current Weather in {weather.location.name}</h2>
              <img
                src={`http:${weather.current.condition.icon}`}
                alt={weather.current.condition.text}
              />
              <p>Temperature: {weather.current.temp_C}°C</p>
              <p>Condition: {weather.current.condition.text}</p>
              <p>Humidity: {weather.current.humidity}</p>
              <p>Wind Speed: {weather.current.wind_kph} km/h</p>
            </div>
          ))}
        </div>
      )}
      {error ? <p style={{ color: "red" }}>{error}</p> : null}
    </div>
  );
}

export default App;
