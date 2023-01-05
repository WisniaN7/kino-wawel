const reviews = fetch('https://wawel.herokuapp.com/movies/users/' + user.userId)
    .then((response) => response.json())
    .then((data) => {
        return data
    })

const getReviews = async () => {
    const r = await reviews

    console.log(r)

    await r.reviews.forEach(async (review) => {
        console.log(review);

        const listing = createElementFromHTML('<article class="listing description"> <img src="img/posters/avatar istota wody.jpg" alt=""> <div class="body"> <header class="bottom-gradient-border"> <div> <h2><a href="film.html"></a></h2> <div class="stars" data-rating="5"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star full"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star full"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star full"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star full"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20.96 19.96" class="star full"> <polygon points="19.46 7.35 12.26 7.35 9.98 0.5 7.7 7.35 0.5 7.35 6.34 11.61 4.22 18.46 9.98 14.3 15.74 18.46 13.62 11.61 19.46 7.35 19.46 7.35"></polygon> </svg> </div> </div> <a href="recenzja.html" class="btn cta-1">Edytuj</a> </header> <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure non voluptate, amet, minima quae error alias aut, consequuntur blanditiis ipsam itaque rem dignissimos. Hic obcaecati, soluta laborum ad impedit tenetur!</p> </div> </article>')

        listing.querySelector('header a.btn').href = 'recenzja.html?id=' + review.reviewId
        
        const h2 = listing.querySelector('h2 a')

        const movies = fetch('https://wawel.herokuapp.com/movies/' + review.movieId)
            .then((response) => response.json())
            .then((data) => {
                return data
            })

        const movie = await movies

        const titleSplit = movie.title.split(' ')

        titleSplit.forEach((word) => {
            let span = document.createElement('span')
            span.innerText = word[0].toUpperCase()
            span.classList.add('capital')

            h2.appendChild(span)
            h2.innerHTML += word.slice(1) + ' '
        })

        const stars = listing.querySelectorAll('.star')

        for (let i = 0; i < review.rating; i++)
            stars[i].classList.add('full')

        listing.querySelector('a.btn').href= 'recenzja.html?id=' + review.id

        listing.querySelector('p').innerText = review.reviewText

        document.querySelector('main div.wrapper').appendChild(listing)
    })
}

getReviews()