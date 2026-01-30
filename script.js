const apiKey = "3aa867482782167072ed1ac4259887ab";

const input = document.querySelector(".search-box input");
const button = document.querySelector(".search-box button");
const weatherCard = document.querySelector(".weather-card");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearHistory");

const cityName = weatherCard.querySelector("h2");
const temperature = weatherCard.querySelector(".temperature");
const condition = weatherCard.querySelector("p:nth-of-type(2)");
const humidity = weatherCard.querySelector(".details p:nth-child(1)");
const wind = weatherCard.querySelector(".details p:nth-child(2)");

weatherCard.style.display = "none";

let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
renderHistory();

button.addEventListener("click", () => fetchWeather());
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fetchWeather();
});

async function fetchWeather(cityFromHistory = null) {
    const city = cityFromHistory || input.value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (response.status === 404) {
            throw new Error("City not found");
        }

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const data = await response.json();
        updateUI(data);
        saveHistory(data.name);

    } catch (error) {
        alert(error.message);
        weatherCard.style.display = "none";
    }
}

function updateUI(data) {
    cityName.innerText = data.name;
    temperature.innerText = `${Math.round(data.main.temp)} °C`;
    condition.innerText = data.weather[0].main;
    humidity.innerText = `Humidity: ${data.main.humidity}%`;
    wind.innerText = `Wind: ${data.wind.speed} km/h`;
    document.getElementById("weatherIcon").src =
`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherCard.style.display = "block";
}

function saveHistory(city) {
    if (!history.includes(city)) {
        history.unshift(city);
        if (history.length > 5) history.pop();
        localStorage.setItem("weatherHistory", JSON.stringify(history));
        renderHistory();
    }
}

function renderHistory() {
    historyList.innerHTML = "";
    history.forEach(city => {
        const li = document.createElement("li");
        li.innerText = city;
        li.onclick = () => fetchWeather(city);
        historyList.appendChild(li);
    });
}

clearBtn.addEventListener("click", () => {
    history = [];
    localStorage.removeItem("weatherHistory");
    renderHistory();
});
