const db = require('./database')

const getRepertoire = async (city, date) => {
    const connection = await db.createConnection()

    let data = []

    let sql = 'SELECT movie_id, title, rating, age_rating, duration, description, AVG(rating) AS "rating" FROM screenings NATURAL JOIN movies NATURAL JOIN cinemas NATURAL JOIN reviews WHERE city = ? AND date = ? GROUP BY movie_id;'
    let movies = []
    
    try {
        [movies] = await connection.query(sql, [city, date])
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }
    
    for (let movie of movies) {
        sql = 'SELECT genre FROM genres NATURAL JOIN movie_genres WHERE movie_id = ? ORDER BY genre;'
        let genres = []
        
        try {
            [genres] = await connection.query(sql, movie.movie_id)
        } catch (err) {
            console.error(err)
            await connection.end()
            return null
        }
        
        movie.genres = genres.map(genre => genre.genre).join(', ')

        let entry = { movie: movie, screenings: [] }

        sql = 'SELECT screening_id, time, is_3D, sound_type, hall FROM screenings NATURAL JOIN cinemas NATURAL JOIN movies WHERE city = ? AND date = ? AND movie_id = ?;'
        let screenings = []
        
        try {
            [screenings] = await connection.query(sql, [city, date, movie.movie_id])
        } catch (err) {
            console.error(err)
            await connection.end()
            return null
        }
        
        for (let screening of screenings)
            entry.screenings.push(screening)

        data.push(entry)
    }

    await connection.end()
    return data
}

const randomFillDatabase = async () => {
    const connection = await db.createConnection()

    try {
        await connection.execute('DELETE FROM screenings;')
    } catch (err) {
        console.error(err)
    }

    try {
        await connection.execute('ALTER TABLE screenings AUTO_INCREMENT = 0;')
    } catch (err) {
        console.error(err)
    }

    let durations = []

    try {
        [durations] = await connection.execute('SELECT duration FROM movies;')
    } catch (err) {
        console.error(err)
    }
    
    let date = new Date('2023-01-01')
    const endDate = new Date('2023-04-01')
    const endTime = new Date('1970-01-01T23:30:00')
    
    const movies = durations.length
    let movieDurations = []

    for (const duration of durations)
        movieDurations.push(Math.ceil((duration.duration + 60) / 30))

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

                    if (time.getTime() + (movieDurations[movie - 1] * 30 * 60 * 1000) > endTime.getTime())
                        break

                    let soundType = soundTypes[Math.floor(Math.random() * 2)]

                    let sql = "INSERT INTO `screenings` VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)"

                    try {
                        await connection.query(sql, [movie, cinema, hall, date.toISOString().slice(0, 10), time.toISOString().slice(11, 19), Math.floor(Math.random() * 2), soundType])
                    } catch (err) {
                        console.error(err)
                    }

                    time.setTime(time.getTime() + (movieDurations[movie - 1] * 30 * 60 * 1000))
                    console.log(i++)
                }
            }
        }

        date.setDate(date.getDate() + 1)
    }

    await connection.end()
}

module.exports = {
    getRepertoire,
    randomFillDatabase,
}