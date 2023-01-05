function focusListing(id = 0) {
    movieListings.forEach(function (desc) { desc.classList.remove('description') })
    movieListings[id].classList.add('description')
}

function addEventListeners() {
    addEventListenersForListings()
    
    descCheckbox = document.querySelector('#show-descriptions input')

    descCheckbox.addEventListener('change', () => {
        if (descCheckbox.checked)
            movieListings.forEach((desc) => { desc.classList.add('description') })
        else
            focusListing()
    })

    citySelect = document.querySelector('header select')

    citySelect.addEventListener('change', () => {
        city = citySelect.value.toUpperCase()
        getMovies(city, date)
    })

    dateSelect = document.querySelector('#day-select input')
    dateLabel = document.querySelector('#day-select div span')
    dateArrows = document.querySelectorAll('#day-select span.arrow')

    dateSelect.value = date
    dateLabel.innerText = new Date().toLocaleDateString('pl-PL', { weekday: 'long', month: 'numeric', day: 'numeric' })

    dateArrows.forEach((arrow) => {
        arrow.addEventListener('click', () => {
            date = new Date(dateSelect.value)
            date.setDate(date.getDate() + (arrow.classList.contains('left') ? -1 : 1))
            dateLabel.innerText = date.toLocaleDateString('pl-PL', { weekday: 'long', month: 'numeric', day: 'numeric' })
            date = date.toISOString().split('T')[0]
            dateSelect.value = date
            getMovies(city, date).then(() => { addEventListenersForListings() })
        })
    })

    dateSelect.addEventListener('change', () => {
        date = new Date(dateSelect.value)
        dateLabel.innerText = date.toLocaleDateString('pl-PL', { weekday: 'long', month: 'numeric', day: 'numeric' })
        date = date.toISOString().split('T')[0]
        getMovies(city, date).then(() => { addEventListenersForListings() })
    })
}

function addEventListenersForListings() {
    movieListings = document.querySelectorAll('article')
    screenings = document.querySelectorAll('article div.screenings > a')

    movieListings.forEach((desc, id) => {
        desc.addEventListener('mouseover', () => { if (!descCheckbox.checked) focusListing(id) })
    })

    screenings.forEach((screening) => {
        screening.addEventListener('click', (e) => {      
            let time = dateSelect.value
            screeningTime = screening.querySelector('p').innerText.split(':')
            time.setHours(screeningTime[0], screeningTime[1], 0, 0)
            
            if (isItTooLate(time, 15))
                e.preventDefault()

            const snackbar = createSnackbar('Termin seansu już minął lub jest niedostępny')
            snackbar.classList.add('warning')
        })
    })
}

const getMovies = async (city, date) => {
    const lisings = document.querySelectorAll('main div.wrapper article, main div.wrapper h2')

    lisings.forEach((listing) => {
        listing.remove()
    })

    const loader = createElementFromHTML('<div class="lds-ring"> <div></div> <div></div> <div></div> <div></div> </div>')
    document.querySelector('main div.wrapper').appendChild(loader)

    const movies = fetch('https://wawel.herokuapp.com/movies/repertoire?city=' + city + '&date=' + date)
        .then((response) => response.json())
        .then((data) => {
            return data
        })

    const m = await movies

    m.items.forEach((tuple) => {
        const movie = tuple.movie
        const screenings = tuple.screenings

        screenings.sort((a, b) => a.startTime.split(':')[0] - b.startTime.split(':')[0])

        const listing = createElementFromHTML('<article class="bottom-gradient-border listing"> <img src="img/Black Adam.jpg" alt=""> <a href="film.html" class="info"> <div> <h2></h2> <div class="rating"> <p>4.32</p> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"><polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"/></svg> </div> </div> <p class="info">Komedia | Od lat 13 | 125 min</p> <p class="description"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, repellendus modi dolor sequi magni saepe? Facere ipsum exercitationem blanditiis eaque consectetur! Architecto voluptatum repellendus facilis quidem fugit reiciendis maxime reprehenderit. </p> </a> <div class="screenings"></div> </article>')

        listing.querySelector('img').src = 'img/posters/' + movie.title.replace(/[/\\?%*:|"<>]/g, '').toLowerCase() + '.jpg'
        listing.querySelector('a').href = 'film.html?id=' + movie.id + '&city=' + city + '&date=' + date

        const h2 = listing.querySelector('h2')
        const titleSplit = movie.title.split(' ')

        titleSplit.forEach((word) => {
            let span = document.createElement('span')
            span.innerText = word[0].toUpperCase()
            span.classList.add('capital')

            h2.appendChild(span)
            h2.innerHTML += word.slice(1) + ' '
        })

        listing.querySelector('div.rating p').innerText = movie.averageRating

        listing.querySelector('p.info').innerText = movie.genre
        listing.querySelector('p.info').innerText += ' | Od lat ' + movie.minAge
        listing.querySelector('p.info').innerText += ' | ' + movie.duration + ' min'

        listing.querySelector('p.description').innerText = movie.description

        let endIndex = 3
        
        for (let index = 0; index < Math.min(screenings.length, endIndex); index++) {
            let time = new Date(date + 'T' + screenings[index].startTime)

            if (isItTooLate(time, 15)) {
                endIndex++
                continue
            }

            const screening = createElementFromHTML('<a href="zakup.html" class="cta-2 bean"> <p class="hour"></p> <p class="type">2D napisy</p> </a>')
            
            screening.href = index == 2 && screenings.length > 3 ? 'film.html?id=' + movie.id : 'zakup.html?movieId=' + movie.id + '&screeningId=' + screenings[index].screeningId
            screening.querySelector('p.hour').innerText = (index == 2 && screenings.length > 3) ? '...' :  screenings[index].startTime.slice(0, 5)
            screening.querySelector('p.type').innerText = (index == 2 && screenings.length > 3) ? 'więcej' : screenings[index].movieType.split('').reverse().join('') + ' ' + screenings[index].movieSoundType.toLowerCase()
            listing.querySelector('div.screenings').appendChild(screening)
        }

        if (screenings.length + 3 > endIndex)
            document.querySelector('main div.wrapper').appendChild(listing)
    })

    loader.remove()

    if (document.querySelectorAll('article').length == 0) {
        const h2 = document.createElement('h2')
        h2.innerText = 'Brak najbliższych seansów w danym dniu'
        document.querySelector('main div.wrapper').appendChild(h2)
    }
}

let city = 'KRAKOW'
let date = new Date().toISOString().slice(0, 10)

getMovies(city, date).then(() => { addEventListeners() })
