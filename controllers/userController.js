const mysql = require('mysql')
require('dotenv').config();

exports.getAllUsers = async(req, res) => {

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    })
    connection.connect()
    connection.query('SELECT * FROM users', (queryError, results) => {
        if (queryError){
            console.error('Error ' + queryError);   
        }
        res.send(results)
        connection.end()
    })
    console.log('complete');

}

