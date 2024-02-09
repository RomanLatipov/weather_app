function findCity(location) {
	const apiData = {
		url: 'https://api.openweathermap.org/data/2.5/weather?q=',
		city: location,
		id: '&APPID=b206d80c92d9a53cdc890c68d85f783e',
	}
	const apiUrl = `${apiData.url}${apiData.city}${apiData.id}`
	fetch(apiUrl)
		.then((data) => data.json())
		.then((weather) => generateHtml(weather))

	const generateHtml = (data) => {
		console.log(data)
		const html = `
			<div class="card font">
			<div class="name">${data.name}</div>
			<img src='https://api.openweathermap.org/img/w/${data.weather[0].icon}'style="width:20%">
			<div class="details">
				<span><b>Temperature:</b> ${((data.main.temp-273)*(9/5)+32).toFixed(2)}\xB0F</span><br>			
				<span><b>Weather:</b> ${data.weather[0].description}</span><br>
				<span><b>humidity:</b> ${data.main.humidity}%</span>
			</div> </div>
		`
		const weatherDiv = document.querySelector('.Weather')
		weatherDiv.innerHTML = html
	}
}