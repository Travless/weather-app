import { forEach, min } from 'lodash';
// import './style.css';


// Element Methods
const landingPage = document.getElementById('landing-page');
const zip = document.getElementById('zip');
const search = document.getElementById('search');
let unitChange = document.getElementById('unit-change');
const pageCont = document.getElementById('page-cont');
const info = document.getElementById('info');
const weatherDesc = document.getElementById('weather-desc');
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
const panels = document.getElementById('panels');

const hourlyTempsC = document.getElementsByClassName('current-day-hourly-c');
const hourlyTempsF = document.getElementsByClassName('current-day-hourly-f');
let currentDayHours = [];
let weatherID = '';
unitChange.textContent = 'Display °C';


// Landing Page Initial Load
async function landingPageLoad() {
    document.body.style.backgroundImage = await 'url("landing-page.jpg")';
    const landingPageTextCont = await document.createElement('div');
    landingPageTextCont.classList.add('landing-text-cont');
    await landingPage.append(landingPageTextCont);
    const landingPageImg = await document.createElement('img');
    landingPageImg.classList.add('landing-img');
    const logoImg = await fetch('logo.png');
    const blob = await logoImg.blob();
    landingPageImg.src = URL.createObjectURL(blob);
    landingPageTextCont.append(landingPageImg);
    const landingTitle = document.createElement('div');
    landingTitle.classList.add('landing-title');
    landingTitle.textContent = 'Current Weather Conditions With One Click';
    landingPageTextCont.append(landingTitle);
    const landingZip = document.createElement('div');
    landingZip.classList.add('landing-zip');
    landingZip.textContent = 'Enter a valid US zip code above to receive an up-to-date weather forecast in that area.';
    landingPageTextCont.append(landingZip);
}

// API Request for Current Weather Data
async function currentWeatherData(){
   try {
       const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip.value}&appid=b7f1fbb932658e619437fbf70e6e972a`);
       const data = await res.json();
       const overall = await data.weather[0].id;
 
       const currentTemp = await data.main.temp;
       const currentC = await Math.floor(currentTemp - 273);
       const currentF = await Math.floor(currentC * (9/5) + 32);
       const formattedWeatherDesc = uppercaseFirstLetter(data.weather[0].description)
 
       const highTempC = await Math.floor(data.main.temp_max - 273);
       const lowTempC = await Math.floor(data.main.temp_min -273);
       const highTempF = await Math.floor(highTempC * (9/5) + 32);
       const lowTempF = await Math.floor(lowTempC * (9/5) + 32);
 
 
       cityName.textContent = `${data.name}`;
       fetchWeatherBackground(overall, pageCont);
       fetchWeatherImg(overall, weatherCond);
       panelOne.innerHTML = '';
       panelTwo.innerHTML = '';
       await additionalInfoPanels(data);
       weatherDesc.textContent = `${formattedWeatherDesc}`;
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
 
// API Request for 3 Hour Interval Forecast
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
 
// DOM Element Generation for 3 Hour Interval Forecast
async function dayElementGen (array, i) {

    // Current Day Hourly Container
    const dayCont = document.createElement('div');
    dayCont.setAttribute('id', `day-cont-${i}`);
    dayCont.classList.add('current-day-cont');
    currentDayHourlyCont.append(dayCont);

    const currentDayTime = document.createElement('div');
    currentDayTime.classList.add('current-day-time');
    dayCont.append(currentDayTime);
    currentDayTime.setAttribute('id', `current-day-time-${i}`);
    let dt = new Date(array[i].dt * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    currentDayTime.textContent = `${dt}`;
    // currentDayTime.textContent = `${array[i].dt_txt}`;

    const currentDayHourly = document.createElement('div');
    currentDayHourly.classList.add('current-day-temp-cond-cont');
    dayCont.append(currentDayHourly);
    currentDayHourly.setAttribute('id', `current-day-temp-cond-cont-${i}`);

    // Current Day Hourly Condition Img
    const currentDayHourlyCond = document.createElement('img');
    currentDayHourlyCond.classList.add('current-day-hourly-cond');
    currentDayHourly.append(currentDayHourlyCond);
    currentDayHourlyCond.setAttribute('id', `current-day-hourly-cond-${i}`);
    weatherID = array[i].weather[0].id;
    console.log(weatherID);
    fetchWeatherImg(weatherID, currentDayHourlyCond);

    // Current Day Hourly Temp Cont
    const currentDayHourlyTempCont = document.createElement('div');
    currentDayHourlyTempCont.classList.add('current-day-hourly-temp-cont');
    currentDayHourlyTempCont.setAttribute('id', `current-day-hourly-temp-cont-${i}`);
    currentDayHourly.append(currentDayHourlyTempCont);

    // Current Day Hourly Temp (F)
    const currentDayHourlyF = document.createElement('div');
    currentDayHourlyF.classList.add('current-day-hourly-f');
    currentDayHourlyTempCont.append(currentDayHourlyF);
    currentDayHourlyF.setAttribute('id', `current-day-hourly-f-${i}`)
    const tempConversionF = Math.floor((9 / 5) * ((array[i].main.temp) - 273) + 32);
    currentDayHourlyF.textContent = `${tempConversionF}°F`;

    // Current Day Hourly Temp (C)
    const currentDayHourlyC = document.createElement('div');
    currentDayHourlyC.classList.add('current-day-hourly-c');
    currentDayHourlyTempCont.append(currentDayHourlyC);
    currentDayHourlyC.setAttribute('id', `current-day-hourly-c-${i}`);
    const tempConversionC = Math.floor(array[i].main.temp - 273.15);
    currentDayHourlyC.textContent = `${tempConversionC}°C`;
    currentDayHourlyC.hidden = true;

   return dayCont;
}

// DOM Element Generation for Additional Info Panels
async function additionalInfoPanels (data) {
 
   // Sunrise
   const sunRiseCont = document.createElement('div');
   sunRiseCont.classList.add('sun-rise-cont');
   panelOne.append(sunRiseCont);
 
   const sunRiseTitle = document.createElement('div');
   sunRiseTitle.classList.add('sun-rise-title');
   sunRiseTitle.textContent = 'Sunrise';
   sunRiseCont.append(sunRiseTitle);
 
   const sunRiseTime = document.createElement('div');
   sunRiseTime.classList.add('sun-rise-time');
   sunRiseTime.setAttribute('id', 'sun-rise-time');
   const sunRise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
   sunRiseTime.textContent = `${sunRise}`;
   sunRiseCont.append(sunRiseTime);
 
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
 
 
   // Sunset
   const sunSetCont = document.createElement('div');
   sunSetCont.classList.add('sun-set-cont');
   panelTwo.append(sunSetCont);
 
   const sunSetTitle = document.createElement('div');
   sunSetTitle.classList.add('sun-set-title');
   sunSetTitle.textContent = 'Sunset';
   sunSetCont.append(sunSetTitle);
 
   const sunSetTime = document.createElement('div');
   sunSetTime.classList.add('sun-set-time');
   const sunSet = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
   sunSetTime.textContent = `${sunSet}`;
   sunSetCont.append(sunSetTime);
 
 
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

// Fetch Request for Weather Condition Icon
async function fetchWeatherImg (id, data) {
   try {
       if (id >= 200 && id < 300) {
           const thunder = await fetch('thunderstorm.png');
           const blob = await thunder.blob();
           data.src = URL.createObjectURL(blob);
       } else if (id >= 300 && id < 600) {
           const rainy = await fetch('rainy.png');
           const blob = await rainy.blob();
           data.src = URL.createObjectURL(blob);
       } else if (id >= 600 && id < 700) {
           const snowing = await fetch('snowing.png');
           const blob = await snowing.blob();
           data.src = URL.createObjectURL(blob);
       } else if (id >= 700 && id < 800) {
           const warning = await fetch('warning.png');
           const blob = await warning.blob();
           data.src = URL.createObjectURL(blob);
       } else if (id === 800) {
           const sunny = await fetch('sunny-day.png');
           const blob = await sunny.blob();
           data.src = URL.createObjectURL(blob);
       } else {
           const clouds = await fetch('cloud.png');
           const blob = await clouds.blob();
           data.src = URL.createObjectURL(blob);
       }
   } catch (err) {
       console.log('Error!');
       console.error(err);
   }
}

// Fetch Request for Weather Condition Background
async function fetchWeatherBackground (id){
    try{
        if (id >= 200 && id < 300) {
            document.body.style.backgroundImage = "url('thunder.jpg')";
            document.body.style.backgroundSize = 'cover';
        } else if (id >= 300 && id < 600) {
            document.body.style.backgroundImage = "url('rainy.jpg')";
            document.body.style.backgroundSize = 'cover';
        } else if (id >= 600 && id < 700) {
            document.body.style.backgroundImage = "url('snowy.jpg')";
            document.body.style.backgroundSize = 'cover';
        } else if (id >= 700 && id < 800) {
            document.body.style.backgroundImage = "url('fog.jpg')";
            document.body.style.backgroundSize = 'cover';
        } else if (id === 800) {
            document.body.style.backgroundImage = await "url('sunny.jpeg')";
            document.body.style.backgroundSize = 'cover';
        } else {
            document.body.style.backgroundImage = await "url('cloudy.jpeg')";
            document.body.style.backgroundSize = 'cover';
        }
    } catch (err) {
        console.log('Error!');
        console.error(err);
    }
}

// Function That Converts the First Letter of Each Word of a Given String To Uppercase
function uppercaseFirstLetter(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
 
 
search.addEventListener('click', e => {
    landingPage.innerHTML = '';
    currentDayHourlyCont.innerHTML = '';
    currentDayHours = [];
    info.hidden = false;
    currentDayHourlyCont.hidden = false;
    panels.hidden = false;
    const current = currentWeatherData();
    const future = forecastGen();
})

unitChange.addEventListener('click', e => {
    if(unitChange.textContent === 'Display °C'){
        unitChange.textContent = 'Display °F'
        for(let i = 0; i < hourlyTempsC.length; i++) {
            hourlyTempsC[i].hidden = false;
            hourlyTempsF[i].hidden = true;
        }

        currentTempC.hidden = false;
        currentTempF.hidden = true;

        highLowC.hidden = false;
        highLowF.hidden = true;
    } else if (unitChange.textContent === 'Display °F'){
        unitChange.textContent = 'Display °C'
        for(let i = 0; i < hourlyTempsC.length; i++) {
            hourlyTempsC[i].hidden = true;
            hourlyTempsF[i].hidden = false;
        }

        currentTempC.hidden = true;
        currentTempF.hidden = false;

        highLowC.hidden = true;
        highLowF.hidden = false;
    }
})

landingPageLoad();