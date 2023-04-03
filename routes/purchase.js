let express = require('express')
let router = express.Router()

const purchaseController = require('../controllers/purchaseController')

router.get('/discounts/:discount_code', async (req, res, next) => {
    const discount = await purchaseController.getDiscount(req.params.discount_code)

    if (discount)
        res.status(200).json({ discount: discount })
    else
        res.status(500).send()
})

router.get('/:title/:screening', async (req, res, next) => {
    const ticketTypes = await purchaseController.getTicketTypes()
    const tickets = await purchaseController.getTickets(req.params.screening)

    if (!ticketTypes || !tickets) {
        res.render('purchase', {
            snackbar: { message: 'Wystąpił błąd przy pobieraniu danych, odśwież stronę lub skontaktuj się z administratorem serwisu.', type: 'error', duration: 'long' },
            user: req.session.user, screening: req.params.screening, title: req.params.title, host: req.headers.host, protocol: req.protocol
        })

        return
    }

    res.render('purchase', { user: req.session.user, screening: req.params.screening, title: req.params.title, tickets: tickets, ticketTypes: ticketTypes, host: req.headers.host, protocol: req.protocol })
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
    res.render('success', { user: req.session.user, email: req.query.email, host: req.headers.host, protocol: req.protocol })
})

module.exports = router