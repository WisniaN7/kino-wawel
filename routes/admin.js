let express = require('express');
let router = express.Router();

const adminController = require('../controllers/adminController')
const indexController = require('../controllers/indexController')
const movieController = require('../controllers/movieController')

router.get('/', async (req, res, next) => {
    req.session.user = { user_id: 1, username: 'admin', email: 'admin@kinowawel.pl', role: 'admin' } // TODO: Remove this line

    if (req.session.user && req.session.user.role != 'admin')
        res.redirect(req.headers.referer || '/') // TODO: Redirect to 404 page

    const movies = await adminController.getMovies()
    const cinemas = await indexController.getCinemas()
    res.render('admin', { movies: movies, cinemas: cinemas, user: req.session.user })
})

router.get('/filmy/edytuj/:id/?*', async (req, res, next) => {
    req.session.user = { user_id: 1, username: 'admin', email: 'admin@kinowawel.pl', role: 'admin' } // TODO: Remove this line

    if (req.session.user && req.session.user.role != 'admin')
        res.redirect(req.headers.referer || '/') // TODO: Redirect to 404 page
        
    const cinemas = await indexController.getCinemas()
    const movie = await movieController.getMovie(req.params.id)
    const genres = await adminController.getGenres()

    res.render('edit movie', { movie: movie, cinemas: cinemas, genres: genres, user: req.session.user })
})

router.post('/archive', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.archiveMovie(req.body.movie_id)
    res.status(200).send()
})

router.delete('/delete', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.deleteMovie(req.body.movie_id)
    res.status(200).send()
})

router.post('/add', async (req, res, next) => {
    console.log(req.body);
    console.log(req.files);
    
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.addMovie(req.body.title, req.body.PG, req.body.duration, req.body.trailer, req.body.description, req.body.genres.split(', '))
    res.status(200).send()
})

router.post('/edit', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.editMovie(req.body.movie, req.body.title, req.body.PG, req.body.duration, req.body.description, req.body.trailer, req.body.genres.split(', '))
    res.status(200).send()
})

module.exports = router;
