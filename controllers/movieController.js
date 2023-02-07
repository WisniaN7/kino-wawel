const db = require('./database')

async function getMovie(id) {
    const connection = await db.createConnection()

    sql = 'SELECT * FROM movies NATURAL JOIN movie_genres NATURAL JOIN genres WHERE movie_id = ? ORDER BY genre;'
    const [movie] = await connection.query(sql, id)

    if (movie.length == 0)
        return null
    
    let genres = []
    
    for (const m of movie)
        genres.push(m.genre)
    
    movie[0].genre = genres.join(', ')

    sql = 'SELECT AVG(rating) AS "rating" FROM reviews WHERE movie_id = ?;'
    const [rating] = await connection.query(sql, id)
    movie[0].rating = rating[0].rating
    
    return movie[0]
}

async function getScreenings(movieId, city, date) {
    const connection = await db.createConnection()
    sql = 'SELECT screening_id, time, is_3D, sound_type FROM screenings NATURAL JOIN cinemas NATURAL JOIN movies WHERE movie_id = ? AND city = ? AND date = ?;'
    const [screenings] = await connection.query(sql, [movieId, city, date])
    return screenings
}

async function getReviews(movieId) {
    const connection = await db.createConnection()
    sql = 'SELECT rating, review, username FROM reviews NATURAL JOIN users WHERE movie_id = ?;'
    const [reviews] = await connection.query(sql, movieId)
    return reviews
}

module.exports = {
    getMovie,
    getScreenings,
    getReviews,
}