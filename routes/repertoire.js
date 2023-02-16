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
    if (req.session.user && req.session.user.role != 'admin')
        res.redirect(req.headers.referer || '/') // TODO: Redirect to 404 page

    await repertoireController.randomFillDatabase()
    res.redirect('/')
})

module.exports = router;
