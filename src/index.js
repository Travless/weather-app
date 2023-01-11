import { min } from 'lodash';
import './style.css';

const zip = document.getElementById('zip');
const submit = document.getElementById('submit');

// fetch('https://api.openweathermap.org/data/2.5/weather?q=Pittsburgh&appid=b7f1fbb932658e619437fbf70e6e972a', {
//     method: 'GET'
// })
//     .then(res => {
//         if (res.ok) {
//             console.log('SUCCESS')
//         } else {
//             console.log('NOT SUCCESSFUL')
//         }
//     })
//     .then(data => console.log(data))
//     .catch(error => console.log('ERROR'))
   
async function weatherData(){
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip.value}&appid=b7f1fbb932658e619437fbf70e6e972a`);
        const data = await res.json();
        const overall = await data.weather[0].id;
        const currentTemp = await data.main.temp;
        const currentC = await currentTemp - 273;
        const currentF = await Math.floor(currentC * (9/5) + 32);
        const highTemp = await data.main.temp_max;
        const lowTemp = await data.main.temp_min;
        console.log(currentF);
    } catch (err) {
        console.log('Error!')
        console.log(err);
    }
};


submit.addEventListener('click', e => {
    weatherData();
})