let express = require('express');
let router = express.Router();

const repertoireController = require('../controllers/repertoireController')

router.get('/', (req, res, next) => {
    res.render('repertoire', { user: req.session.user, host: req.hostname })
})

router.get('/:city/:date', async (req, res, next) => {
    const ret = await repertoireController.getRepertoire(req.params.city, req.params.date)

    if (ret)
        res.status(200).json(ret)
    else
        res.status(500).send()
})

router.get('/fill', async (req, res, next) => {
    // req.session.user = { user_id: 1, username: 'admin', email: 'admin@kinowawel.pl', role: 'admin' }

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
