const db = require('./database')

const getHeroMovies = async () => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM movies WHERE archived = 0 ORDER BY movie_id DESC LIMIT 3;'
    let heroMovies = []

    try {
        [heroMovies] = await connection.query(sql)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }
    
    await connection.end()
    return heroMovies
}

const getCinemas = async () => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM cinemas ORDER BY city;'
    let cinemas = []

    try {
        [cinemas] = await connection.query(sql)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }
    
    await connection.end()
    return cinemas
}

const isMoviePlayed = async (movieId) => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM screenings WHERE movie_id = ? AND date >= CURDATE() ORDER BY date ASC LIMIT 1;'
    let screening = []

    try {
        [screening] = await connection.query(sql, [movieId])
    } catch (err) {
        console.error(err)
        await connection.end()
        return false
    }

    await connection.end()
    return screening.length > 0
}

module.exports = {
    getHeroMovies,
    getCinemas,
    isMoviePlayed,
}