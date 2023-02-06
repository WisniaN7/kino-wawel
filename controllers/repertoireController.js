const db = require('./database')

async function getRepertoire(city, date) {
    const connection = await db.createConnection()

    let data = []

    let sql = 'SELECT movie_id, title, rating, age_rating, duration, description, AVG(rating) AS "rating" FROM screenings NATURAL JOIN movies NATURAL JOIN cinemas NATURAL JOIN reviews WHERE city = ? AND date = ? GROUP BY movie_id;'
    let [movies] = await connection.query(sql, [city, date])
    
    for (let movie of movies) {
        sql = 'SELECT genre FROM genres NATURAL JOIN movie_genres WHERE movie_id = ? ORDER BY genre;'
        let [genres] = await connection.query(sql, movie.movie_id)
        movie.genres = genres.map(genre => genre.genre).join(', ')

        let entry = { movie: movie, screenings: [] }

        sql = 'SELECT screening_id, time, is_3D, sound_type FROM screenings NATURAL JOIN cinemas NATURAL JOIN movies WHERE city = ? AND date = ? AND movie_id = ?;'
        let [screenings] = await connection.query(sql, [city, date, movie.movie_id])
        
        for (let screening of screenings)
            entry.screenings.push(screening)

        data.push(entry)
    }

    return data
}

async function randomFillDatabase() {
    const connection = await db.createConnection()

    await connection.execute('DELETE FROM screenings;')
    await connection.execute('ALTER TABLE screenings AUTO_INCREMENT = 0;')

    let date = new Date('2023-01-01')
    const endDate = new Date('2023-04-01')
    const endTime = new Date('1970-01-01T23:30:00')

    const movies = 4
    const movieDurations = [5, 8, 5, 5] // Ceil in half hours for example: ceil(147 min / 30 min) == 5
    const cinemas = 5
    const cinemaHalls = [3, 2, 4, 1, 4]
    const soundTypes = ['Dubbing', 'Napisy']

    let i = 0

    while (date < endDate) {
        for (let cinema = 1; cinema <= cinemas; cinema++) {
            for (let hall = 1; hall <= cinemaHalls[cinema - 1]; hall++) {
                let time = new Date('1970-01-01T10:00:00')

                while (time < endTime) {
                    let offset = Math.floor(Math.random() * 4)
                    time.setTime(time.getTime() + (offset * 30 * 60 * 1000))

                    let movie = Math.floor(Math.random() * movies) + 1
                    let soundType = soundTypes[Math.floor(Math.random() * 2)]

                    let sql = "INSERT INTO `screenings` VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)"
                    await connection.query(sql, [movie, cinema, hall, date.toISOString().slice(0, 10), time.toISOString().slice(11, 19), Math.floor(Math.random() * 2), soundType])

                    time.setTime(time.getTime() + (movieDurations[movie] * 30 * 60 * 1000))

                    console.log(i++)
                }
            }
        }

        date.setDate(date.getDate() + 1)
    }
}

module.exports = {
    getRepertoire,
    randomFillDatabase,
}