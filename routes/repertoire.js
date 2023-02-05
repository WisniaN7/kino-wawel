let express = require('express');
let router = express.Router();

const repertoireController = require('../controllers/repertoireController')

router.get('/', (req, res, next) => {
    res.render('repertoire', { user: req.session.user, title: 'Kino Wawel' })
})

router.get('/:city/:date', async (req, res, next) => {
    const ret = await repertoireController.getRepertoire(req.params.city, req.params.date)
    res.status(200).send(ret)
})

router.get('/fill', async (req, res, next) => {
    await repertoireController.randomFillDatabase()
    res.redirect('/')
})

module.exports = router;
