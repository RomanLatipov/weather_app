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
			<div class="name">${data}</div>
            <div class="details">
                <span><b>Temperature:</b> 100
            </div> </div>
        `
        const weatherDiv = document.querySelector('.Weather')
		weatherDiv.innerHTML = html
    }
}