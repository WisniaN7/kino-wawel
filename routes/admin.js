let express = require('express');
let router = express.Router();

const adminController = require('../controllers/adminController')
const indexController = require('../controllers/indexController')

router.get('/', async (req, res, next) => {
    req.session.user = { user_id: 1, username: 'admin', email: 'admin@kinowawel.pl', role: 'admin' } // TODO: Remove this line

    if (req.session.user && req.session.user.role != 'admin')
        res.redirect(req.headers.referer || '/') // TODO: Redirect to 404 page

    const movies = await adminController.getMovies()
    const cinemas = await indexController.getCinemas()
    res.render('admin', { movies: movies, cinemas: cinemas, user: req.session.user })
})

router.post('/archive', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.archiveMovie(req.body.movie_id)
    res.status(200).send()
})

router.post('/delete', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    await adminController.deleteMovie(req.body.movie_id)
    res.status(200).send()
})

module.exports = router;
