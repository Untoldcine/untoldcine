const mysql = require('mysql')
require('dotenv').config();

const connectDB = () => {
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    })
    connection.connect((err) => {
        if (err) {
            console.error(`Error connecting to the DB: ${err}`);
            return
        }
        console.log('Successfully connected to DB');
    })

    return connection
}

module.exports = connectDB;