const db = require('./database')

const getMovies = async () => {
    const connection = await db.createConnection()
    let sql = 'SELECT * FROM movies WHERE archived = 0;'
    let movies = []

    try {
        [movies] = await connection.query(sql)
    } catch (err) {
        console.error(err)
    }

    await connection.end()
    return movies
}

const getMoviesWithStatus = async () => {
    const connection = await db.createConnection()
    let sql = 'SELECT * FROM movies;'
    let movies = []

    try {
        [movies] = await connection.query(sql)
    } catch (err) {
        console.error(err)
    }
    
    for (const movie of movies) {
        sql = 'SELECT genre FROM genres NATURAL JOIN movie_genres WHERE movie_id = ? ORDER BY genre;'
        const [genres] = await connection.query(sql, movie.movie_id)
        movie.genres = genres.map(genre => genre.genre).join(', ')

        sql = 'SELECT COUNT(*) = 0 as "noScreenigs" FROM screenings WHERE movie_id = ?;'
        const [noScreenigs] = await connection.query(sql, movie.movie_id)

        if (movie.archived) {
            movie.status = 'archived'
            movie.statusLocalized = 'Zarchiwizowany'
            continue
        }

        if (noScreenigs[0].noScreenigs) {
            movie.status = 'no-screenings'
            movie.statusLocalized = 'Brak seansów'
            continue
        }

        sql = 'SELECT COUNT(CURRENT_TIMESTAMP < date) AS "before" FROM screenings WHERE movie_id = ? AND CURRENT_TIMESTAMP < date;'
        const [before] = await connection.query(sql, movie.movie_id)

        sql = 'SELECT COUNT(CURRENT_TIMESTAMP > date) AS "after" FROM screenings WHERE movie_id = ? AND CURRENT_TIMESTAMP > date;'
        const [after] = await connection.query(sql, movie.movie_id)
        
        if (before[0].before && after[0].after) {
            movie.status = 'playing'
            movie.statusLocalized = 'Grany'
            continue
        } else if (before[0].before) {
            movie.status = 'pre-premiere'
            movie.statusLocalized = 'Przed premierą'
            continue
        } else if (after[0].after) {
            movie.status = 'not-playing'
            movie.statusLocalized = 'Nie grany'
            continue
        }
    }

    await connection.end()
    return movies
}

const getScreenings = async (cinemaId, date) => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM screenings NATURAL JOIN movies WHERE cinema_id = ? AND date = ?;'
    let screenings = []

    try {
        [screenings] = await connection.query(sql, [cinemaId, date])
    } catch (err) {
        console.error(err)
    }

    await connection.end()
    return screenings
}

const archiveMovie = async (movie_id) => {
    const connection = await db.createConnection()
    const sql = 'UPDATE movies SET archived = 1 WHERE movie_id = ?;'

    try {
        await connection.query(sql, movie_id)
    } catch (err) {
        console.error(err)
    }

    await connection.end()
}

const deleteMovie = async (movie_id) => {
    const connection = await db.createConnection()
    const sql = 'DELETE FROM movies WHERE movie_id = ?;'

    try {
        await connection.query(sql, movie_id)
    } catch (err) {
        console.error(err)
    }

    await connection.end()
}

const addMovie = async (title, age_rating, duration, trailer, description, genres) => {
    const connection = await db.createConnection()
    let sql = 'INSERT INTO movies VALUES (NULL, ?, ?, ?, ?, ?, 0);'
    let movieId = []

    try {
        [movieId] = await connection.query(sql, [title, age_rating, duration, trailer, description])
    } catch (err) {
        console.error(err)
    }

    for (const genre of genres) {
        sql = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, (SELECT genre_id FROM genres WHERE genre = ?));'

        try {
            await connection.query(sql, [movieId.insertId, genre])
        } catch (err) {
            console.error(err)
        }
    }

    await connection.end()
}

const editMovie = async (movieId, title, age_rating, duration, description, trailer, genres) => {
    const connection = await db.createConnection()
    let sql = 'UPDATE movies SET title = ?, age_rating = ?, duration = ?, description = ?, trailer = ? WHERE movie_id = ?;'

    try {
        await connection.query(sql, [title, age_rating, duration, description, trailer, movieId])
    } catch (err) {
        console.error(err)
    }

    sql = 'DELETE FROM movie_genres WHERE movie_id = ?;'
    
    try {
        await connection.query(sql, movieId)
    } catch (err) {
        console.error(err)
    }

    for (const genre of genres) {
        sql = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, (SELECT genre_id FROM genres WHERE genre = ?));'

        try {
            await connection.query(sql, [movieId, genre])
        } catch (err) {
            console.error(err)
        }
    }

    await connection.end()
}

const getGenres = async () => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM genres;'
    let genres = []

    try {
        [genres] = await connection.query(sql)
    } catch (err) {
        console.error(err)
    }

    await connection.end()
    return genres
}

const addScreening = async (movie_id, cinema_id, hall, date, time, is_3D, sound_type) => {
    console.log(date);

    const connection = await db.createConnection()
    const sql = 'INSERT INTO screenings VALUES (NULL, ?, ?, ?, ?, ?, ?, ?);'
    let newScreening = []

    try {
        [newScreening] = await connection.query(sql, [movie_id, cinema_id, hall, date, time, +is_3D, sound_type])
    } catch (err) {
        console.error(err)
    }

    await connection.end()
    return newScreening
}

const editScreening = async (screening_id, hall, time) => {
    const connection = await db.createConnection()
    const sql = 'UPDATE screenings SET hall = ?, time = ? WHERE screening_id = ?;'

    try {
        await connection.query(sql, [hall, time, screening_id])
    } catch (err) {
        console.error(err)
    }
    
    await connection.end()
}

const deleteScreening = async (screeningId) => {
    const connection = await db.createConnection()
    const sql = 'DELETE FROM screenings WHERE screening_id = ?;'

    try {
        await connection.query(sql, screeningId)
    } catch (err) {
        console.error(err)
    }
    
    await connection.end()
}

module.exports = {
    getMovies,
    getMoviesWithStatus,
    archiveMovie,
    deleteMovie,
    addMovie,
    editMovie,
    getGenres,
    getScreenings,
    addScreening,
    editScreening,
    deleteScreening,
}
