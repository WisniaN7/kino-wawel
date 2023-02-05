let express = require('express');
let router = express.Router();

const authController = require('../controllers/authController')

router.get('/logowanie', async (req, res, next) => {
    res.render('signin', { user: req.session.user, title: 'Kino Wawel' })
})

router.get('/rejestracja', async (req, res, next) => {
    res.render('signup', { user: req.session.user, title: 'Kino Wawel' })
})

router.post('/signin', async (req, res, next) => {
    const user = await authController.singin(req.body.login, req.body.password)

    if (user) {
        req.session.user = user
        res.redirect('/?status=7')
    } else
        res.redirect('/logowanie?status=4')
})

router.post('/signup', async (req, res, next) => {
    if (await authController.singup(req.body.login, req.body.email, req.body.password))   
        res.redirect('/?status=6')
    else
        res.redirect('/rejestracja?status=8')
})

router.get('/wyloguj', async (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
})

module.exports = router;
