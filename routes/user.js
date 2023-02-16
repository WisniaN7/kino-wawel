let express = require('express')
let router = express.Router()

const userController = require('../controllers/userController')

router.get('/*/bilety', async (req, res, next) => {
    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }

    const tickets = await userController.getTickets(req.session.user.user_id)
    res.render('tickets', { tickets: tickets, user: req.session.user, host: req.hostname })
})

router.get('/*/recenzje', async (req, res, next) => {
    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }
        
    const reviews = await userController.getReviews(req.session.user.user_id)
    res.render('reviews', { reviews: reviews, user: req.session.user, host: req.hostname })
})

router.get('/*/obejrzane', async (req, res, next) => {
    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }
                
    const movies = await userController.getWatched(req.session.user.user_id)
    res.render('watched', { movies: movies, user: req.session.user, host: req.hostname })
})

router.get('/*/recenzje/nowa/:id', async (req, res, next) => {
    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }

    const movie = await userController.getMovie(req.params.id)
    res.render('edit review', { editMode: false, movie: movie, user: req.session.user, host: req.hostname })
})

router.get('/*/recenzje/edytuj/:id', async (req, res, next) => {
    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }

    const review = await userController.getReview(req.params.id)
    res.render('edit review', { editMode: true, review: review, user: req.session.user, host: req.hostname })
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