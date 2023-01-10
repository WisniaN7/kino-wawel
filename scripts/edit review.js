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

            star.parentNode.setAttribute('data-rating', i)
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

    const submit = document.querySelector('button[type="submit"]')

    submit.addEventListener('click', (e) => {
        const rating = document.querySelector('.stars').getAttribute('data-rating')

        if (rating > 0) 
            e.preventDefault()
        else
            return

        const data = {
            userId: user.userId,
            movieId: movieId,
            rating: rating,
            reviewText: document.querySelector('textarea').value
        }

        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://wawel.herokuapp.com/movies/reviews', true)
        xhr.setRequestHeader("content-type", "application/json")

        xhr.onreadystatechange = () => {
            if (xhr.readyState != xhr.DONE) return

            if (xhr.status === 200) {
                if (id)
                    window.location.href = document.referrer.split('?')[0]  + '?status=12'
                else
                    window.location.href = document.referrer.split('?')[0]  + '?status=11'
            } else {
                if (id)
                    window.location.href = window.location.href + '?status=14' + '&message=' + xhr.responseText
                else
                    window.location.href = window.location.href + '?status=13' + '&message=' + xhr.responseText
            }
        }

        xhr.send(JSON.stringify(data))
    })

    const cancel = document.querySelector('a.btn')

    cancel.addEventListener('click', (e) => {
        e.preventDefault()
        window.location.href = document.referrer
    })
}

const id = urlParams.get('id')
const movieId = urlParams.get('movieId')

const review = fetch('https://wawel.herokuapp.com/movies/review/' + id)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const movies = fetch('https://wawel.herokuapp.com/movies/' + movieId)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getReview = async () => {
    const reviewHTML = createElementFromHTML('<div class="wrapper"> <section> <form> <h2><span class="capital">T</span>woja recenzja filmu: </h2> <div class="rating"> <p>Ocena:</p> <div class="stars" data-rating="0"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <input type="radio" name="ratingCheck" id="ratingCheck" required> </div> </div> <label for="review">Recenzja</label> <textarea name="review" id="review" cols="26" rows="12"></textarea> <div class="buttons"> <a href="" class="btn cta-2">Anuluj</a> <button type="submit" class="cta-1">Dodaj recenzje</button> </div> </form> </section> <aside> <img src="" alt=""> <p></p> </aside> </div>')
    document.querySelector('main').appendChild(reviewHTML)
    
    if (id) {
        const r = await review
    
        if (r.userId != user.userId) {
            window.location.href = 'index.html'
            return
        }
        
        const starContainer = reviewHTML.querySelector('.stars')
        starContainer.setAttribute('data-rating', r.rating)

        const stars = starContainer.querySelectorAll('.star')

        for (let i = 0; i < r.rating; i++)
            stars[i].classList.add('full')

        reviewHTML.querySelector('button.cta-1').innerText = 'Edytuj recenzje'
        reviewHTML.querySelector('textarea').value = r.reviewText
    }


    if (movieId) {
        const movie = await movies
    
        const h2 = reviewHTML.querySelector('h2')
        const titleSplit = movie.title.split(' ')
    
        titleSplit.forEach((word) => {
            let span = document.createElement('span')
            span.innerText = word[0].toUpperCase()
            span.classList.add('capital')
    
            h2.appendChild(span)
            h2.innerHTML += word.slice(1) + ' '
        })

        reviewHTML.querySelector('aside img').src = movie.posterSource || 'img/posters/' + movie.title.replace(/[/\\?%*:|"<>]/g, '').toLowerCase() + '.jpg'
        reviewHTML.querySelector('aside p').innerText = movie.description
    }
}

getReview().then(() => { addEventListeners() })