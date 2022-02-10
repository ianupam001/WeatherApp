const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItems = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTemp = document.getElementById("current-temp");

const days = ["Sunday", "Monday", "Tuesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const apiKey = "bb03fd459c5fbb1f91e3c2be93e2d906";

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12Hrs = hour >= 12 ? hour % 12 : hour;
    const minute = time.getMinutes();
    const amPm = hour >= 12 ? "PM" : "AM";
    timeEl.innerHTML = (hoursIn12Hrs < 10 ? '0'+hoursIn12Hrs:hoursIn12Hrs) + ":" + (minute <10 ?'0'+ minute:minute) + " " + `<span>${amPm}</span>`;
    dateEl.innerHTML = days[day] + ',' + date + ' ' + months[month];

}, 100
);
getWeatherData();
function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);
        let { latitude, longitude } = success.coords;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${apiKey}`)
            .then(res => res.json())
            .then((data) => (showWeatherData(data)));
    });
}
let showWeatherData = (data) => {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    timezone.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + " IN " + data.lon + "E";
    currentWeatherItems.innerHTML = `
    <div class="weather-item">
                        <div>Humidity</div>
                        <div id="humidity">${humidity}</div>
                    </div>
                    <div class="weather-item">
                        <div id="pressure">Pressure</div>
                        <div>${pressure}</div>
                    </div>
                    <div class="weather-item">
                        <div>Wind Speed</div>
                        <div id="wind-speed">${wind_speed}</div>
                    </div>
                    <div class="weather-item">
                        <div>Sunrise</div>
                        <div id="wind-speed">${window.moment(sunrise * 1000).format("HH:mm a")}</div>
                    </div>
                    <div class="weather-item">
                        <div>Sunset</div>
                        <div id="wind-speed">${window.moment(sunset * 1000).format("HH:mm a")}</div>
                    </div>
    `
    let otherDayForcast = " "
    data.daily.forEach((day, idx) => {
        if (idx === 0) {
            currentTemp.innerHTML =
                `
             <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon" />
            <div class="others">
                <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                <div class="temp">Night: ${day.temp.night}&#176;C</div>
                <div class="temp">Day: ${day.temp.day}&#176;C</div>
            `
        } else {
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt * 1000).format("ddd")}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="" class="w-icon" />
                <div class="temp">Night: ${day.temp.night}&#176; C</div>
                <div class="temp">Day: ${day.temp.day}&#176; C</div>
            </div>`
        }
    })
    weatherForecastEl.innerHTML = otherDayForcast;
}
