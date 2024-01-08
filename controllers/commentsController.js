const connectDB = require('./connectDB')

exports.getSeriesComments = async (req, res) => {
    const {seriesID} = req.params;
    if (!seriesID) {
        res.status(400).json({'message': 'Missing series ID to retrieve comments'})
    }
    const connection = connectDB();
    const query = 'SELECT comments.ID, comments.content, comments.date, comments.parent_id, comments.votes, comments.user_id, users.nickname FROM comments JOIN users on comments.user_id = users.ID WHERE comments.series_id = ?'
    connection.query(query, seriesID, (queryError, results) => {
        connection.end();
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error retrieving summary of comments at ID ${seriesID} during database operation`})
        }
        res.status(200).json(results)
    })
}

exports.getPodcastComments = async (req, res) => {
    const {podcastID} = req.params;
    if (!podcastID) {
        res.status(400).json({'message': 'Missing podcast ID to retrieve comments'})
    }
    const connection = connectDB();
    const query = 'SELECT podcast_comments.ID, podcast_comments.content, podcast_comments.date, podcast_comments.votes, podcast_comments.parent_id, podcast_comments.user_id, users.nickname FROM podcast_comments JOIN users on podcast_comments.user_id = users.ID WHERE podcast_comments.podcast_id = ?'
    connection.query(query, podcastID, (queryError, results) => {
        connection.end();
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error retrieving summary of podcast comments at ID ${podcastID} during database operation`})
        }
        res.status(200).json(results)
    })
}