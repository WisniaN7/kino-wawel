var express = require('express');
var router = express.Router();

const db = require('../controllers/database')
const repertoireController = require('../controllers/repertoireController')

router.get('/repertuar', function(req, res, next) {
    res.render('repertoire', { title: 'Kino Wawel' })
});

router.get('/repertuar/city=:city&date=:date', async (req, res, next) => {
    const ret = await repertoireController.getRepertoire(req.params.city, req.params.date)
    res.status(200).send(ret)
})

router.get('/repertuar/fill', async (req, res, next) => {
    await repertoireController.randomFillDatabase()
    res.status(200).send()
});

module.exports = router;
