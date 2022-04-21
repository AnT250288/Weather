const getWeather = (lat, lng) => {
    const key = ' ';
    //46dd5d64475395cddf2c14320731c2e9
    const baseURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon${lng}&appid=${key}&units=metric&lang=ru`
    fetch(baseURL)
        .then((res) => res.json())
        //.then((json) => console.log(json))
        .then((json) => {
            for (let i = 0; i < 5; i++) {
                document.querySelector(`#weather${i + 1}`).innerHTML = `Погода:  ${Math.round(json.daily[i].temp.day)}`;
                document.querySelector(`#humidity${i + 1}`).innerText = `Влажность: ${json.daily[i].humidity}`;
                document.querySelector(`#clouds${i + 1}`).innerText = `Облачность: ${json.daily[i].clouds}%`;
                document.querySelector(`#weather_icon${i + 1}`).setAttribute("src", `https://openweathermap.org/img/wn/${json.daily[i].weather[0].icon}@2x.png`);
            }
        })
}



const baseUrl = 'https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json'
const region = document.querySelector('#region')
const city = document.querySelector('#city');

function getCity() {

    fetch(baseUrl)
        .then(response => response.json())
        //.then((json) => console.log(json[0].regions))
        .then((json) => {
            let data = json[0].regions
            console.log(data)
            region.innerHTML = data.map(el => `<option value="${el.name}">${el.name}</option>`).join('')
            region.addEventListener('change', function () {
                city.innerHTML = data
                    .find(el => el.name === this.value)
                    .cities.map(el => `<option value="${el.name}">${el.name}</option>`)
                    .join('')
            })
            city.addEventListener('click', function () {
                const regionName = region.value;
                const cityName = this.value;
                const {lat, lng} = region[regionName].find(el => el.name === cityName)
                getWeather(lat, lng)
            })
            console.log(data[1].cities[1].lat)
            console.log(data[1].cities[1].lng)
        })

}

getCity()



function turnDate(uniTime) {
    const myDate = new Date(uniTime * 1000);
    return myDate.toGMTString();
}

function turnToCels(temp) {
    const cels = (temp - 273.15).toFixed(1);
    return cels;
}

async function get5DaysWeatherForecast(lat, lng) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&exclude=alerts,&appid=c2a4d3c2abd98c7796b91be50e976075`);

    if (response.ok) {
        const forecast = await response.json();

        for (let i = 0; i < 5; i++) {
            const { temp, dt } = forecast.daily[i];
            const { min, max } = temp;
            const readyForecast = turnDate(dt) + ': ' + turnToCels(min) + '-' + turnToCels(max) + '°C';
            document.getElementById(`weath${i}`).innerHTML = readyForecast;
        }
    } else {
        alert('error', response.status);
    }
}


async function getData() {
    const response = await fetch('https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json');

    if (response.ok) {
        const data = await response.json();
        const regions = {}

        data[0].regions.forEach(({ name, cities }) => regions[name] = cities)

        const area = document.querySelector('#area');
        const city = document.querySelector('#city');

        area.innerHTML = Object.keys(regions).map(regionName => `<option value="${regionName}">${regionName}</option>`).join('');

        area.addEventListener('change', function () {
            city.innerHTML = regions[this.value]
                .map(city => `<option value="${city.name}">${city.name}</option>`)
                .join('');
        });

        city.addEventListener('click', function () {
            const regionName = area.value;
            const cityName = this.value;

            const { lat, lng } = regions[regionName].find(city => city.name === cityName)
            get5DaysWeatherForecast(lat, lng);
        });

    } else {
        alert('error', response.status);
    }
}

getData();

