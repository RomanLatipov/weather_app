async function findCity(location) {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=b206d80c92d9a53cdc890c68d85f783e`;
    let reponse = await fetch(apiUrl);
    let data = await reponse.json();
    console.log(data);

    //const hour = new Date(data.dt*1000);
    // const time = (hour>=7 && hour<22) ? "day" : "night";
    // console.log(hour);
    //console.log((data.dt*1000));

    const tod = (data.dt>=data.sys.sunrise && data.dt<data.sys.sunset) ? "day" : "night";
    console.log(tod);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".type").innerHTML = data.weather[0].description.charAt(0).toUpperCase()+data.weather[0].description.slice(1);;
    document.querySelector(".temp").innerHTML = ((data.main.temp-273)*(9/5)+32).toFixed(0)+"°";
    document.querySelector(".humidity").innerHTML = data.main.humidity+"%";
    document.querySelector(".wind").innerHTML = data.wind.speed+" mph";
    document.querySelector(".weather-icon").src = `./assets/${(data.weather[0].main).toLowerCase()}.png`;//add fog as weather option
    document.getElementById('inputField').value = "";
    
    // const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=b206d80c92d9a53cdc890c68d85f783e`;
    // reponse = await fetch(forecastUrl);
    // const next24Hours = (await reponse.json()).list.slice(0, 8);
    // document.querySelector(".hourly-forecast").innerHTML = "";

    // for (let i = 0; i<8; i++) {
    //     const hour = timeConverter(new Date(next24Hours[i].dt * 1000).getHours());
    //     const temperature = Math.round((next24Hours[i].main.temp-273)*(9/5)+32);

    //     const hourlyItemHtml = `
    //         <div class="hourly-item">
    //             <img src="./assets/${(next24Hours[i].weather[0].main).toLowerCase()}.png">
    //             <span style="font-size: 25px;">${temperature}°</span>
    //             <span>${hour}</span>
    //         </div>`;
    //     document.querySelector(".hourly-forecast").innerHTML += hourlyItemHtml;
    // }
    // function timeConverter(hour) {
    //     let time = (hour >= 12) ? `${hour-12}:00 PM` : `${hour}:00 AM`;
    //     return time;
    // }
}
