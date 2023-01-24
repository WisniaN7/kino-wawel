function addEventListeners() {
    const stars = document.querySelectorAll('.star')

    stars.forEach(function (star) {
        star.addEventListener('mouseover', () => {
            const siblings = star.parentNode.querySelectorAll('.star')

            siblings.forEach((sibling) => { sibling.classList.remove('full') })

            let i = 0

            do {
                siblings[i].classList.add('full')
                i++
            } while (siblings[i - 1] !== star)
        })

        star.addEventListener('click', () => {
            const siblings = star.parentNode.querySelectorAll('.star')
            let i = 0

            do {
                i++
            } while (siblings[i - 1] !== star)

            const prevScore = star.parentNode.getAttribute('data-rating')
            console.log(prevScore);
            star.parentNode.setAttribute('data-rating', i)

            const data = {
                userId: user.userId,
                movieId: star.parentNode.getAttribute('data-movieId'),
                rating: star.parentNode.getAttribute('data-rating')
            }

            const xhr = new XMLHttpRequest()
            xhr.open('POST', 'https://wawel.herokuapp.com/movies/reviews', true)
            xhr.setRequestHeader("content-type", "application/json")

            xhr.onreadystatechange = () => {
                if (xhr.readyState != xhr.DONE) return

                if (xhr.status === 200)
                    createSnackbar('Ocena została zaktualizowana', 'success')
                else {
                    createSnackbar('Błąd przy aktualizacji oceny', 'error')
                    star.parentNode.setAttribute('data-rating', prevScore)
                }
            }

            xhr.send(JSON.stringify(data))
        })
    })

    const starContainer = document.querySelectorAll('.stars')

    starContainer.forEach(function (container) {
        container.addEventListener('mouseleave', () => {
            let stars = container.querySelectorAll('.star')
            stars.forEach((star) => { star.classList.remove('full') })

            for (let i = 0; i < container.getAttribute('data-rating'); i++)
                stars[i].classList.add('full')
        })
    })
}

const watched = fetch('https://wawel.herokuapp.com/movies/users/' + user.userId)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getWatched = async () => {
    const w = await watched

    if (w.watchedMovies.length == 0) {
        const h2 = document.createElement('h2')
        h2.innerText = 'Nie obejrzano jeszcze żadnych filmów.'
        document.querySelector('main div.wrapper').appendChild(h2)
    }

    w.watchedMovies.forEach((movie) => {
        console.log(movie);

        const listing = createElementFromHTML('<article class="bottom-gradient-border listing description"> <img src="img/posters/black adam.jpg" alt=""> <a href="film.html" class="info"> <div> <h2></h2> </div> <p class="info">Komedia | Od lat 13 | 125 min</p> <p class="description"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, repellendus modi dolor sequi magni saepe? Facere ipsum exercitationem blanditiis eaque consectetur! Architecto voluptatum repellendus facilis quidem fugit reiciendis maxime reprehenderit. </p> </a> <div class="rating"> <p>Oceń</p> <div class="stars" data-rating="0"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"><polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"/></svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"><polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"/></svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"><polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"/></svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"><polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"/></svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"><polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"/></svg> </div> <a href="edytuj recenzje.html" class="btn cta-1">Napisz recenzję</a> </div> </article>')

        listing.querySelector('img').src = movie.posterSource || 'img/posters/' + movie.title.replace(/[/\\?%*:|"<>]/g, '').toLowerCase() + '.jpg'
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

        listing.querySelector('p.info').innerText = movie.genre
        listing.querySelector('p.info').innerText += ' | Od lat ' + movie.minAge
        listing.querySelector('p.info').innerText += ' | ' + movie.duration + ' min'

        listing.querySelector('p.description').innerText = movie.description

        const btn = listing.querySelector('a.btn')
        btn.href = 'edytuj recenzje.html?movieId=' + movie.id

        w.reviews.forEach((review) => {
            if (review.movieId == movie.id) {
                listing.querySelector('div.rating p').innerText = 'Oceniono'

                const starContainer = listing.querySelector('div.stars')
                starContainer.setAttribute('data-rating', review.rating)
                starContainer.setAttribute('data-movieId', review.movieId)

                let stars = starContainer.querySelectorAll('.star')

                for (let i = 0; i < review.rating; i++)
                    stars[i].classList.add('full')

                btn.href = 'edytuj recenzje.html?id=' + review.id + '&movieId=' + movie.id

                if (review.reviewText) {
                    btn.classList.remove('cta-1')
                    btn.classList.add('cta-2')
                    btn.innerText = 'Edytuj recenzję'
                }
            }
        })

        document.querySelector('main div.wrapper').appendChild(listing)
    })
}

getWatched().then(() => { addEventListeners() })