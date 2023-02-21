const db = require('./database')
const bcrypt = require('bcrypt')

const singin = async (loginOrEmail, password) => {
    const connection = await db.createConnection()
    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?;'
    let credentials = []

    try {
        [credentials] = await connection.query(sql, [loginOrEmail, loginOrEmail])
    } catch (err) {
        console.error(err)
    }
    
    await connection.end()
    return bcrypt.compareSync(password, credentials[0]?.password || '') ? { user_id: credentials[0].user_id, username: credentials[0].username, email: credentials[0].email, role: credentials[0].role } : false
}

const singup = async (login, email, password) => {
    const connection = await db.createConnection()
    password = bcrypt.hashSync(password, 10)
    const sql = 'INSERT INTO users VALUES (null, ?, ?, ?, \'user\')'

    try {
        await connection.query(sql, [login, email, password])
    } catch (err) {
        console.error(err)
        await connection.end()
        return false
    }
    
    await connection.end()
    return true
}

module.exports = {
    singin,
    singup,
}
