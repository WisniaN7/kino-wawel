let express = require('express')
let router = express.Router()

const purchaseController = require('../controllers/purchaseController')

router.get('/:title/:screening', async (req, res, next) => {
    const ticketTypes = await purchaseController.getTicketTypes()
    const tickets = await purchaseController.getTickets(req.params.screening)
    res.render('purchase', { user: req.session.user, screening: req.params.screening, title: req.params.title, tickets: tickets, ticketTypes: ticketTypes, host: req.hostname })
})

router.post('/:title/:screening', async (req, res, next) => {
    const ticketsCounts = [parseInt(req.body['1']), parseInt(req.body['2']), parseInt(req.body['3']), parseInt(req.body['4'])]
    const seats = typeof req.body.seats == 'string' ? [req.body.seats] : req.body.seats

    if (ticketsCounts.reduce((partialSum, a) => partialSum + a, 0) != seats.length) {
        res.status(449) 
        res.redirect('/zakup/' + req.params.title + '/' + req.params.screening + '?status=18')
        return
    }

    if (!await purchaseController.areSeatFree(req.params.screening, seats)) {
        res.status(403)
        res.redirect('/zakup/' + req.params.title + '/' + req.params.screening + '?status=19')
        return
    }

    await purchaseController.buyTickets(req.params.screening, seats, ticketsCounts, req.session.user ? req.session.user.user_id : null)
    res.redirect('/zakup/sukces?email=' + req.body.email)
})

router.get('/sukces', (req, res, next) => {
    res.render('success', { user: req.session.user, email: req.query.email, host: req.hostname })
})

module.exports = router