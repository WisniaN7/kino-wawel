let express = require('express');
let router = express.Router();

const indexController = require('../controllers/indexController')
const movieController = require('../controllers/movieController')

router.get('/screenings/:id/:city/:date/', async (req, res, next) => {
    const screenings = await movieController.getScreenings(req.params.id, req.params.city, req.params.date)
    res.status(200).json(screenings)
})

router.get('/:id/:city/:date/*', async (req, res, next) => {
    const movie = await movieController.getMovie(req.params.id)
    const cinemas = await indexController.getCinemas()
    const reviews = await movieController.getReviews(req.params.id)
    
    res.render('movie', { 
        city: req.params.city,
        date: req.params.date,
        movie: movie,
        cinemas: cinemas,
        reviews: reviews,
        user: req.session.user,
        host: req.hostname
    })
})

module.exports = router;
