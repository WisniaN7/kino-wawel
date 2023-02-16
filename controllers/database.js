const mysql = require('mysql2/promise')

const createConnection = async () => {
    const conn = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        database: 'kino_wawel'
    })
    
    await conn.connect();
    return conn
}

module.exports = {
    createConnection
}