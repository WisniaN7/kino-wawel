const db = require('./database')

const getTickets = async (id) => {
    const connection = await db.createConnection()
    const sql = 'SELECT seat_row, seat_number FROM tickets WHERE screening_id = ? ORDER BY seat_row, seat_number;'
    let tickets = []

    try {
        [tickets] = await connection.query(sql, id)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
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
        await connection.end()
        return null
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
        await connection.end()
        return false
    }
    
    await connection.end()
    return true
}

const areSeatFree = async (screening, seats) => {
    const connection = await db.createConnection()
    let sql = 'SELECT COUNT(screening_id) <> 0 as "taken" FROM tickets WHERE screening_id = ? AND ('

    for (const seat of seats)
        sql += '(seat_row = ? AND seat_number = ?)' + (seat != seats[seats.length - 1] ? ' OR ' : ');')

    let placeholders = [screening]
    placeholders.push(...seats.map(seat => [seat.split('|')[0].charCodeAt(0) - 64, seat.split('|')[1]]).flat())
    let result = []

    try {
        [result] = await connection.execute(sql, placeholders)
    } catch (err) {
        console.error(err)
        await connection.end()
        return false
    }

    await connection.end()
    return result[0].taken == 0
}

const getDiscount = async (discountCode) => {
    const connection = await db.createConnection()
    const sql = 'SELECT discount FROM discount_codes WHERE discount_code = ?;'
    let discount = []

    try {
        [discount] = await connection.query(sql, discountCode)
    } catch (err) {
        console.error(err)
        await connection.end()
        return null
    }

    await connection.end()
    return discount[0]?.discount
}

module.exports = {
    getTickets,
    getTicketTypes,
    buyTickets,
    areSeatFree,
    getDiscount,
}