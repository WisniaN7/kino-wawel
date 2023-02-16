let express = require('express');
let router = express.Router();

const adminController = require('../controllers/adminController')
const indexController = require('../controllers/indexController')
const movieController = require('../controllers/movieController')

router.get('/', async (req, res, next) => {
    req.session.user = { user_id: 1, username: 'admin', email: 'admin@kinowawel.pl', role: 'admin' } // TODO: Remove this line

    if (req.session.user && req.session.user.role != 'admin')
        res.redirect(req.headers.referer || '/') // TODO: Redirect to 404 page

    const movies = await adminController.getMoviesWithStatus()
    const cinemas = await indexController.getCinemas()
    res.render('admin', { movies: movies, cinemas: cinemas, user: req.session.user, host: req.hostname })
})

router.get('/filmy/edytuj/:id/?*', async (req, res, next) => {
    req.session.user = { user_id: 1, username: 'admin', email: 'admin@kinowawel.pl', role: 'admin' } // TODO: Remove this line

    if (req.session.user && req.session.user.role != 'admin')
        res.redirect(req.headers.referer || '/') // TODO: Redirect to 404 page
        
    const cinemas = await indexController.getCinemas()
    const movie = await movieController.getMovie(req.params.id)
    const genres = await adminController.getGenres()

    res.render('edit movie', { movie: movie, cinemas: cinemas, genres: genres, user: req.session.user, host: req.hostname })
})

router.post('/movies/archive', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.archiveMovie(req.body.movie_id)
    res.status(200).send()
})

router.delete('/movies/delete', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.deleteMovie(req.body.movie_id)
    res.status(200).send()
})

router.post('/movies/add', async (req, res, next) => { // TODO: file upload
    console.log(req.body);
    console.log(req.files);
    
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.addMovie(req.body.title, req.body.PG, req.body.duration, req.body.trailer, req.body.description, req.body.genres.split(', '))
    res.status(200).send()
})

router.post('/movies/edit', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.editMovie(req.body.movie, req.body.title, req.body.PG, req.body.duration, req.body.description, req.body.trailer, req.body.genres.split(', '))
    res.status(200).send()
})



router.get('/seanse/:city/*', async (req, res, next) => {
    req.session.user = { user_id: 1, username: 'admin', email: 'admin@kinowawel.pl', role: 'admin' } // TODO: Remove this line
    
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const movies = await adminController.getMovies()
    const cinemas = await indexController.getCinemas()
    let halls = 0

    for (const cinema of cinemas)
        if (cinema.cinema_id == req.params.city)
            halls = cinema.halls

    res.render('edit screenings', { movies: movies, cinemas: cinemas, halls: halls, user: req.session.user, host: req.hostname })
})

router.get('/screenings/get/:city/:date', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const repertoire = await adminController.getScreenings(req.params.city, req.params.date)
    res.status(200).json(repertoire)
})

router.post('/screenings/add', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const newScreening = await adminController.addScreening(req.body.movie_id, req.body.cinema_id, req.body.hall, req.body.date, req.body.time, req.body.is_3D, req.body.sound_type)
    res.status(200).json({ screening_id: newScreening.insertId })
})

router.post('/screenings/edit', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    console.log(req.body)
    await adminController.editScreening(req.body.screening_id, req.body.hall, req.body.time)
    res.status(200).send()
})

router.delete('/screenings', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.deleteScreening(req.body.id)
    res.status(200).send()
})

module.exports = router;
