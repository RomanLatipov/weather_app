async function findCity(location) {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=b206d80c92d9a53cdc890c68d85f783e`;
    let reponse = await fetch(apiUrl);
    let data = await reponse.json();
    // console.log(data);

    //Open Weather Map's json does not have information about precipitation so I had to use their xml instead 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&mode=xml&APPID=b206d80c92d9a53cdc890c68d85f783e`)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(data, "text/xml");
            const precipitationXML = xml.getElementsByTagName("precipitation")[0].getAttribute('mode');
            const precipitation = document.getElementById("precipitation");
            if ( precipitationXML === "no") {
                precipitation.textContent = 0;
            }
            else {
                precipitation.textContent = Math.round(xml.getElementsByTagName("precipitation")[0].getAttribute("value"))+" mm";
            }
        });

    //to get an hourly forecast Open Weather Map has a differnt api url that sents an array
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=b206d80c92d9a53cdc890c68d85f783e`;
    reponse = await fetch(forecastUrl);
    const next24Hours = (await reponse.json()).list.slice(0, 8);

    displayWeather(data);
    displayForecast(next24Hours);
}
function displayWeather(city) {
    let time = (city.dt >= city.sys.sunrise && city.dt < city.sys.sunset) ? "day" : "night";

    document.getElementById("city").textContent = city.name;

    const temp = document.getElementById("temp");
    temp.setAttribute("class", "f");
    temp.textContent = ((city.main.temp-273)*(9/5)+32).toFixed(0)+"°";

    const weather = city.weather[0].main.toLowerCase();
    const icon = document.getElementById("weather-icon");
    if (weather === "clear")
        icon.src = `./assets/${(weather)}-${time}.svg`;
    else
        icon.src = `./assets/${(weather)}.svg`;

    document.getElementById("type").textContent = city.weather[0].description.charAt(0).toUpperCase()+city.weather[0].description.slice(1);
    document.getElementById("humidity").textContent = city.main.humidity+"%";
    document.getElementById("wind").textContent = Math.round(city.wind.speed)+" mph";

    const background = document.getElementById("card");
        if (weather === "clear")
            background.style.backgroundImage = `url(./assets/background/${city.weather[0].main}-${time}.jpeg)`;
        else
            background.style.backgroundImage = `url(./assets/background/${city.weather[0].main}.jpeg)`;
    document.getElementById('inputField').value = "";

}
function displayForecast(next24Hours) {
    document.querySelector(".hourly-forecast").innerHTML = "";

    next24Hours.forEach(element => {
        const time = (parseInt(element.dt_txt.slice(-8, -6)) >= 9 && parseInt(element.dt_txt.slice(-8, -6)) < 23) ? "day" : "night";
        const hour = timeConverter(parseInt(element.dt_txt.slice(-8, -6)));

        const temperature = Math.round((element.main.temp-273)*(9/5)+32);
        const weather = element.weather[0].main.toLowerCase();
        let icon;
        if (weather === "clear")
            icon = `${weather}-${time}`;
        else
            icon = `${weather}`;
        const hourlyItemHtml = `
            <div class="hourly-item">
                <img src="./assets/${icon}.svg">
                <span style="font-size: 25px;">${temperature}°</span>
                <span>${hour}</span>
            </div>`;
        document.querySelector(".hourly-forecast").innerHTML += hourlyItemHtml;
    })
    function timeConverter(hour) {
        // const time = (hour > 12) ? `${hour-12}:00 PM` : `${hour}:00 AM`;
        const time = (hour > 12) ? `${hour-12}:00 PM` : ((hour === 0) ? `12:00 AM` : `${hour}:00 AM`);
        return time;
    }
}
const eventListeners = () => {
    const input = document.getElementById("inputField");
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.querySelector("button").click();
        }            
    });
    const tempSwitch = document.getElementById("temp");
    tempSwitch.addEventListener("click", event => {
        const temp = tempSwitch.innerHTML;
        if (event.target.className === "f") {
            tempSwitch.textContent = Math.round((parseInt(temp.slice(0, temp.length-1))-32)*(5/9))+"°";            
            tempSwitch.setAttribute("class", "c");
        }
        else {
            tempSwitch.textContent = Math.round((parseInt(temp.slice(0, temp.length-1))*(9/5)+32))+"°";
            tempSwitch.setAttribute("class", "f");
        }
    })
}