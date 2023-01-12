import { forEach, min } from 'lodash';
// import './style.css';

const zip = document.getElementById('zip');
const submit = document.getElementById('submit');
const infoCont = document.getElementById('info-cont');
// let weatherInfo = [];
const cityName = document.getElementById('city-name');
const weatherCond = document.getElementById('weather-cond');
const currentTempF = document.getElementById('current-temp-f');
const currentTempC = document.getElementById('current-temp-c');
const highLowF = document.getElementById('high-low-f-cont');
const highLowC = document.getElementById('high-low-c-cont');
const highF = document.getElementById('high-f')
const lowF = document.getElementById('low-f');
const highC = document.getElementById('high-c');
const lowC = document.getElementById('low-c');




async function currentWeatherData(){
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip.value}&appid=b7f1fbb932658e619437fbf70e6e972a`);
        const data = await res.json();
        const overall = await data.weather[0].id;
        const currentTemp = await data.main.temp;
        const currentC = await currentTemp - 273;
        const currentF = await Math.floor(currentC * (9/5) + 32);
        const highTempC = await data.main.temp_max - 273;
        const lowTempC = await data.main.temp_min -273;
        const highTempF = await Math.floor(highTempC * (9/5) + 32);
        const lowTempF = await Math.floor(lowTempC * (9/5) + 32);
        cityName.textContent = `${data.name}`;
        await fetchWeatherImg(overall);
        currentTempF.textContent = `${currentF}°F`;
        currentTempC.textContent = `${currentC}°C`;
        highF.textContent = `H:${highTempF}°`;
        lowF.textContent = `L:${lowTempF}°`;
        highC.textContent = `H:${highTempC}°`;
        lowC.textContent = `L:${lowTempC}°`;
        console.log(data);
        // console.log(currentF);
        // await weatherInfo.push(data);
        // console.log(weatherInfo);
    } catch (err) {
        console.log('Error!')
        console.log(err);
    }
};

async function futureForecastData () {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip.value}&appid=b7f1fbb932658e619437fbf70e6e972a`);
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.log('Error!');
        console.error(err);
    }
}

async function forecastDayGen (days) {
    try {
        days.forEach(async (day) => {
            const dayCont = document.createElement('div').classList.add('class-cont');
            const fiveDayCond = document.createElement('img').classList.add('5-day-cond');
            fiveDayCond.
        })
    } catch (err) {
        console.log('Error!');
        console.error(err);
    }
}

async function fetchWeatherImg (id) {
    try {
        if (id >= 200 && id < 300) {
            const thunder = await fetch('../src/img/thunderstorm.png');
            const blob = await thunder.blob();
            weatherCond.src = URL.createObjectURL(blob);
        } else if (id >= 300 && id < 600) {
            const rainy = await fetch('../src/img/rainy.png');
            const blob = await rainy.blob();
            weatherCond.src = URL.createObjectURL(blob);
        } else if (id >= 600 && id < 700) {
            const snowing = await fetch('../src/img/snowing.png');
            const blob = await snowing.blob();
            weatherCond.src = URL.createObjectURL(blob);
        } else if (id >= 700 && id < 800) {
            const warning = await fetch('../src/img/warning.png');
            const blob = await warning.blob();
            weatherCond.src = URL.createObjectURL(blob);
        } else if (id === 800) {
            const sunny = await fetch('../src/img/sunny-day.png');
            const blob = await sunny.blob();
            weatherCond.src = URL.createObjectURL(blob);
        } else {
            const clouds = await fetch('../src/img/cloud.png');
            const blob = await clouds.blob();
            weatherCond.src = URL.createObjectURL(blob);
        }
    } catch (err) {
        console.log('Error!');
        console.error(err);
    }
}


submit.addEventListener('click', e => {
    infoCont.hidden = false;
    const current = currentWeatherData();
    const future = futureForecastData();
})