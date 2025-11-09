import React, { useState, useEffect } from "react";
import styles from "./StatusPanel.module.css"; // Import CSS Module
import { FaRobot, FaWifi, FaBatteryFull, FaTrash } from "react-icons/fa";

function StatusPanel({selectedRobot}) {
  const [robotIDs, setRobotIDs] = useState({});
  const [weather, setWeather] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [error, setError] = useState(null);

  // Generate random ID on component mount
  useEffect(() => {
    const robots = ["Robot Alpha", "Robot Delta", "Robot Omega"];
    const ids = {};

    robots.forEach((robot) => {
      ids[robot] = Math.floor(1000 + Math.random() * 9000); // Random 4-digit ID
    });

    setRobotIDs(ids);
  }, []);

  // Weather fetching from Weather API
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=41.8644&longitude=-87.6511&current=temperature_2m,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FChicago"
        );
        const data = await response.json();

        if (!data.current || !data.current.temperature_2m) {
          throw new Error("Weather data unavailable");
        }

        setWeather({
          temperature_2m: data.current.temperature_2m,
          weather_code: data.current.weather_code,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to load weather data");
      }
    };

    fetchWeather();
  }, []);

  // Function to interpret weather code
  const getWeatherDescription = (code) => {
    const descriptions = {
      0: "☀️", //Clear sky
      1: "🌤", //Mainly clear
      2: "⛅", //Partly cloudy
      3: "☁️", //Overcast, cloudy
      45: "🌫", //Fog
      48: "❄️🌫", //Freezing fog
      51: "💧", //Drizzle
      53: "💧💧", //Drizzle moderate
      55: "💧💧💧", //Drizzle (dense)
      61: "🌧", //Rain (light)
      63: "🌧🌧", //Rain (moderate)
      65: "🌧🌧🌧", //Rain (heavy)
      71: "❄️", //Snowfall (light)
      73: "❄️❄️", //Snowfall (moderate)
      75: "❄️❄️❄️", //Snowfall (heavy)
      95: "⛈", //Thunderstorm
      96: "⛈❄️", //Thunderstorm with hail
      99: "⛈⛈❄️", //Severe thunderstorm with hail
    };
    return descriptions[code] || "❔"; //Unknown Weather
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // Updates every second

    return () => clearInterval(interval);
  }, []);

  // Formate date and time
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Chicago",
    }).format(date);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Chicago",
    }).format(date);
  };


  const [barData, setBarData] = useState([
    { name: "Signal", value: 90 },
    { name: "Battery", value: 99 },
    { name: "Garbage", value: 0 },
  ]);
  



  useEffect(() => {
    // Bar data
    if (selectedRobot !== "Robot Alpha") {
      return; 
    }

    //data sim
    // Simulate updating bar data every 20 seconds
      const interval = setInterval(() => {
        setBarData((prevData) =>
          prevData.map((item) => {
            if (item.name === "Signal") {
              let newValue = item.value + (Math.random() * 10 - 5);
              newValue = Math.max(80, Math.min(100, newValue));
              return { ...item, value: newValue };
            } else if (item.name === "Battery") {
              let newValue = item.value;
              newValue = Math.max(0, newValue);
              return { ...item, value: newValue };
            } else if (item.name === "Garbage") {
              let newValue = item.value + 0.1;
              newValue = Math.min(100, newValue);
              return { ...item, value: newValue };
            }
            return item;
          })
        );
      }, 20000);

      return () => clearInterval(interval);
    }, [selectedRobot]);

  return (
    <div className={styles.statusPanel}>
      {/* Robot Icon and Info */}
      <div className={styles.robotDetails}>
        <FaRobot className={styles.robotIcon} />
        <div className={styles.robotInfo}>
          <h2 className={styles.robotName}>{selectedRobot}</h2>
          {selectedRobot !== "Robot Alpha" ? (
            <>
              <p className={styles.robotCoordinates}>X: ???, Y: ???</p>
              <p className={styles.robotId}>ID: {robotIDs[selectedRobot] || "???"}</p>
            </>
          ) : (
            <>
              <p className={styles.robotCoordinates}>X: -16.633, Y: -73.894</p>
              <p className={styles.robotId}>ID: {robotIDs[selectedRobot] || "???"}</p>
            </>
          )}

      </div>
    </div>

      {/* Horizontal Bar Charts */}
      <div className={styles.barCharts}>
        {barData.map((item, index) => (
          <div key={index} className={styles.barChart}>
            <span className={styles.chartLabel}>
              {item.name === "Signal" && <FaWifi />}
              {item.name === "Battery" && <FaBatteryFull />}
              {item.name === "Garbage" && <FaTrash />}
              {item.name}
            </span>
            <div className={styles.barContainer}>
            <div
              className={styles.barFill}
              style={{
                width: `${selectedRobot === "Robot Alpha" ? item.value : 0}%`,
                backgroundColor:
                  selectedRobot === "Robot Alpha"
                    ? (item.name === "Signal"
                        ? "#4caf50"
                        : item.name === "Battery"
                        ? "#2196f3"
                        : "#ff9800")
                    : "#888", // gray color for disconnected bars
              }}
            ></div>
          </div>
          </div>
        ))}
      </div>

      {/* Weather and Date Data */}
      <div className={styles.weatherInfo}>
        {selectedRobot !== "Robot Alpha" ? (
          <>
            <p className={styles.weatherInfoText}>🌡 Temperature: Disconnected</p>
            <p>🛰️ Weather: Disconnected</p>
            <p>⏰ Disconnected</p>
          </>
        ) : error ? (
          <p>{error}</p>
        ) : weather ? (
          <>
            <p className={styles.weatherInfoText}>
              🌡 Temperature: {weather.temperature_2m}°F
            </p>
            {/* <p>💨 Wind Speed: {weather.wind_speed_10m} km/h</p> */}
            {/* <p>🌧 Precipitation: {weather.precipitation} mm</p> */}
            {/* <p>☁️ Cloud Cover: {weather.cloud_cover}%</p> */}
            <p>
              🛰️ Weather:{" "}
              {weather.weather_code !== undefined
                ? getWeatherDescription(weather.weather_code)
                : "Unknown"}
            </p>
            <p>
              ⏰ {formatDate(dateTime)} | {formatTime(dateTime)}
            </p>
          </>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
}

export default StatusPanel;
