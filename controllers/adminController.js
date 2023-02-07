const db = require('./database')

const getMovies = async () => {
    const connection = await db.createConnection()
    let sql = 'SELECT * FROM movies;'
    const [movies] = await connection.query(sql)
    
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

    return movies
}

const archiveMovie = async (movie_id) => {
    const connection = await db.createConnection()
    const sql = 'UPDATE movies SET archived = 1 WHERE movie_id = ?;'
    await connection.query(sql, movie_id)
}

const deleteMovie = async (movie_id) => {
    const connection = await db.createConnection()
    const sql = 'DELETE FROM movies WHERE movie_id = ?;'
    await connection.query(sql, movie_id)
}

const addMovie = async (title, age_rating, duration, trailer, description, genres) => {
    const connection = await db.createConnection()
    let sql = 'INSERT INTO movies VALUES (NULL, ?, ?, ?, ?, ?, 0);'
    const [movieId] = await connection.query(sql, [title, age_rating, duration, trailer, description])

    for (const genre of genres) {
        sql = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, (SELECT genre_id FROM genres WHERE genre = ?));'
        await connection.query(sql, [movieId.insertId, genre])
    }
}

const editMovie = async (movieId, title, age_rating, duration, description, trailer, genres) => {
    const connection = await db.createConnection()
    let sql = 'UPDATE movies SET title = ?, age_rating = ?, duration = ?, description = ?, trailer = ? WHERE movie_id = ?;'
    await connection.query(sql, [title, age_rating, duration, description, trailer, movieId])

    sql = 'DELETE FROM movie_genres WHERE movie_id = ?;'
    await connection.query(sql, movieId)

    for (const genre of genres) {
        sql = 'INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, (SELECT genre_id FROM genres WHERE genre = ?));'
        await connection.query(sql, [movieId, genre])
    }
}

const getGenres = async () => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM genres;'
    const [genres] = await connection.query(sql)
    return genres
}

module.exports = {
    getMovies,
    archiveMovie,
    deleteMovie,
    addMovie,
    editMovie,
    getGenres,
}
