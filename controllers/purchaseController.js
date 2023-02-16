// TODO: Discounts

const db = require('./database')

async function getTickets(id) {
    const connection = await db.createConnection()
    const sql = 'SELECT seat_row, seat_number FROM tickets WHERE screening_id = ? ORDER BY seat_row, seat_number;'
    const [tickets] = await connection.query(sql, id)
    await connection.end()
    return tickets
}

async function getTicketTypes() {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM ticket_types ORDER BY price DESC;'
    const [ticketTypes] = await connection.execute(sql)
    await connection.end()
    return ticketTypes
}

async function buyTickets(screening, seats, ticketsCounts, userId = null) {
    const connection = await db.createConnection()

    let sql = 'INSERT INTO tickets VALUES '
    let index = 1

    for (const [i, seat] of seats.entries()) {
        while (ticketsCounts[0] == 0) {
            ticketsCounts.shift()
            index++
        }

        sql += '(' + ['null', userId, screening, seat.split('|')[0].charCodeAt(0) - 64, seat.split('|')[1], index].join(', ') + ')' + (i + 1 != seats.length ? ', ' : ';')
        ticketsCounts[0]--
    }

    await connection.execute(sql)
    await connection.end()
}

module.exports = {
    getTickets,
    getTicketTypes,
    buyTickets,
}