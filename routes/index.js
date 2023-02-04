var express = require('express')
var router = express.Router()

const db = require('../controllers/database')

router.get('/', async (req, res, next) => {
    const connection = await db.createConnection()
    let movies = await connection.execute('SELECT * FROM movies ORDER BY movie_id DESC LIMIT 3;')
    res.render('index', { data: movies[0], title: 'Kino Wawel' })
})

module.exports = router