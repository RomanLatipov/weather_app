async function findCity(location) {
    let reponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=b206d80c92d9a53cdc890c68d85f783e`);
    let data = await reponse.json();
    console.log(data);

    //to get an hourly forecast Open Weather Map has a differnt api url that sends an array
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=b206d80c92d9a53cdc890c68d85f783e`;
    reponse = await fetch(forecastUrl);
    const forecast = (await reponse.json()).list.slice(0, 8);
    // console.log(forecast);

    displayWeather(data);
    const presArr = [data.main.humidity, (data.rain === undefined) ? 0 : Math.round(data.rain["1h"]), Math.round(data.wind.speed)];
    displayInfo(presArr); 
    displayForecast(forecast, presArr);
}
function displayWeather(city) {
    document.getElementById('inputField').value = "";
    const unixTimestamp = city.dt + city.timezone;
    const dateObj = new Date(unixTimestamp * 1000);
    const utcString = dateObj.toUTCString();
    this.timeZone = city.timezone / 3600;
    const hour = utcString.slice(-12, -10);
    const time = (hour >= 9 && hour < 23) ? "day" : "night";

    document.getElementById("city").textContent = city.name;

    const temp = document.getElementById("temp");
    const celsius = Math.round(city.main.temp-273);
    const celAndFah = [Math.round(celsius*(9/5)+32), celsius];
    temp.textContent = celAndFah[0]+"°";

    let i = 1;
    temp.addEventListener("click", () => {
        if (i === 1)
            temp.textContent = celAndFah[i--] + "°";
        else
            temp.textContent = celAndFah[i++] + "°";
    });

    const weather = city.weather[0].main.toLowerCase();
    const icon = document.getElementById("weather-icon");
    const background = document.getElementById("card");
    if (weather === "clear") {
        icon.src = `./assets/${(weather)}-${time}.svg`;
        background.style.backgroundImage = `url(./assets/background/${city.weather[0].main}-${time}.jpeg)`;
    }
    else {
        icon.src = `./assets/${(weather)}.svg`;
        background.style.backgroundImage = `url(./assets/background/${city.weather[0].main}.jpeg)`;
    }

    document.getElementById("type").textContent = city.weather[0].description.charAt(0).toUpperCase()+city.weather[0].description.slice(1);    
}
function displayInfo(arr) {
    document.getElementById("humidity").textContent = arr[0] + "%";
    document.getElementById("precipitation").textContent = arr[1] + " mm";
    document.getElementById("wind").textContent = arr[2] + " mph";
}
function displayForecast(forecast, curentArr) {
    document.querySelector(".hourly-forecast").innerHTML = "";
    const descArr = [];
    let id = 0;
    forecast.forEach(element => {
        const hour = timeConverter(parseInt(element.dt_txt.slice(-8, -6))+timeZone);
        let time; 
        if (hour === "9:00 AM" || hour === "10:00 AM" || hour === "11:00 AM")
            time = "day";
        else if (hour.slice(-2) === "PM" && hour.slice(0, -6) !== "11")
            time = "day";
        else
            time = "night";

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

        const elemArr = [element.main.humidity, (element.rain === undefined) ? 0 : Math.round(element.rain["3h"]), Math.round(element.wind.speed)];
        descArr.push(elemArr);

        forecast.append(div);
        div.append(img);
        div.append(p1);
        div.append(p2);

        div.addEventListener("click", event => {
            blur(event, descArr[event.target.id], "blur(3px)");
        });
        div.addEventListener("mouseout", event => {
            blur(event, curentArr, "blur(0px)");
        });
    });

    function timeConverter(hour) {
        if (hour <= 0)
            hour+=24;
        else if (hour > 24)
            hour-=24;

        let time;
        if (hour > 12 && hour !== 24)
            time = hour-12 + ":00 PM";
        else if (hour === 12)
            time = "12:00 PM"
        else if (hour < 12)
            time = hour + ":00 AM";
        else if (hour === 24)
            time = "12:00 Am"

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
}
function blur(event, arr, blur) {
    document.querySelector("#info").style.filter = blur;
    // document.querySelector("#card").style.background.filter = "blur(3px)";
    for (let i=0; i<8; i++) {
        if (i == event.target.id)
            ++i;
        document.getElementById(`${i}`).style.filter = blur;
    }
   displayInfo(arr);
}