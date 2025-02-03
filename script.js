const API_KEY = "472d0e6a32358a4b72ec6f4a0ba752a8";

const countries = [
    "United States", "Canada", "United Kingdom", "India", "Australia",
    "Germany", "France", "Italy", "Spain", "China", "Japan", "Russia",
    "Brazil", "Mexico", "South Africa", "Argentina", "Nigeria", "Pakistan",
    "Bangladesh", "Indonesia", "Egypt", "Turkey", "Vietnam", "Thailand","India"
];

async function getWeather() {
    const cityInput = document.getElementById("city");
    const city = cityInput.value.trim();

    if (countries.includes(city)) {
        alert("No weather when entered country");
        return;
    }

    try {
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const currentData = await currentResponse.json();

        if (currentData.cod === "404") {
            alert("City not found. Please try again.");
            return;
        }

        document.querySelector(".weather-temp").textContent =
            Math.round(currentData.main.temp) + "°C";
        document.querySelector(".weather-desc").textContent =
            currentData.weather[0].description;
        document.querySelector(".humidity").textContent =
            currentData.main.humidity + "%";
        document.querySelector(".wind").textContent =
            currentData.wind.speed + " m/s";
        document.querySelector(".weather-location span").textContent = 
           `${currentData.name}, ${currentData.sys.country}`;
        

        cityInput.value = "";

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        let dailyTemps = {};

        forecastData.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
            const temp = item.main.temp;

            if (!dailyTemps[dayName] || temp > dailyTemps[dayName]) {
                dailyTemps[dayName] = temp; 
            }
        });

        const forecastDays = document.querySelectorAll(".day-forecast");
        let i = 0;
        for (const [day, maxTemp] of Object.entries(dailyTemps)) {
            if (i < forecastDays.length) {
                forecastDays[i].querySelector("div:nth-child(1)").textContent = day;
                forecastDays[i].querySelector("div:nth-child(2)").textContent =
                    `${Math.round(maxTemp)}°C`; 
                i++;
            }
        }

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}
