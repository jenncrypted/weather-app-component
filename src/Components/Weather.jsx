import { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloudy.png";
import drizzle_icon from "../assets/drizzle.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";
import humidity_icon from "../assets/humidity.png";
import Alert from "@mui/material/Alert";

export default function Weather() {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(false);
    const [error, setError] = useState(false);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const getConditionMessage = (condition) => {
        switch (condition.toLowerCase()) {
            case "clear":
                return "It's sunny";
            case "clouds":
                return "It's cloudy";
            case "rain":
                return "It's rainy";
            case "drizzle":
                return "It's drizzling";
            case "snow":
                return "It's snowing";
            case "thunderstorm":
                return "There is a thunderstorm";
            case "mist":
            case "fog":
                return "It's foggy";
            default:
                return `The weather is ${condition.toLowerCase()}`;
        }
    };

    const search = async (city) => {
        if (city === "") {
            setError({ msg: "Must enter city name" });
            // alert("Enter city Name");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
                import.meta.env.VITE_APP_ID
            }`;

            const response = await fetch(url);
            const data = await response.json();

            //if(response.ok) {
            //alert(data.message);
            //return;
            //}

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon,
                condition: data.weather[0].main,
            });
            setError(false);
        } catch (err) {
            console.log({ err });
            setError({ msg: "City not found" });
        }
    };

    useEffect(() => {
        search("New York");
    }, []);

    return (
        <div className="error-boundary">
            {error ? (
                <Alert className="error" severity="error">
                    {" "}
                    {error.msg}{" "}
                </Alert>
            ) : (
                <div></div>
            )}
            <div className="weather">
                <div className="search-bar">
                    <input ref={inputRef} type="text" placeholder="Search" />
                    <img
                        src={search_icon}
                        alt=""
                        onClick={() => search(inputRef.current.value)}
                    />
                </div>
                {weatherData ? (
                    <>
                        <img
                            src={weatherData.icon}
                            alt=""
                            className="weather-icon"
                        />
                        <p className="temperature">
                            {weatherData.temperature}°c
                        </p>
                        <p className="location">{weatherData.location}</p>
                        <p className="condition-message">
                            {getConditionMessage(weatherData.condition)}
                        </p>
                        <div className="weather-data">
                            <div className="col">
                                <img src={humidity_icon} alt="" />
                                <div>
                                    <p>{weatherData.humidity}</p>
                                    <span>Humidity</span>
                                </div>
                            </div>
                            <div className="col">
                                <img src={wind_icon} alt="" />
                                <div>
                                    <p>{weatherData.windSpeed} Km/h</p>
                                    <span>Wind Speed</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
