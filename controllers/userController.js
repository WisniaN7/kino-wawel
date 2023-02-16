const db = require('./database')

async function getTickets(userId) {
    const connection = await db.createConnection()

    let sql = 'SELECT screening_id, date, time, city FROM tickets NATURAL JOIN screenings NATURAL JOIN cinemas WHERE user_id = ? GROUP BY screening_id;'
    const [screenings] = await connection.query(sql, userId)

    sql = 'SELECT ticket_type FROM ticket_types;'
    const [ticketTypesQuery] = await connection.query(sql)
    let ticketTypes = {}

    for (const ticket_type of ticketTypesQuery)
        ticketTypes[ticket_type.ticket_type] = 0

    for (const screening of screenings) {
        sql = 'SELECT movie_id, title, age_rating, duration, genre FROM screenings NATURAL JOIN movies NATURAL JOIN movie_genres NATURAL JOIN genres WHERE screening_id = ?;'
        const [movie] = await connection.query(sql, screening.screening_id)
        let genres = []

        for (const genre of movie)
            genres.push(genre.genre)

        movie[0].genre = genres.sort().join(', ')
        screening.movie = movie[0]
        
        screening.tickets = { ...ticketTypes }
        sql = 'SELECT ticket_type FROM tickets NATURAL JOIN ticket_types WHERE user_id = ? AND screening_id = ?;'
        const [tickets] = await connection.query(sql, [userId, screening.screening_id])

        for (const ticket of tickets)
            screening.tickets[ticket.ticket_type]++
    }

    await connection.end()
    return screenings
}

async function getReviews(userId) {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM reviews NATURAL JOIN movies WHERE user_id = ?;'
    const [reviews] = await connection.query(sql, userId)
    await connection.end()
    return reviews
}

async function getReview(reviewId) {
    const connection = await db.createConnection()
    const sql = 'SELECT rating, review, movie_id, title, description FROM reviews NATURAL JOIN movies WHERE review_id = ? LIMIT 1;'
    const [reviews] = await connection.query(sql, reviewId)
    await connection.end()
    return reviews[0]
}

async function getWatched(userId) {
    const connection = await db.createConnection()
    let sql = 'SELECT movie_id, title, age_rating, duration, description, date, time FROM tickets NATURAL JOIN screenings NATURAL JOIN movies WHERE user_id = ? GROUP BY movie_id ORDER BY date;'
    const [watchedMovies] = await connection.query(sql, userId)

    let occurances = []

    for (const watched of watchedMovies) {
        const date = new Date(watched.date.toISOString().slice(0, 10) + 'T' + watched.time)

        if (date > new Date() || occurances.includes(watched.movie_id)) {
            const index = watchedMovies.indexOf(watched)
            watchedMovies.splice(index, 1)
            continue
        } 

        occurances.push(watched.movie_id)

        sql = 'SELECT genre FROM movies NATURAL JOIN movie_genres NATURAL JOIN genres WHERE movie_id = ? ORDER BY genre;'
        const [genres] = await connection.query(sql, watched.movie_id)
        watched.genres = genres.map(genre => genre.genre).join(', ')

        sql = 'SELECT review_id, rating, review FROM reviews WHERE user_id = ? AND movie_id = ?;'
        const [rating] = await connection.query(sql, [userId, watched.movie_id])

        watched.rating = rating[0]?.rating || 0

        if (rating[0]?.review) {
            watched.review = true
            watched.review_id = rating[0].review_id
        }
    }

    await connection.end()
    return watchedMovies
}

async function updateRating(userId, movieId, rating) {
    const connection = await db.createConnection()
    const sql = 'UPDATE reviews SET rating = ? WHERE user_id = ? AND movie_id = ?;'
    await connection.query(sql, [rating, userId, movieId])
    await connection.end()
}

async function updateReview(userId, movieId, rating, review) {
    const connection = await db.createConnection()
    const sql = 'UPDATE reviews SET rating = ?, review = ? WHERE user_id = ? AND movie_id = ?;'
    await connection.query(sql, [rating, review, userId, movieId])
    await connection.end()
}

module.exports = {
    getTickets,
    getReview,
    getReviews,
    getWatched,
    updateRating,
    updateReview,
}