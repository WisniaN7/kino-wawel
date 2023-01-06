const movies = fetch('https://wawel.herokuapp.com/movies')
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovies = async () => {
    const m = await movies
    const statusToClass = {
        'BRAK_SEANSU': 'no-screenings',
        'PRZED_PREMIERA': 'pre-premiere',
        'PREMIERA': 'premiere',
        'GRANY': 'playing',
        'NIE_GRANY': 'not-playing',
        'ZARCHIWIZOWANY': 'archived'
    }

    m.forEach((movie) => {
        const listing = createElementFromHTML('<article class="bottom-gradient-border listing"> <img src="img/posters/black adam.jpg" alt=""> <div href="film.html" class="info"> <div> <h2></h2> </div> <p class="info">Komedia | Od lat 13 | 125 min</p> <p class="description"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, repellendus modi dolor sequi magni saepe? Facere ipsum exercitationem blanditiis eaque consectetur! Architecto voluptatum repellendus facilis quidem fugit reiciendis maxime reprehenderit. </p> </div> <p class="status"><span>•</span> Grany</p> <div class="manage"> <a href="edytuj film.html" class="edit btn cta-1">Edytuj</a> <a href="#" class="edit btn cta-3 archive">Zarchiwizuj</a> <a href="#" class="delete btn cta-2 alert">Usuń</a> </div> </article>')
        
        listing.querySelector('img').src = 'img/posters/' + movie.title.replace(/[/\\?%*:|"<>]/g, '').toLowerCase() + '.jpg'
        
        const h2 = listing.querySelector('h2')
        const titleSplit = movie.title.split(' ')

        titleSplit.forEach((word) => {
            let span = document.createElement('span')
            span.innerText = word[0].toUpperCase()
            span.classList.add('capital')

            h2.appendChild(span)
            h2.innerHTML += word.slice(1) + ' '
        })

        const status = listing.querySelector('p.status')
        status.innerHTML = '<span>•</span> ' + (movie.status.toLowerCase().replace('_', ' ') || 'Grany')
        status.classList.add(statusToClass[movie.status.toLowerCase()] || 'playing')

        if (movie.status == 'ZARCHIWIZOWANY')
            listing.querySelector('div.manage a.archive').remove()
        
        const info = listing.querySelector('p.info')
        info.innerText = movie.genre || 'Dramat'
        info.innerText += ' | Od lat ' + (movie.minAge || 13)
        info.innerText += ' | ' + (movie.duration || 120) + ' min'

        listing.querySelector('p.description').innerText = movie.description

        listing.querySelector('div.manage a').href = 'edytuj film.html?id=' + movie.id
        document.querySelector('main section').appendChild(listing)
    })
}

getMovies()