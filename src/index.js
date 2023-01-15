import { forEach, min } from 'lodash';
// import './style.css';
 
const zip = document.getElementById('zip');
const submit = document.getElementById('submit');
const weatherCont = document.getElementById('weather-cont');
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
const currentDayHourlyCont = document.getElementById('current-day-hourly-cont');
const panelOne = document.getElementById('panel-1');
const panelTwo = document.getElementById('panel-2');
const panelsCont = document.getElementById('panels-cont');
 
let currentDayHours = [];
 
 
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
       await fetchWeatherBackground(overall, weatherCont);
       await fetchWeatherImg(overall, weatherCond);
       await additionalInfoPanels(data);
       currentTempF.textContent = `${currentF}°F`;
       currentTempC.textContent = `${currentC}°C`;
       highF.textContent = `H:${highTempF}°`;
       lowF.textContent = `L:${lowTempF}°`;
       highC.textContent = `H:${highTempC}°`;
       lowC.textContent = `L:${lowTempC}°`;
   } catch (err) {
       console.log('Error!')
       console.log(err);
   }
};
 
async function forecastGen () {
   try {
       const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip.value}&cnt=8&appid=b7f1fbb932658e619437fbf70e6e972a`);
       const data = await res.json();
       for (let i = 0; i < 8; i++){
           await currentDayHours.push(data.list[i]);
           await dayElementGen(currentDayHours, i);
       }
       await console.log(currentDayHours);
   } catch (err) {
       console.log('Error!');
       console.error(err);
   }
}
 
function dayElementGen (array, i) {
   // Current Day Hourly Container
   const dayCont = document.createElement('div');
   dayCont.setAttribute('id', `day-cont-${i}`);
   dayCont.classList.add('class-cont');
   currentDayHourlyCont.append(dayCont);
 
   const currentDayTime = document.createElement('div');
   currentDayTime.classList.add('current-day-time');
   dayCont.append(currentDayTime);
   currentDayTime.setAttribute('id', `current-day-time-${i}`);
   currentDayTime.textContent = `${array[i].dt_txt}`;
 
   const currentDayHourly = document.createElement('div');
   currentDayHourly.classList.add('current-day-hourly');
   dayCont.append(currentDayHourly);
   currentDayHourly.setAttribute('id', `current-day-hourly-${i}`);
 
   // Current Day Hourly Condition Img
   const currentDayHourlyCond = document.createElement('img');
   currentDayHourlyCond.classList.add('current-day-hourly-cond');
   currentDayHourly.append(currentDayHourlyCond);
   currentDayHourlyCond.setAttribute('id', `current-day-hourly-cond-${i}`);
   const weatherID = array[i].weather.id;
   fetchWeatherImg(weatherID, currentDayHourlyCond);
 
   // Current Day Hourly Temp (F)
   const currentDayHourlyF = document.createElement('div');
   currentDayHourlyF.classList.add('current-day-hourly-f');
   currentDayHourly.append(currentDayHourlyF);
   currentDayHourlyF.setAttribute('id', `current-day-hourly-f-${i}`)
   const tempConversionF = Math.floor(9 / 5 * ((array[i].main.temp) - 273) + 32);
   currentDayHourlyF.textContent = `${tempConversionF}`;
 
   // Current Day Hourly Temp (C)
   const currentDayHourlyC = document.createElement('div');
   currentDayHourlyC.classList.add('current-day-hourly-c');
   currentDayHourly.append(currentDayHourlyC);
   currentDayHourlyC.setAttribute('id', `current-day-hourly-c-${i}`);
   const tempConversionC = Math.floor(array[i].main.temp - 273.15);
   currentDayHourlyC.textContent = `${tempConversionC}`;
  
   return dayCont;
}
 
// async function dayElementGen () {
//     try {
//         // Day Container
//         const dayCont = await document.createElement('div').classList.add('class-cont');
 
//         const currentDayTime = await document.createElement('div').classList.add('current-day-time');
//         await dayCont.append(currentDayTime);
 
//         const currentDayHourly = await document.createElement('div').classList.add('current-day-hourly');
//         await dayCont.append(currentDayHourly);
 
//         // Day Condition Img
//         const currentDayHourlyCond = await document.createElement('img').classList.add('5-day-cond');
//         await currentDayHourly.append(currentDayHourlyCond);
 
//         // Day Temp
//         const currentDayHourlyTempCont = await document.createElement('div').classList.add('5-day-temp-cont');
//         await currentDayHourly.append(currentDayHourlyTempCont);
 
//         // Day High Low (F)
//         const currentDayHourlyHighLowF = await document.createElement('div').classList.add('5-day-high-low-f');
//         await currentDayHourlyTempCont.append(currentDayHourlyHighLowF);
//         const currentDayHourlyHighF = await document.createElement('div').classList.add('5-day-high-f');
//         await currentDayHourlyHighLowF.append(currentDayHourlyHighF);
//         const currentDayHourlyLowF = await document.createElement('div').classList.add('5-day-low-f');
//         await currentDayHourlyHighLowF.append(currentDayHourlyLowF);
 
//         // Day High Low (C)
//         const currentDayHourlyHighLowC = await document.createElement('div').classList.add('5-day-high-low-c');
//         await currentDayHourlyTempCont.append(currentDayHourlyHighLowC);
//         const currentDayHourlyHighC = await document.createElement('div').classList.add('5-day-high-c');
//         await currentDayHourlyHighLowC.append(currentDayHourlyHighC);
//         const currentDayHourlyLowC = await document.createElement('div').classList.add('5-day-low-c');
//         await currentDayHourlyHighLowC.append(currentDayHourlyLowC);
 
//     } catch (err) {
//         console.log('Error!');
//         console.error(err);
//     }
// }
 
async function additionalInfoPanels (data) {
 
   // Feels Like
   const feelsLikeCont = document.createElement('div');
   feelsLikeCont.classList.add('feels-like-cont');
   panelOne.append(feelsLikeCont);
 
   const feelsLikeTitle = document.createElement('div');
   feelsLikeTitle.textContent = 'Feels Like';
   feelsLikeCont.append(feelsLikeTitle);
 
   const feelsLikeTempF = document.createElement('div');
   feelsLikeTempF.classList.add('feels-like-temp-f');
   feelsLikeTempF.textContent = Math.floor(9 / 5 * ((data.main.feels_like) - 273) + 32);
   feelsLikeCont.append(feelsLikeTempF);
 
   const feelsLikeTempC = document.createElement('div');
   feelsLikeTempC.classList.add('feels-like-temp-c');
   feelsLikeTempC.textContent = Math.floor(data.main.feels_like - 273.15);
   feelsLikeCont.append(feelsLikeTempC);
 
 
   // Humidity
   const humidityCont = document.createElement('div');
   humidityCont.classList.add('humidity-cont');
   panelOne.append(humidityCont);
 
   const humidityTitle = document.createElement('div');
   humidityTitle.classList.add('humidity-title');
   humidityTitle.textContent = 'Humidity (%)';
   humidityCont.append(humidityTitle);
 
   const humidityData = document.createElement('div');
   humidityData.classList.add('humidity-data');
   humidityData.textContent = `${data.main.humidity}%`;
   humidityCont.append(humidityData);
 
   // Wind
   const windCont = document.createElement('div');
   windCont.classList.add('wind-cont');
   panelOne.append(windCont);
 
   const windTitle = document.createElement('wind-title');
   windTitle.classList.add('wind-title');
   windTitle.textContent = 'Wind Speed';
   windCont.append(windTitle);
 
   const windData = document.createElement('wind-data');
   windData.classList.add('wind-data');
   windData.textContent = Math.floor(data.wind.speed * 2.237) + ' MPH';
   windCont.append(windData);
 
 
   // Pressure
   const pressureCont = document.createElement('div');
   pressureCont.classList.add('pressure-cont');
   panelTwo.append(pressureCont);
 
   const pressureTitle = document.createElement('div');
   pressureTitle.classList.add('pressure-title');
   pressureTitle.textContent = 'Pressure (hPa)';
   pressureCont.append(pressureTitle);
 
   const pressureData = document.createElement('div');
   pressureData.classList.add('pressure-data');
   pressureData.textContent = `${data.main.pressure} hPa`;
   pressureCont.append(pressureData);
 
 
   // Cloudiness
   const cloudinessCont = document.createElement('cloudiness-cont');
   cloudinessCont.classList.add('cloudiness-cont');
   panelTwo.append(cloudinessCont);
 
   const cloudinessTitle = document.createElement('div');
   cloudinessTitle.classList.add('cloudiness-title');
   cloudinessTitle.textContent = 'Cloudiness (%)';
   cloudinessCont.append(cloudinessTitle);
 
   const cloudinessData = document.createElement('div');
   cloudinessData.classList.add('cloudiness-data');
   cloudinessData.textContent = `${data.clouds.all}%`;
   cloudinessCont.append(cloudinessData);
 
 
   // Visibility
   const visibilityCont = document.createElement('div');
   visibilityCont.classList.add('visibility-cont');
   panelTwo.append(visibilityCont);
 
   const visibilityTitle = document.createElement('div');
   visibilityTitle.classList.add('visibility-title');
   visibilityTitle.textContent = 'Visibility (feet)';
   visibilityCont.append(visibilityTitle);
 
   const visibilityData = document.createElement('div');
   visibilityData.classList.add('visibility-data');
   visibilityData.textContent = Math.floor(data.visibility * 3.28084) + '"';
   visibilityCont.append(visibilityData);
 
}
 
async function fetchWeatherImg (id, data) {
   try {
       if (id >= 200 && id < 300) {
           const thunder = await fetch('../src/img/thunderstorm.png');
           const blob = await thunder.blob();
           data.src = URL.createObjectURL(blob);
       } else if (id >= 300 && id < 600) {
           const rainy = await fetch('../src/img/rainy.png');
           const blob = await rainy.blob();
           data.src = URL.createObjectURL(blob);
       } else if (id >= 600 && id < 700) {
           const snowing = await fetch('../src/img/snowing.png');
           const blob = await snowing.blob();
           data.src = URL.createObjectURL(blob);
       } else if (id >= 700 && id < 800) {
           const warning = await fetch('../src/img/warning.png');
           const blob = await warning.blob();
           data.src = URL.createObjectURL(blob);
       } else if (id === 800) {
           const sunny = await fetch('../src/img/sunny-day.png');
           const blob = await sunny.blob();
           data.src = URL.createObjectURL(blob);
       } else {
           const clouds = await fetch('../src/img/cloud.png');
           const blob = await clouds.blob();
           data.src = URL.createObjectURL(blob);
       }
   } catch (err) {
       console.log('Error!');
       console.error(err);
   }
}

async function fetchWeatherBackground (id, data){
    try{
        if (id >= 200 && id < 300) {
            const thunder = await fetch('../src/img/background/thunder.jpg');
            const blob = await thunder.blob();
            data.style.backgroundImage.URL = URL.createObjectURL(blob);
        } else if (id >= 300 && id < 600) {
            const rainy = await fetch('../src/img/background/rainy.jpg');
            const blob = await rainy.blob();
            data.style.backgroundImage.URL = URL.createObjectURL(blob);
        } else if (id >= 600 && id < 700) {
            const snowing = await fetch('../src/img/background/snowy.jpg');
            const blob = await snowing.blob();
            data.style.backgroundImage.URL = URL.createObjectURL(blob);
        } else if (id >= 700 && id < 800) {
            const warning = await fetch('../src/img/background/fog.jpg');
            const blob = await warning.blob();
            data.style.backgroundImage.URL = URL.createObjectURL(blob);
        } else if (id === 800) {
            const sunny = await fetch('../src/img/background/sunny.jpeg');
            const blob = await sunny.blob();
            data.style.backgroundImage.URL = URL.createObjectURL(blob);
        } else {
            data.style.backgroundImage = await "url('../src/img/background/cloudy.jpeg')";
            // const clouds = await fetch('../src/img/background/cloudy.jpeg');
            // const blob = await clouds.blob();
            // console.log(blob);
            // data.style.backgroundImage.URL = URL.createObjectURL(blob);
        }
    } catch {

    }
}
 
 
submit.addEventListener('click', e => {
   infoCont.hidden = false;
   currentDayHourlyCont.hidden = false;
   panelsCont.hidden = false;
   const current = currentWeatherData();
   const future = forecastGen();
})

