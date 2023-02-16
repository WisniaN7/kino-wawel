// TODO: discounts

const db = require('./database')

const getTickets = async (id) => {
    const connection = await db.createConnection()
    const sql = 'SELECT seat_row, seat_number FROM tickets WHERE screening_id = ? ORDER BY seat_row, seat_number;'
    let tickets = []

    try {
        [tickets] = await connection.query(sql, id)
    } catch (err) {
        console.error(err)
    }

    await connection.end()
    return tickets
}

const getTicketTypes = async () => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM ticket_types ORDER BY price DESC;'
    let ticketTypes = []

    try {
        [ticketTypes] = await connection.execute(sql)
    } catch (err) {
        console.error(err)
    }
    
    await connection.end()
    return ticketTypes
}

const buyTickets = async (screening, seats, ticketsCounts, userId = null) => {
    const connection = await db.createConnection()

    let sql = 'INSERT INTO tickets VALUES'
    let placeholders = []
    let index = 1

    for (const [i, seat] of seats.entries()) {
        while (ticketsCounts[0] == 0) {
            ticketsCounts.shift()
            index++
        }

        sql += ' (null, ?, ?, ?, ?, ?)' + (i + 1 != seats.length ? ', ' : ';')
        placeholders.push(userId, screening, seat.split('|')[0].charCodeAt(0) - 64, seat.split('|')[1], index)
        ticketsCounts[0]--
    }

    try {
        await connection.execute(sql, placeholders)
    } catch (err) {
        console.error(err)
    }
    
    await connection.end()
}

module.exports = {
    getTickets,
    getTicketTypes,
    buyTickets,
}