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

    citySelect.addEventListener('change', async () => {
        if (blockChange) {
            citySelect.value = citySelect.getAttribute('data-value')
            return
        } 

        citySelect.setAttribute('data-value', citySelect.value)
        city = citySelect.value.toUpperCase()
        await getMovies(city, date)

        blockChange = false
    })

    dateSelect = document.querySelector('#day-select input')
    dateLabel = document.querySelector('#day-select div span')
    dateArrows = document.querySelectorAll('#day-select span.arrow')

    dateSelect.value = date
    dateLabel.innerText = new Date().toLocaleDateString('pl-PL', { weekday: 'long', month: 'numeric', day: 'numeric' })

    dateArrows.forEach((arrow) => {
        arrow.addEventListener('click', async () => {
            if (blockChange) return 

            blockChange = true
            date = new Date(dateSelect.value)
            date.setDate(date.getDate() + (arrow.classList.contains('left') ? -1 : 1))
            dateLabel.innerText = date.toLocaleDateString('pl-PL', { weekday: 'long', month: 'numeric', day: 'numeric' })
            date = date.toISOString().split('T')[0]
            dateSelect.value = date

            await getMovies(city, date).then(() => { addEventListenersForListings() })
            blockChange = false
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

            createSnackbar('Termin seansu już minął lub jest niedostępny', 'warning', 'short')
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

    const movies = fetch('/repertuar/' + city + '/' + date)
        .then((res) => {
            if (res.ok)
                return res.json()
            else
                createSnackbar('Wystąpił błąd podczas pobierania danych. Odśwież stronę lub skontaktuj się z administratorem serwisu.', 'error', 'long')
        })

    const m = await movies

    m.forEach((tuple) => {
        const movie = tuple.movie
        const screenings = tuple.screenings

        screenings.sort((a, b) =>  {
            const hourDiff = a.time.split(':')[0] - b.time.split(':')[0]
            return hourDiff != 0 ? hourDiff : a.time.split(':')[1] - b.time.split(':')[1]
        })

        const listing = createElementFromHTML('<article class="bottom-gradient-border listing"> <img src="img/Black Adam.jpg" alt=""> <a href="film.html" class="info"> <div> <h2></h2> <div class="rating"> <p>4.32</p> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"><polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"/></svg> </div> </div> <p class="info">Komedia | Od lat 13 | 125 min</p> <p class="description"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, repellendus modi dolor sequi magni saepe? Facere ipsum exercitationem blanditiis eaque consectetur! Architecto voluptatum repellendus facilis quidem fugit reiciendis maxime reprehenderit. </p> </a> <div class="screenings"></div> </article>')

        listing.querySelector('img').src = 'images/posters/' + movie.title.replaceAll(/[^a-zA-Z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż/ .]/g, '') + '.jpg'
        listing.querySelector('a').href = 'film/' + movie.movie_id + '/' + city + '/' + date + '/' + movie.title 

        const h2 = listing.querySelector('h2')
        const titleSplit = movie.title.split(' ')

        titleSplit.forEach((word) => {
            let span = document.createElement('span')
            span.innerText = word[0].toUpperCase()
            span.classList.add('capital')

            h2.appendChild(span)
            h2.innerHTML += word.slice(1) + ' '
        })

        listing.querySelector('div.rating p').innerText = Math.round(movie.avgRating * 100) / 100

        listing.querySelector('p.info').innerText = movie.genres
        listing.querySelector('p.info').innerText += ' | Od lat ' + movie.age_rating 
        listing.querySelector('p.info').innerText += ' | ' + movie.duration + ' min'

        listing.querySelector('p.description').innerText = movie.description

        let endIndex = 3
        
        for (let index = 0, counter = 0; index < Math.min(screenings.length, endIndex); index++, counter++) {
            let time = new Date(date + 'T' + screenings[index].time)

            if (isItTooLate(time, 15)) {
                endIndex++
                continue
            }

            const screening = createElementFromHTML('<a href="zakup" class="cta-2 bean"> <p class="hour"></p> <p class="type">2D napisy</p> </a>')
            
            const moreScreeningsNeeded = index == endIndex - 1 && counter < screenings.length - 1
            screening.href = moreScreeningsNeeded ? 'film/' + movie.title : 'zakup/' + movie.title +'/' + screenings[index].screening_id
            screening.querySelector('p.hour').innerText = moreScreeningsNeeded ? '...' :  screenings[index].time.slice(0, 5)
            screening.querySelector('p.type').innerText = moreScreeningsNeeded ? 'więcej' : (screenings[index].is_3D ? '3D' : '2D') + ' ' + screenings[index].sound_type.toLowerCase()
            
            listing.querySelector('div.screenings').appendChild(screening)
            counter++
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

let city = 'Kraków'
let date = new Date().toISOString().slice(0, 10)
let blockChange = false

getMovies(city, date).then(() => { addEventListeners() })