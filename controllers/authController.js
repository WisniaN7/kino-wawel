const db = require('./database')
const bcrypt = require('bcrypt')

async function singin(loginOrEmail, password) {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?;'
    const credentials = await connection.query(sql, [loginOrEmail, loginOrEmail])
    return bcrypt.compareSync(password, credentials[0][0]?.password || '') ? { user_id: credentials[0][0].user_id, username: credentials[0][0].username, email: credentials[0][0].email, role: credentials[0][0].role } : false
}

async function singup(login, email, password) {
    const connection = await db.createConnection()
    password = bcrypt.hashSync(password, 10)
    const sql = 'INSERT INTO users VALUES (null, ?, ?, ?, \'user\')'
    await connection.query(sql, [login, email, password])
}

module.exports = {
    singin,
    singup,
}
