const connectDB = require('./connectDB')

exports.getSeriesComments = async (req, res) => {
    const {seriesID} = req.params;
    if (!seriesID) {
        res.status(400).json({'message': 'Missing series ID to retrieve comments'})
    }
    const connection = connectDB();
    const query = 'SELECT comments.ID, comments.content, comments.date, comments.parent_id, comments.votes, comments.user_id, comments.series_id, users.nickname FROM comments JOIN users on comments.user_id = users.ID WHERE comments.series_id = ? AND comments.deleted = FALSE'
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
        const commentMap = {}
        const topLevelComments = []

        results.forEach((comment) => {
            commentMap[comment.ID] = comment;
            comment.replies = [];
        })

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

exports.newComment = async (req, res) => {
    const {userID} = req.params
    const {content, table_name, ID} = req.body;
    if (!userID || !content || !ID || !table_name) {
        return res.status(400).json({'message': 'Missing data to process new POST of comment'})
    }
    let ID_Type;
    if (table_name === 'comments') {
        ID_Type = 'series_id'
    }
    if (table_name === 'podcast_comments') {
        ID_Type = 'podcast_id'
    }

    const connection = connectDB();
    const query = `INSERT INTO ${table_name} (user_id, content, ${ID_Type}) VALUES (?, ?, ?)`
    connection.query(query, [userID, content, ID], (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error at POST a new comment during database operation`})
            }
            res.status(200).json(results)
        })
    
}

exports.replyComment = async (req, res) => {
    const {userID} = req.params
    const {content, parent_id, table, series_id} = req.body;
    if (!userID || !content || !parent_id || !series_id) {
        return res.status(400).json({'message': 'Missing data to process POST of reply'})
    }
    const connection = connectDB();
    const query = `INSERT INTO ${table} (user_id, content, series_id, parent_id) VALUES (?, ?, ?, ?)`
    connection.query(query, [userID, content, series_id, parent_id], (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error at POST to new reply to a comment during database operation`})
        }
        res.status(200).json(results)
    })
}

//FOR NOW: not processing comment deletions yet because I hope to use an ORM like PRISMA to utilize its cascade function
//Moving a comment to soft deletion is easy but triggering all of its predecessor comments (like deep replies) to be flagged as false will take recursion
//might be computationally heavy so for now, won't do comment deletes manually
exports.removeComment = async (req, res) => {
    const {userID} = req.params;
    const {content_ID, content_type } = req.body
    if (!userID || !content_ID || !content_type) {
        return res.status(400).json({'message': 'Missing data to process delete of comment'})
    }
    //insert deleted comment into soft-deletion table
    const connection = connectDB();
    const query = 'INSERT INTO deleted_content (content_ID,content_type) VALUES (?, ?)'
    connection.query(query, [content_ID, content_type], (deleteError, _delete_results) => {
        if (deleteError) {
            console.error('Error ' + deleteError);
            return res.status(500).json({'message': 'Error attempting to add comment to deletion table during database operation'})
        }

        //then flag the comment deleted to true
        const updateCommentStatus = `UPDATE ${content_type} SET deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE ID = ?`
        connection.query(updateCommentStatus, content_ID, (updateError, _update_results) => {
            connection.end(); 
            if (updateError) {
                console.error('Error ' + updateError);
                return res.status(500).json({'message': 'Error attempting to add comment to deletion table during database operation'})
            }
            res.status(200).json({"message": "Successfully flagged comment for deletion and added to delete table"});
        })
    })
}