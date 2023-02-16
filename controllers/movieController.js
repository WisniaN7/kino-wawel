const db = require('./database')

const getMovie = async (id) => {
    const connection = await db.createConnection()

    sql = 'SELECT * FROM movies NATURAL JOIN movie_genres NATURAL JOIN genres WHERE movie_id = ? ORDER BY genre;'
    let movie = []

    try {
        [movie] = await connection.query(sql, id)
    } catch (err) {
        console.error(err)
    }

    if (movie.length == 0)
        return null
    
    let genres = []
    
    for (const m of movie)
        genres.push(m.genre)
    
    movie[0].genre = genres.join(', ')

    sql = 'SELECT AVG(rating) AS "rating" FROM reviews WHERE movie_id = ?;'
    let rating = []

    try {
        [rating] = await connection.query(sql, id)
    } catch (err) {
        console.error(err)
    }

    movie[0].rating = rating[0].rating
    
    await connection.end()
    return movie[0]
}

const getScreenings = async (movieId, city, date) => {
    const connection = await db.createConnection()
    sql = 'SELECT screening_id, time, is_3D, sound_type FROM screenings NATURAL JOIN cinemas NATURAL JOIN movies WHERE movie_id = ? AND city = ? AND date = ?;'
    let screenings = []

    try {
        [screenings] = await connection.query(sql, [movieId, city, date])
    } catch (err) {
        console.error(err)
    }

    await connection.end()
    return screenings
}

const getReviews = async (movieId) => {
    const connection = await db.createConnection()
    sql = 'SELECT rating, review, username FROM reviews NATURAL JOIN users WHERE movie_id = ?;'
    let reviews = []

    try {
        [reviews] = await connection.query(sql, movieId)
    } catch (err) {
        console.error(err)
    }
    
    await connection.end()
    return reviews
}

module.exports = {
    getMovie,
    getScreenings,
    getReviews,
}