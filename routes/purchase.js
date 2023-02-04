var express = require('express')
var router = express.Router()

const purchaseController = require('../controllers/purchaseController')

router.get('/zakup/*/:screening', async (req, res, next) => {
    const ticketTypes = await purchaseController.getTicketTypes()
    const tickets = await purchaseController.getTickets(req.params.screening)
    console.log(tickets)
    res.render('purchase', { screening: req.params.screening, tickets: tickets, ticketTypes: ticketTypes, title: 'Kino Wawel' })
})

router.post('/przetwarzanie/:screening', async (req, res, next) => {
    const ticketsCounts = [parseInt(req.body['1']), parseInt(req.body['2']), parseInt(req.body['3']), parseInt(req.body['4'])]

    if (ticketsCounts.reduce((partialSum, a) => partialSum + a, 0) != req.body.seats.length)
        res.status(400) // TODO: failure page

    await purchaseController.buyTickets(req.params.screening, req.body.seats, ticketsCounts)
    res.render('success', { email: req.body.email, title: 'Kino Wawel' })
})

module.exports = router