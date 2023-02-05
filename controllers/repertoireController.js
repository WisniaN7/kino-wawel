const db = require('./database');

async function getRepertoire(city, date) {
    const connection = await db.createConnection()

    let data = []

    let sql = 'SELECT movie_id, title, rating, age_rating, duration, description FROM screenings NATURAL JOIN movies NATURAL JOIN cinemas WHERE city = ? AND date = ? GROUP BY movie_id;'
    let movies = await connection.query(sql, [city, date])
    
    for (let movie of movies[0]) {
        sql = 'SELECT genre FROM genres NATURAL JOIN movie_genres WHERE movie_id = ?;'
        let genresQuery = await connection.query(sql, movie.movie_id)
        let genres = []
        
        genresQuery[0].forEach(genre => {
            genres.push(genre.genre)
        })
        
        genres.sort()
        let entry = { movie: movie, screenings: [] }
        entry.movie.genres = genres.join(', ')

        sql = 'SELECT screening_id, time, is_3D, sound_type FROM screenings NATURAL JOIN cinemas NATURAL JOIN movies WHERE city = ? AND date = ? AND movie_id = ?;'
        let screenings = await connection.execute(sql, [city, date, movie.movie_id])
        
        for (let screening of screenings[0])
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

                    let sql = "INSERT INTO `screenings` VALUES (NULL, " + movie + ", " + cinema + ", " + hall + ", '" + date.toISOString().split('T')[0] + "', '" + time.toISOString().split('T')[1].split('.')[0] + "', '" + Math.floor(Math.random() * 2) + "', '" + soundType + "')"
                    await connection.execute(sql)

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