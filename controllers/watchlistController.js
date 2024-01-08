const connectDB = require('./connectDB')

exports.addToWatchlist = async (req, res) => {
    const {user_id, content_type, content_id} = req.body;
    if (!user_id || !content_type || !content_id) {
        return res.status(400).json({'message' : 'Missing data from add to watchlist request'})
    }
    const connection = connectDB();
    //also add a condition to return nothing if the content already exists in the watchlist, write this later
    const query = 'INSERT INTO watchlist (user_id, content_type, content_id) VALUES (?, ?, ?)'
    connection.query(query, [user_id, content_type, content_id], (queryError, _results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : 'Error adding new watchlist item during database operation'})
        }
        res.sendStatus(200)
    })
}
