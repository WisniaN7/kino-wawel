const mysql = require('mysql2/promise')

async function createConnection() {
    const conn = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'kino_wawel'
    })
    
    conn.connect();

    return conn
}

module.exports = {
    createConnection
}