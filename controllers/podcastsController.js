const mysql = require('mysql')
const connectDB = require('./connectDB')

exports.getSummary = async(_req, res) => {
    const connection = connectDB();
    const query = 'SELECT ID, name, media_type, episode, rating, genre FROM podcasts'
    connection.query(query, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : 'Error retrieving summary of Series Data during database operation'})
        }
        res.status(200).json({results})
    })
}