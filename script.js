function findCity(location) {
	const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=b206d80c92d9a53cdc890c68d85f783e`;
	fetch(apiUrl)
		.then((data) => data.json())
		.then((weather) => generateHtml(weather))

		const generateHtml = (data) => {
			console.log(data)
			const html = `
				<div class="card">
					<div class="semi-circle">
						<div class="search">
							<input type="text" id="inputField" placeholder="Enther city name" title="Type in a city">
							<button class="button" onclick="findCity(document.getElementById('inputField').value)"><img src="./assets/search.png"></button>
						</div>
						<p class="city">${data.name}</p>
						<p class="type">${data.weather[0].description}</p>
						<div class="weather">
							<img src="./assets/rain.png" class="weather-icon">
						</div>
					</div>
					<div class="info">
						<div>
							<img src="./assets/humidity.png">
							<p class="humidity">${data.main.humidity}%</p>
						</div>
						<p class="temp">${((data.main.temp-273)*(9/5)+32).toFixed(2)}°</p>
						<div>
							<img src="./assets/wind.png">
							<p class="wind">${data.main.wind}</p>
						</div>
					</div>
					<!-- <div id="forecast">
					</div> -->
				</div>
			`
			const weatherDiv = document.querySelector('.card')
			weatherDiv.innerHTML = html
		}
}