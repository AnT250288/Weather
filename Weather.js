const baseUrl = 'https://gist.githubusercontent.com/alex-oleshkevich/6946d85bf075a6049027306538629794/raw/3986e8e1ade2d4e1186f8fee719960de32ac6955/by-cities.json'
const region = document.querySelector('#region')
const city = document.querySelector('#city');
let lat = "";
let lng = "";

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
            console.log(data[1].cities[1].lat)
            console.log(data[1].cities[1].lng)
        })

}

getCity()

const key = '46dd5d64475395cddf2c14320731c2e9';
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
