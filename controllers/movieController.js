const db = require('./database')

async function getMovie(id) {
    const connection = await db.createConnection()

    sql = 'SELECT title, age_rating, duration, description, genre FROM movies NATURAL JOIN movie_genres NATURAL JOIN genres WHERE movie_id = ? ORDER BY genre;'
    const movie = await connection.query(sql, id)
    
    let genres = []
    
    for (const m of movie[0])
        genres.push(m.genre)
    
    movie[0][0].genre = genres.join(', ')

    sql = 'SELECT AVG(rating) AS "rating" FROM reviews WHERE movie_id = ?;'
    const rating = await connection.query(sql, id)
    movie[0][0].rating = rating[0][0].rating
    
    return movie[0][0]
}

async function getScreenings(movieId, city, date) {
    const connection = await db.createConnection()
    sql = 'SELECT screening_id, time, is_3D, sound_type FROM screenings NATURAL JOIN cinemas NATURAL JOIN movies WHERE movie_id = ? AND city = ? AND date = ?;'
    const screenings = await connection.query(sql, [movieId, city, date])
    return screenings[0]
}

async function getReviews(movieId) {
    const connection = await db.createConnection()
    sql = 'SELECT rating, review, username FROM reviews NATURAL JOIN users WHERE movie_id = ?;'
    const reviews = await connection.query(sql, movieId)
    return reviews[0]
}

module.exports = {
    getMovie,
    getScreenings,
    getReviews,
}