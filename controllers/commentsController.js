const mysql = require('mysql')
require('dotenv').config();
const connectDB = require('./connectDB')

exports.getSeriesComments = async (req, res) => {
    const {seriesID} = req.params;
    if (!seriesID) {
        res.status(400).json({'message': 'Missing series ID to retrieve comments'})
    }
    const connection = connectDB();
    const query = 'SELECT comments.ID, comments.content, comments.date, comments.parent_id, comments.user_id, users.nickname FROM comments JOIN users on comments.user_id = users.ID WHERE comments.series_id = ?'
    connection.query(query, seriesID, (queryError, results) => {
        connection.end();
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : `Error retrieving summary of comments at ID ${seriesID} during database operation`})
        }
        res.status(200).json(results)
    })
}