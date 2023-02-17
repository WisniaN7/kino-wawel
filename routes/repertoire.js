let express = require('express');
let router = express.Router();

const repertoireController = require('../controllers/repertoireController')

router.get('/', (req, res, next) => {
    res.render('repertoire', { user: req.session.user, host: req.hostname })
})

router.get('/:city/:date', async (req, res, next) => {
    const ret = await repertoireController.getRepertoire(req.params.city, req.params.date)
    res.status(200).send(ret)
})

router.get('/fill', async (req, res, next) => {
    if (!req.session.user || req.session.user && req.session.user.role != 'admin') {
        res.locals.message = 'Not Found'
        res.locals.error = { status: 404 }
        res.status(404)
        res.render('error', { user: req.session.user, host: req.hostname })
        return
    }

    await repertoireController.randomFillDatabase()
    res.redirect('/')
})

module.exports = router;
