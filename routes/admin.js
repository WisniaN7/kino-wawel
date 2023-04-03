let express = require('express')
let router = express.Router()

const multer = require('multer')

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../public/images/' + (file.fieldname == 'poster' ? 'posters' : 'background'))
    },
    filename: (req, file, cb) => {
        cb(null, req.body.title.replaceAll(/[^a-zA-Z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż/ .]/g, '') + '.jpg' /* +  file.mimetype.split('/')[1] */)
    }
})

const uploads = multer({ storage: storage }).fields([{ name: 'poster', maxCount: 1 }, { name: 'bgImage', maxCount: 1 }])

const adminController = require('../controllers/adminController')
const indexController = require('../controllers/indexController')
const movieController = require('../controllers/movieController')

const redirectTo404 = (req, res, next) => {
    res.locals.message = 'Not Found'
    res.locals.error = { status: 404 }
    res.status(404)
    res.render('error', { user: req.session.user, host: req.rawHeaders[1] })
}

router.get('/', async (req, res, next) => {
    if (!req.session.user || req.session.user && req.session.user.role != 'admin') {
        redirectTo404(req, res, next)
        return
    }

    const movies = await adminController.getMoviesWithStatus()
    const cinemas = await indexController.getCinemas()
    
    if (!movies || !cinemas) {
        res.render('admin', {
            snackbar: { message: 'Wystąpił błąd przy pobieraniu danych, odśwież stronę lub skontaktuj się z administratorem.', type: 'error', duration: 'long' },
            user: req.session.user, host: req.rawHeaders[1]
        })
        
        return
    }

    res.render('admin', { movies: movies, cinemas: cinemas, user: req.session.user, host: req.rawHeaders[1] })
})

router.get('/filmy/edytuj/:id/?*', async (req, res, next) => {
    if (!req.session.user || req.session.user && req.session.user.role != 'admin') {
        redirectTo404(req, res, next)
        return
    }
    
    let movie

    if (req.params.id != 'nowy')
        movie = await movieController.getMovie(req.params.id)

    const genres = await adminController.getGenres()
    const cinemas = await indexController.getCinemas()

    if ((req.params.id == 'nowy' && !movie) || !genres || !cinemas) {
        res.render('admin', {
            snackbar: { message: 'Wystąpił błąd przy pobieraniu danych, odśwież stronę lub skontaktuj się z administratorem.', type: 'error', duration: 'long' },
            user: req.session.user, host: req.rawHeaders[1]
        })

        return
    }

    res.render('edit movie', { movie: movie, cinemas: cinemas, genres: genres, user: req.session.user, host: req.rawHeaders[1] })
})

router.post('/movies/archive', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const movieArchived = await adminController.archiveMovie(req.body.movie_id)
    res.status(movieArchived ? 200 : 500).send()
})

router.delete('/movies/delete', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const movieDeleted = await adminController.deleteMovie(req.body.movie_id)
    res.status(movieDeleted ? 200 : 500).send()
})

router.post('/movies/add', uploads, async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const movieAdded = await adminController.addMovie(req.body.title, req.body.PG, req.body.duration, req.body.trailer, req.body.description, req.body.genres.split(', '))
    res.status(movieAdded ? 200 : 500).send()
})

router.post('/movies/edit', uploads, async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const movieEdited = await adminController.editMovie(req.body.movie, req.body.title, req.body.PG, req.body.duration, req.body.description, req.body.trailer, req.body.genres.split(', '))
    res.status(movieEdited ? 200 : 500).send()
})



router.get('/seanse/:city/*', async (req, res, next) => {
    if (!req.session.user || req.session.user && req.session.user.role != 'admin') {
        redirectTo404(req, res, next)
        return
    }

    const movies = await adminController.getMovies()
    const cinemas = await indexController.getCinemas()

    if (!movies || !cinemas) {
        res.render('edit screenings', {
            snackbar: { message: 'Wystąpił błąd przy pobieraniu danych, odśwież stronę lub skontaktuj się z administratorem.', type: 'error', duration: 'long' },
            user: req.session.user, host: req.rawHeaders[1]
        })

        return
    }

    let halls = 0

    for (const cinema of cinemas)
        if (cinema.cinema_id == req.params.city)
            halls = cinema.halls

    res.render('edit screenings', { movies: movies, cinemas: cinemas, halls: halls, user: req.session.user, host: req.rawHeaders[1] })
})

router.get('/screenings/get/:city/:date', async (req, res, next) => {
    if (!req.session.user || req.session.user && req.session.user.role != 'admin') {
        redirectTo404(req, res, next)
        return
    }

    const repertoire = await adminController.getScreenings(req.params.city, req.params.date)

    if (repertoire)
        res.status(200).json(repertoire)
    else
        res.status(500).send()
})

router.post('/screenings/add', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const newScreening = await adminController.addScreening(req.body.movie_id, req.body.cinema_id, req.body.hall, req.body.date, req.body.time, req.body.is_3D, req.body.sound_type)
    
    if (newScreening)
        res.status(200).json({ screening_id: newScreening.insertId })
    else
        res.status(500).send()
})

router.post('/screenings/edit', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const screeningEdited = await adminController.editScreening(req.body.screening_id, req.body.hall, req.body.time)
    res.status(screeningEdited ? 200 : 500).send()
})

router.delete('/screenings', async (req, res, next) => {
    if (req.session.user && req.session.user.role != 'admin')
        res.status(403).send()

    const screningDeleted = await adminController.deleteScreening(req.body.id)
    res.status(screningDeleted ? 200 : 500).send()
})

module.exports = router;
