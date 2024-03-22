async function findCity(location) {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=b206d80c92d9a53cdc890c68d85f783e`;
    let reponse = await fetch(apiUrl);
    let data = await reponse.json();
    // console.log(data);
    
    // const time = (data.dt >= data.sys.sunrise && data.dt < data.sys.sunset) ? "day" : "night";
    // console.log(time);

    //Open Weather Map's json does not have information about precipitation so I had to use their xml instead 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&mode=xml&APPID=b206d80c92d9a53cdc890c68d85f783e`)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/xml");
            // console.log(doc);
            const precipitationXML = doc.getElementsByTagName("precipitation")[0].getAttribute('mode');
            const precipitation = document.getElementById("precipitation");
            if ( precipitationXML === "no") {
                precipitation.textContent = 0;
            }
            else {
                precipitation.textContent = doc.getElementsByTagName("precipitation")[0].getAttribute("value")+" mm";
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
    document.getElementById("city").textContent = city.name;
    const temp = document.getElementById("temp");
    temp.textContent = ((city.main.temp-273)*(9/5)+32).toFixed(0)+"°";
    temp.setAttribute("class", "f");
    document.getElementById("weather-icon").src = `./assets/${(city.weather[0].main).toLowerCase()}.svg`;
    document.getElementById("type").textContent = city.weather[0].description.charAt(0).toUpperCase()+city.weather[0].description.slice(1);
    document.getElementById("humidity").textContent = city.main.humidity+"%";
    document.getElementById("wind").textContent = city.wind.speed+" mph";
    document.getElementById("card").style.backgroundImage = `url(./assets/background/${city.weather[0].main}.jpeg)`;
    document.getElementById('inputField').value = "";

}
function displayForecast(next24Hours) {
    document.querySelector(".hourly-forecast").innerHTML = "";

    for (let i = 0; i<8; i++) {
        const hour = timeConverter(new Date(next24Hours[i].dt * 1000).getHours());
        const temperature = Math.round((next24Hours[i].main.temp-273)*(9/5)+32);

        const hourlyItemHtml = `
            <div class="hourly-item">
                <img src="./assets/${(next24Hours[i].weather[0].main).toLowerCase()}.svg">
                <span style="font-size: 25px;">${temperature}°</span>
                <span>${hour}</span>
            </div>`;
        document.querySelector(".hourly-forecast").innerHTML += hourlyItemHtml;
    }
    function timeConverter(hour) {
        let time = (hour >= 12) ? `${hour-12}:00 PM` : `${hour}:00 AM`;
        return time;
    }

}
function eventListeners() {
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
        // console.log(event.target.className);
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