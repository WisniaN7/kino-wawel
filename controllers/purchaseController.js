const db = require('../controllers/database');

async function getTickets(id) {
    const connection = await db.createConnection()
    const tickets = await connection.execute('SELECT seat_row, seat_number FROM tickets WHERE screening_id = ' + id + ' ORDER BY seat_row, seat_number;')
    return tickets[0]
}

async function getTicketTypes() {
    const connection = await db.createConnection()
    const ticketTypes = await connection.execute('SELECT * FROM ticket_types ORDER BY price DESC;')
    return ticketTypes[0]
}

async function buyTickets(screening, seats, ticketsCounts) {
    const connection = await db.createConnection()

    let sql = 'INSERT INTO tickets VALUES '
    let index = 1

    for (const [i, seat] of seats.entries()) {
        while (ticketsCounts[0] == 0) {
            ticketsCounts.shift()
            index++
        }

        sql += '(' + ['null', 'null', screening, seat.split('|')[0].charCodeAt(0) - 64, seat.split('|')[1], index].join(', ') + ')' + (i + 1 != seats.length ? ', ' : ';')
        ticketsCounts[0]--
    }

    await connection.execute(sql)
}

module.exports = {
    getTickets,
    getTicketTypes,
    buyTickets,
}