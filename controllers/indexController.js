const db = require('./database')

const getHeroMovies = async () => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM movies WHERE archived = 0 ORDER BY movie_id DESC LIMIT 3;'
    let heroMovies = []

    try {
        [heroMovies] = await connection.query(sql)
    } catch (err) {
        console.error(err)
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
    }
    
    await connection.end()
    return cinemas
}

module.exports = {
    getHeroMovies,
    getCinemas,
}