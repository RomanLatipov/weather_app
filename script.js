async function findCity(location) {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=b206d80c92d9a53cdc890c68d85f783e`;
    let reponse = await fetch(apiUrl);
    let data = await reponse.json();
    // console.log(data);

    //to get an hourly forecast Open Weather Map has a differnt api url that sends an array
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=b206d80c92d9a53cdc890c68d85f783e`;
    reponse = await fetch(forecastUrl);
    const next24Hours = (await reponse.json()).list.slice(0, 8);

    displayWeather(data);
    displayForecast(next24Hours);
}
function displayWeather(city) {
    const unixTimestamp = city.dt + city.timezone;
    const dateObj = new Date(unixTimestamp * 1000);
    const utcString = dateObj.toUTCString();
    const hour = utcString.slice(-12, -10);
    const time = (hour >= 9 && hour < 23) ? "day" : "night";

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
    
    const precipitation = (city.rain === undefined) ? 0 : Math.round(city.rain["1h"]);
    
    this.arr = [city.main.humidity, precipitation, Math.round(city.wind.speed)]
    displayInfo(arr);
    
    const background = document.getElementById("card");
        if (weather === "clear")
            background.style.backgroundImage = `url(./assets/background/${city.weather[0].main}-${time}.jpeg)`;
        else
            background.style.backgroundImage = `url(./assets/background/${city.weather[0].main}.jpeg)`;
    
    document.getElementById('inputField').value = "";
}
function displayInfo(arr) {
    document.getElementById("humidity").textContent = arr[0]+"%";
    document.getElementById("precipitation").textContent = arr[1] + " mm";
    document.getElementById("wind").textContent = arr[2] +" mph";
}
function displayForecast(next24Hours) {
    document.querySelector(".hourly-forecast").innerHTML = "";
    let id = 0;
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

        const forecast = document.querySelector(".hourly-forecast");

        const div = document.createElement("div");
        div.setAttribute("class", "hourly-item");
        div.setAttribute("id", id);
        
        const img = document.createElement("img");
        img.setAttribute("id", id);
        img.src = `./assets/${icon}.svg`;

        const p1 = document.createElement("p");
        p1.textContent = `${temperature}°`;
        p1.style.fontSize = "25px";
        p1.setAttribute("id", id);

        const p2 = document.createElement("p");
        p2.textContent = `${hour}`;
        p2.setAttribute("id", id++);

        const h1 = document.createElement("h1");
        h1.style.display = "none";
        h1.textContent = element.main.humidity;

        const h2 = document.createElement("h2");
        h2.style.display = "none";
        if (element.rain === undefined) {
            h2.textContent = 0;
        }
        else {
            h2.textContent = Math.round(element.rain["3h"]);
        }

        const h3 = document.createElement("h3");
        h3.style.display = "none";
        h3.textContent = Math.round(element.wind.speed);

        forecast.append(div);
        div.append(img);
        div.append(p1);
        div.append(p2);
        div.append(h1);
        div.append(h2);
        div.append(h3);

        div.addEventListener("click", event => {
            blur(event);
        });
        div.addEventListener("mouseout", event => {
            unBlur(event);
        });
    });

    function timeConverter(hour) {
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
    });
}
function blur(event) {
    document.querySelector("#info").style.filter = "blur(3px)";
    document.querySelector("#card").style.background.filter = "blur(3px)";
    for (let i=0; i<8; i++) {
        if (i == event.target.id)
            ++i;
        document.getElementById(`${i}`).style.filter = "blur(3px)";
    }
   const humidity = document.getElementById(event.target.id).querySelector("h1").innerHTML;
   const precipitation = document.getElementById(event.target.id).querySelector("h2").innerHTML;
   const wind = document.getElementById(event.target.id).querySelector("h3").innerHTML;
   const tempArr = [humidity, precipitation, wind]
   displayInfo(tempArr);
}
function unBlur(event) {
    document.querySelector("#info").style.filter  = "blur(0)";
    for (let i=0; i<8; i++) {
        if (i == event.target.id)
            ++i;
        document.getElementById(`${i}`).style.filter = "blur(0)";
    }
    displayInfo(arr);
}