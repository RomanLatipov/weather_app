function findCity(location) {
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
    generateHtml(location);
}