let express = require('express')
let router = express.Router()

const db = require('../controllers/database')
const indexController = require('../controllers/indexController')

router.get('/', async (req, res, next) => {
    const movies = await indexController.getHeroMovies()
    res.render('index', { movies: movies, user: req.session.user })
})

router.get('/wydarzenia', (req, res, next) => {
    res.render('events', { user: req.session.user })
})

router.get('/kontakt', async (req, res, next) => {
    const cinemas = await indexController.getCinemas()
    res.render('contact', { cinemas: cinemas, user: req.session.user })
})

module.exports = router