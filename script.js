function findCity(location) {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=b206d80c92d9a53cdc890c68d85f783e`;
    async function checkWeather(url) {
        const reponse = await fetch(url);
        const weatherIcon = document.querySelector(".weather-icon");
        var data = await reponse.json();

        console.log(data);

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".type").innerHTML = data.weather[0].description.charAt(0).toUpperCase()+data.weather[0].description.slice(1);;
        document.querySelector(".temp").innerHTML = ((data.main.temp-273)*(9/5)+32).toFixed(0)+"°";
        document.querySelector(".humidity").innerHTML = data.main.humidity+"%";
        document.querySelector(".wind").innerHTML = data.wind.speed+" mph";

        if (data.weather[0].main == "Clear") {
            weatherIcon.src = "./assets/clear.png";
        }
        else if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "./assets/clouds.png";
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "./assets/rain.png";
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "./assets/drizzle.png";
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "./assets/mist.png";
        }
        else if (data.weather[0].main == "Snow") {
            weatherIcon.src = "./assets/snow.png";
        }
    }
    checkWeather(apiUrl);
}
