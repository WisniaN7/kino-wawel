const db = require('./database')

const getTickets = async (userId) => {
    const connection = await db.createConnection()

    let sql = 'SELECT screening_id, date, time, city FROM tickets NATURAL JOIN screenings NATURAL JOIN cinemas WHERE user_id = ? GROUP BY screening_id;'
    let screenings = []

    try {
        [screenings] = await connection.query(sql, userId)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }

    sql = 'SELECT ticket_type FROM ticket_types;'
    let ticketTypesQuery = []

    try {
        [ticketTypesQuery] = await connection.query(sql)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }

    let ticketTypes = {}

    for (const ticket_type of ticketTypesQuery)
        ticketTypes[ticket_type.ticket_type] = 0

    for (const screening of screenings) {
        sql = 'SELECT movie_id, title, age_rating, duration, genre FROM screenings NATURAL JOIN movies NATURAL JOIN movie_genres NATURAL JOIN genres WHERE screening_id = ?;'
        let movie = []
        
        try {
            [movie] = await connection.query(sql, screening.screening_id)
        } catch (err) {
            console.error(err)
            await connection.end()
            return null
        }

        let genres = []

        for (const genre of movie)
            genres.push(genre.genre)

        movie[0].genre = genres.sort().join(', ')
        screening.movie = movie[0]
        
        screening.tickets = { ...ticketTypes }
        sql = 'SELECT ticket_type FROM tickets NATURAL JOIN ticket_types WHERE user_id = ? AND screening_id = ?;'
        let tickets = []

        try {
            [tickets] = await connection.query(sql, [userId, screening.screening_id])
        } catch (err) {
            console.error(err)
            await connection.end()
            return null
        }

        for (const ticket of tickets)
            screening.tickets[ticket.ticket_type]++
    }

    await connection.end()
    return screenings
}

const getReviews = async (userId) => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM reviews NATURAL JOIN movies WHERE user_id = ?;'
    let reviews = []

    try {
        [reviews] = await connection.query(sql, userId)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }
    
    await connection.end()
    return reviews
}

const getReview = async (reviewId) => {
    const connection = await db.createConnection()
    const sql = 'SELECT rating, review, movie_id, title, description FROM reviews NATURAL JOIN movies WHERE review_id = ? LIMIT 1;'
    let review = []

    try {
        [review] = await connection.query(sql, reviewId)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }

    await connection.end()
    return review[0]
}

const getWatched = async (userId) => {
    const connection = await db.createConnection()
    let sql = 'SELECT movie_id, title, age_rating, duration, description, date, time FROM tickets NATURAL JOIN screenings NATURAL JOIN movies WHERE user_id = ? ORDER BY date;'
    let [watchedMovies] = []

    try {
        [watchedMovies] = await connection.query(sql, userId)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }

    let occurances = []
    let uniqueWatchedMovies = []

    for (const watched of watchedMovies) {
        const date = new Date(watched.date)
        date.setHours(watched.time.split(':')[0])
        date.setMinutes(watched.time.split(':')[1])

        if (date > new Date() || occurances.includes(watched.movie_id))
            continue

        occurances.push(watched.movie_id)

        sql = 'SELECT genre FROM movies NATURAL JOIN movie_genres NATURAL JOIN genres WHERE movie_id = ? ORDER BY genre;'
        let genres = []

        try {
            [genres] = await connection.query(sql, watched.movie_id)
        } catch (err) {
            console.error(err)
            await connection.end()
            return null
        }

        watched.genres = genres.map(genre => genre.genre).join(', ')

        sql = 'SELECT review_id, rating, review FROM reviews WHERE user_id = ? AND movie_id = ?;'
        let rating = []

        try {
            [rating] = await connection.query(sql, [userId, watched.movie_id])
        } catch (err) {
            console.error(err)
            await connection.end()
            return null
        }

        watched.rating = rating[0]?.rating || 0

        if (rating[0]?.review) {
            watched.review = true
            watched.review_id = rating[0].review_id
        }

        uniqueWatchedMovies.push(watched)
    }

    await connection.end()
    return uniqueWatchedMovies
}

const getMovie = async (movieId) => {
    const connection = await db.createConnection()
    const sql = 'SELECT title, description FROM movies WHERE movie_id = ?;'
    let movie = []

    try {
        [movie] = await connection.query(sql, movieId)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }

    await connection.end()
    return movie[0]
}

const updateRating = async (userId, movieId, rating) => {
    const connection = await db.createConnection()
    const sql = 'UPDATE reviews SET rating = ? WHERE user_id = ? AND movie_id = ?;'

    try {
        await connection.query(sql, [rating, userId, movieId])
    } catch (err) {
        console.error(err)
        await connection.end()
        return false
    }
    
    await connection.end()
    return true
}

const updateReview = async (userId, movieId, rating, review) => {
    const connection = await db.createConnection()
    const sql = 'UPDATE reviews SET rating = ?, review = ? WHERE user_id = ? AND movie_id = ?;'

    try {
        await connection.query(sql, [rating, review, userId, movieId])
    } catch (err) {
        console.error(err)
        await connection.end()
        return false
    }
    
    await connection.end()
    return true
}

const userWatchedmovie = async (userId, movieId) => {
    const watchedMovies = await getWatched(req.session.user.user_id)
    return watchedMovies.some(movie => movie.movie_id === movieId)
}

module.exports = {
    getTickets,
    getReview,
    getReviews,
    getWatched,
    getMovie,
    updateRating,
    updateReview,
    userWatchedmovie,
}