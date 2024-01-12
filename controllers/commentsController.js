const connectDB = require('./connectDB')

exports.getSeriesComments = async (req, res) => {
    const {seriesID} = req.params;
    if (!seriesID) {
        res.status(400).json({'message': 'Missing series ID to retrieve comments'})
    }
    const connection = connectDB();
    const query = 'SELECT comments.ID, comments.content, comments.date, comments.parent_id, comments.votes, comments.user_id, comments.series_id, users.nickname FROM comments JOIN users on comments.user_id = users.ID WHERE comments.series_id = ?'
    connection.query(query, seriesID, (queryError, results) => {
        connection.end();
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error retrieving summary of comments at ID ${seriesID} during database operation`})
        }

        //manipulate data to create parent-child structure for client side
        const commentMap = {}
        const topLevelComments = []

        //create a map for each comment for faster data access
        results.forEach((comment) => {
            commentMap[comment.ID] = comment;
            comment.replies = [];
        })

        //if parent_id exists, append to parent comment replies array
        results.forEach((comment) => {
            if (comment.parent_id !== null) {
                parentComment = commentMap[comment.parent_id]
                parentComment.replies.push(comment)
            }
            else {
                topLevelComments.push(comment)
            }
        })
        res.status(200).json({"topLevel":topLevelComments, "allComments":commentMap});
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

exports.replyComment = async (req, res) => {
    const {userID} = req.params
    const {content, parent_id, table, series_id} = req.body;
    if (!userID || !content || !parent_id || !series_id) {
        return res.status(400).json({'message': 'Missing data to fulfil POST of reply'})
    }
    const connection = connectDB();
    const query = `INSERT INTO ${table} (user_id, content, series_id, parent_id) VALUES (?, ?, ?, ?)`
    connection.query(query, [userID, content, series_id, parent_id], (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error at POST to new reply to a comment during database operation`})
        }
        res.sendStatus(200)
    })
}

//ok now post to DB, send back that comment as above format, and append it to the parent comment's replies array