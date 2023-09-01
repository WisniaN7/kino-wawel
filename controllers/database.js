require('dotenv').config()
const mysql = require('mysql2/promise')

process.env.DB_URL = process.env.DB_URL || 'localhost'
process.env.DB_PORT = process.env.DB_PORT || 3306
process.env.DB_USER = process.env.DB_USER || 'root'
process.env.DB_PASS = process.env.DB_PASS || ''
process.env.DB_NAME = process.env.DB_NAME || 'kino_wawel'

const createConnection = async () => {
    const conn = await mysql.createConnection({
        host: process.env.DB_URL,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    })

    await conn.connect();
    return conn
}

module.exports = {
    createConnection
}