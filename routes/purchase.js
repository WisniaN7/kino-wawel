let express = require('express')
let router = express.Router()

const purchaseController = require('../controllers/purchaseController')

router.get('/*/:screening', async (req, res, next) => {
    const ticketTypes = await purchaseController.getTicketTypes()
    const tickets = await purchaseController.getTickets(req.params.screening)
    res.render('purchase', { user: req.session.user, screening: req.params.screening, tickets: tickets, ticketTypes: ticketTypes, host: req.hostname })
})

router.post('/:screening', async (req, res, next) => {
    const ticketsCounts = [parseInt(req.body['1']), parseInt(req.body['2']), parseInt(req.body['3']), parseInt(req.body['4'])]

    if (ticketsCounts.reduce((partialSum, a) => partialSum + a, 0) != req.body.seats.length) {
        res.status(449) 
        const ticketTypes = await purchaseController.getTicketTypes()
        const tickets = await purchaseController.getTickets(req.params.screening)
        res.render('purchase', { user: req.session.user, screening: req.params.screening, tickets: tickets, ticketTypes: ticketTypes, host: req.hostname })
        return
    }

    if (!await purchaseController.areSeatFree(req.params.screening, req.body.seats)) {
        res.status(403)
        const ticketTypes = await purchaseController.getTicketTypes()
        const tickets = await purchaseController.getTickets(req.params.screening)
        res.render('purchase', { user: req.session.user, screening: req.params.screening, tickets: tickets, ticketTypes: ticketTypes, host: req.hostname })
        return
    }


    // await purchaseController.buyTickets(req.params.screening, req.body.seats, ticketsCounts, req.session.user ? req.session.user.user_id : null)
    res.render('success', { user: req.session.user, email: req.body.email, host: req.hostname })
})

module.exports = router