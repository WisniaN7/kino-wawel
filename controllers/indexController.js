// TODO: Discounts

const db = require('./database');

async function getHeroMovies() {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM movies ORDER BY movie_id DESC LIMIT 3;'
    const heroMovies = await connection.execute(sql)
    return heroMovies[0]
}

async function getCinemas() {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM cinemas ORDER BY city;'
    const ticketTypes = await connection.execute(sql)
    return ticketTypes[0]
}

module.exports = {
    getHeroMovies,
    getCinemas,
}