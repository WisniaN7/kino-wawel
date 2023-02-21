let express = require('express')
let router = express.Router()

const userController = require('../controllers/userController')

router.get('/*/bilety', async (req, res, next) => {
    req.session.user = { user_id: 2, username: 'user', email: 'user@gmail.com', role: 'user' }

    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }

    const tickets = await userController.getTickets(req.session.user.user_id)

    if (!tickets) {
        res.render('tickets', {
            snackbar: { message: 'Wystąpił błąd podczas pobierania danych. Odśwież stronę lub skontatkuj się z administratorem serwisu.', type: 'error' },
            user: req.session.user, host: req.hostname
        })

        return
    }

    res.render('tickets', { tickets: tickets, user: req.session.user, host: req.hostname })
})

router.get('/*/recenzje', async (req, res, next) => {
    req.session.user = { user_id: 2, username: 'user', email: 'user@gmail.com', role: 'user' }

    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }
        
    const reviews = await userController.getReviews(req.session.user.user_id)

    if (!reviews) {
        res.render('reviews', {
            snackbar: { message: 'Wystąpił błąd podczas pobierania danych. Odśwież stronę lub skontatkuj się z administratorem serwisu.', type: 'error' },
            user: req.session.user, host: req.hostname
        })

        return
    }

    res.render('reviews', { reviews: reviews, user: req.session.user, host: req.hostname })
})

router.get('/*/obejrzane', async (req, res, next) => {
    req.session.user = { user_id: 2, username: 'user', email: 'user@gmail.com', role: 'user' }

    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }
                
    const movies = await userController.getWatched(req.session.user.user_id)

    if (!movies) {
        res.render('watched', {
            snackbar: { message: 'Wystąpił błąd podczas pobierania danych. Odśwież stronę lub skontatkuj się z administratorem serwisu.', type: 'error' },
            user: req.session.user, host: req.hostname
        })

        return
    }

    res.render('watched', { movies: movies, user: req.session.user, host: req.hostname })
})

router.get('/*/recenzje/nowa/:id', async (req, res, next) => {
    req.session.user = { user_id: 2, username: 'user', email: 'user@gmail.com', role: 'user' }

    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }

    if (await userController.checkIfWatched(req.session.user.user_id, req.params.id) == false) {
        res.redirect('/' + req.session.user.username + '/recenzje?status=20')
        return
    }

    const movie = await userController.getMovie(req.params.id)

    if (!movie) {
        res.render('edit review', {
            snackbar: { message: 'Wystąpił błąd podczas pobierania danych. Odśwież stronę lub skontatkuj się z administratorem serwisu.', type: 'error' },
            editMode: false, user: req.session.user, host: req.hostname
        })

        return
    }

    res.render('edit review', { editMode: false, movie: movie, user: req.session.user, host: req.hostname })
})

router.get('/*/recenzje/edytuj/:id', async (req, res, next) => {
    req.session.user = { user_id: 2, username: 'user', email: 'user@gmail.com', role: 'user' }

    if (req.session.user == undefined) {
        res.redirect('/logowanie?status=17')
        return
    }

    const review = await userController.getReview(req.params.id)

    if (!review) {
        res.render('edit review', {
            snackbar: { message: 'Wystąpił błąd podczas pobierania danych. Odśwież stronę lub skontatkuj się z administratorem serwisu.', type: 'error' },
            editMode: true, user: req.session.user, host: req.hostname
        })

        return
    }
    
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