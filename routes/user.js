let express = require('express')
let router = express.Router()

const userController = require('../controllers/userController')

router.get('/:user/bilety', async (req, res, next) => {
    const tickets = await userController.getTickets(req.session.user.user_id)
    res.render('tickets', { tickets: tickets, user: req.session.user })
})

router.get('/:user/recenzje', async (req, res, next) => {
    const reviews = await userController.getReviews(req.session.user.user_id)
    res.render('reviews', { reviews: reviews, user: req.session.user })
})

router.get('/:user/obejrzane', async (req, res, next) => {
    const movies = await userController.getWatched(req.session.user.user_id)
    res.render('watched', { movies: movies, user: req.session.user })
})

router.get('/:user/recenzje/:mode/:id', async (req, res, next) => {
    const review = await userController.getReview(req.params.id)
    review.edit = req.params.mode == 'edytuj'
    res.render('edit review', { review: review, user: req.session.user })
})

router.post('/reviews/rating', async (req, res, next) => {
    await userController.updateRating(req.session.user.user_id, req.body.movieId, req.body.rating)
    res.status(200).send()
})

router.post('/reviews/review', async (req, res, next) => {
    await userController.updateReview(req.session.user.user_id, req.body.movieId, req.body.rating, req.body.review)
    res.redirect('/' + req.session.user.username + '/recenzje')
})

module.exports = router