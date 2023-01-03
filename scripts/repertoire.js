function focusListing(id = 0) {
    movieListings.forEach(function (desc) { desc.classList.remove('description') })
    movieListings[id].classList.add('description')
}

function addEventListeners() {
    window.addEventListener('load', () => {
        document.querySelector('main div.lds-ring').remove()
        
        descCheckbox = document.querySelector('#show-descriptions input')
        movieListings = document.querySelectorAll('article')

        descCheckbox.addEventListener('change', () => {
            if (descCheckbox.checked)
                movieListings.forEach((desc) => { desc.classList.add('description') })
            else
                focusListing()
        })

        movieListings.forEach((desc, id) => {
            desc.addEventListener('mouseover', () => { if (!descCheckbox.checked) focusListing(id) })
        })
    })
}

const movies = fetch('https://wawel.herokuapp.com/movies')
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getMovies = async () => {
    const m = await movies

    m.forEach((movie) => {
        listing = createElementFromHTML('<article class="bottom-gradient-border listing"> <img src="img/Black Adam.jpg" alt=""> <a href="film.html" class="info"> <div> <h2></h2> <div class="rating"> <p>4.32</p> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"><polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"/></svg> </div> </div> <p class="info">Komedia | Od lat 13 | 125 min</p> <p class="description"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, repellendus modi dolor sequi magni saepe? Facere ipsum exercitationem blanditiis eaque consectetur! Architecto voluptatum repellendus facilis quidem fugit reiciendis maxime reprehenderit. </p> </a> <div class="screenings"> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> <a href="zakup.html" class="cta-2 bean"> <p class="hour">10:20</p class="hour"> <p class="type">2D napisy</p> </a> </div> </article>')

        listing.querySelector('img').src = 'img/posters/' + movie.title.replace(/[/\\?%*:|"<>]/g, '').toLowerCase() + '.jpg'
        listing.querySelector('a').href = 'film.html?id=' + movie.id

        const h2 = listing.querySelector('h2')
        const titleSplit = movie.title.split(' ')

        titleSplit.forEach((word) => {
            let span = document.createElement('span')
            span.innerText = word[0].toUpperCase()
            span.classList.add('capital')

            h2.appendChild(span)
            h2.innerHTML += word.slice(1) + ' '
        })


        listing.querySelector('div.rating p').innerText = movie.rating || 4.32

        listing.querySelector('p.info').innerText = movie.genre || 'Dramat'
        listing.querySelector('p.info').innerText += ' | Od lat ' + (movie.minAge || 13)
        listing.querySelector('p.info').innerText += ' | ' + (movie.duration || 120) + ' min'

        listing.querySelector('p.description').innerText = movie.description

        document.querySelector('main div.wrapper').appendChild(listing)
    })
}    

getMovies().then(() => { addEventListeners() })

