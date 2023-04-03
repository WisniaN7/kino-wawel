let express = require('express')
let router = express.Router()

const indexController = require('../controllers/indexController')

router.get('/', async (req, res, next) => {
    console.log(req.protocol);

    const movies = await indexController.getHeroMovies()

    if (!movies) {
        res.render('index', {
            snackbar: { message: 'Wystąpił błąd przy pobieraniu danych, odśwież stronę lub skontaktuj się z administratorem serwisu.', type: 'error', duration: 'long' },
            user: req.session.user, host: req.headers.host, protocol: req.protocol
        })

        return
    }

    for (const movie of movies)
        movie.status = await indexController.isMoviePlayed(movie.movie_id)

    res.render('index', { movies: movies, user: req.session.user, host: req.headers.host, protocol: req.protocol })
})

router.get('/wydarzenia', (req, res, next) => {
    res.render('events', { user: req.session.user, host: req.headers.host, protocol: req.protocol })
})

router.get('/kontakt', async (req, res, next) => {
    const cinemas = await indexController.getCinemas()

    if (!cinemas) {
        res.render('contact', {
            snackbar: { message: 'Wystąpił błąd przy pobieraniu danych, odśwież stronę lub skontaktuj się z administratorem serwisu.', type: 'error', duration: 'long' },
            user: req.session.user, host: req.headers.host, protocol: req.protocol
        })

        return
    }

    res.render('contact', { cinemas: cinemas, user: req.session.user, host: req.headers.host, protocol: req.protocol })
})

module.exports = router