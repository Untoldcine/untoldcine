const connectDB = require('./connectDB')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();


exports.getSeriesComments = async (req, res) => {
    const { userID, seriesID } = req.params;

    if (!seriesID || !userID) {
        return res.status(400).json({'message': 'Missing series or user ID to retrieve comments'});
    }

    try {
        const comments = await prisma.series_Comments.findMany({
            where: {
                parent_series_id: parseInt(seriesID),
                deleted: false,
            },
            include: {
                user: true, 
                // feedback: {
                //     where: {
                //         user_ID: parseInt(userID),
                //     },
                //     select: {
                //         rating: true,
                //     },
                // },
            },
        });

        const commentMap = {};
        const topLevelComments = [];

        //take returned database result, create comment relationship structure where those w/o parent_ids are 'top level'. 
        //those with parent_ids are placed within their respective 'reply' arrays
        comments.forEach(comment => {
            commentMap[comment.series_comments_id] = { ...comment, replies: [] };

            if (comment.parent_comment_id === null) {
                topLevelComments.push(commentMap[comment.series_comments_id]);
            }
        });

        comments.forEach(comment => {
            if (comment.parent_comment_id !== null) {
                if (commentMap[comment.parent_comment_id]) {
                    commentMap[comment.parent_comment_id].replies.push(commentMap[comment.series_comments_id]);
                }
            }
        });

        res.status(200).json(topLevelComments);
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({'message': `Error retrieving summary of comments for series ID ${seriesID} during database operation`});
    }
}

exports.getMovieComments = async (req, res) => {
    const { userID, movieID } = req.params;

    if (!movieID || !userID) {
        return res.status(400).json({'message': 'Missing movie or user ID to retrieve comments'});
    }

    try {
        const comments = await prisma.Movie_Comments.findMany({
            where: {
                parent_movie_id: parseInt(movieID),
                deleted: false,
            },
            include: {
                user: true, 
                // feedback: {
                //     where: {
                //         user_ID: parseInt(userID),
                //     },
                //     select: {
                //         rating: true,
                //     },
                // },
            },
        });

        const commentMap = {};
        const topLevelComments = [];

        //take returned database result, create comment relationship structure where those w/o parent_ids are 'top level'. 
        //those with parent_ids are placed within their respective 'reply' arrays
        comments.forEach(comment => {
            commentMap[comment.movie_comments_id] = { ...comment, replies: [] };

            if (comment.parent_comment_id === null) {
                topLevelComments.push(commentMap[comment.movie_comments_id]);
            }
        });

        comments.forEach(comment => {
            if (comment.parent_comment_id !== null) {
                if (commentMap[comment.parent_comment_id]) {
                    commentMap[comment.parent_comment_id].replies.push(commentMap[comment.movie_comments_id]);
                }
            }
        });

        res.status(200).json(topLevelComments);
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({'message': `Error retrieving summary of comments for movie ID ${movieID} during database operation`});
    }
}

exports.getPodcastComments = async (req, res) => {
    const {userID, podcastID} = req.params;
    if (!podcastID) {
        res.status(400).json({'message': 'Missing podcast ID to retrieve comments'})
    }
    try {
        const comments = await prisma.Podcast_Comments.findMany({
            where: {
                parent_podcast_id: parseInt(podcastID),
                deleted: false,
            },
            include: {
                user: true, 
                // feedback: {
                //     where: {
                //         user_ID: parseInt(userID),
                //     },
                //     select: {
                //         rating: true,
                //     },
                // },
            },
        });

        const commentMap = {};
        const topLevelComments = [];

        //take returned database result, create comment relationship structure where those w/o parent_ids are 'top level'. 
        //those with parent_ids are placed within their respective 'reply' arrays
        comments.forEach(comment => {
            commentMap[comment.podcast_comments_id] = { ...comment, replies: [] };

            if (comment.parent_comment_id === null) {
                topLevelComments.push(commentMap[comment.podcast_comments_id]);
            }
        });

        comments.forEach(comment => {
            if (comment.parent_comment_id !== null) {
                if (commentMap[comment.parent_comment_id]) {
                    commentMap[comment.parent_comment_id].replies.push(commentMap[comment.podcast_comments_id]);
                }
            }
        });

        res.status(200).json(topLevelComments);
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({'message': `Error retrieving summary of comments for podcast ID ${podcastID} during database operation`});
    }
}

exports.getBTSComments = async (req, res) => {
    const {userID, seriesID} = req.params;
    if (!seriesID) {
        res.status(400).json({'message': 'Missing series ID to retrieve comments for series BTS'})
    }
    const connection = connectDB();
    const query = 'SELECT distinct bts_comments.ID, bts_comments.content, bts_comments.date, bts_comments.rating, bts_comments.parent_id, bts_comments.user_id, bts_comments.series_id, bts_comments.btsflag, bts_comments.edited, users.nickname, feedback.rating AS user_feedback FROM bts_comments JOIN users on bts_comments.user_id = users.ID LEFT JOIN feedback on bts_comments.ID = feedback.item_ID and feedback.user_ID = ? WHERE bts_comments.series_id = ?'
    connection.query(query, [userID, seriesID], (queryError, results) => {
        connection.end();
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error retrieving summary of podcast comments at ID ${seriesID} during database operation`})
        }
        const commentMap = {}
        const topLevelComments = []

        results.forEach((comment) => {
            commentMap[comment.ID] = {
                ...comment,
                userHasResponded: comment.user_feedback !== null,
                replies: []
            }
        })

        results.forEach((comment) => {
            if (comment.parent_id !== null) {
                let parentComment = commentMap[comment.parent_id];
                if (parentComment) {
                    parentComment.replies.push(commentMap[comment.ID]);
                }
            } else {
                topLevelComments.push(commentMap[comment.ID]);
            }
        });
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
    if (table_name === 'comments' || table_name === 'bts_comments') {
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

exports.editComment = async (req, res) => {
    const { ID, content, table } = req.body;
    if (!ID|| !content || !table) {
        return res.status(400).json({'message': 'Missing data to process POST of comment edit'})
    }
    const connection = connectDB();
    const query = 'UPDATE ?? SET content = ?, edited = ? WHERE ID = ?';
    connection.query(query, [table, content, 1,  ID], (queryError, _results) => {
        connection.end();
        if (queryError) {
            console.error('Error ' + queryError);
            return res.status(500).json({ 'message': `Error editing comment in table: ${table} at ID: ${ID} during database operation` });
        }
        res.sendStatus(200);
    });
};

exports.replyComment = async (req, res) => {
    const {userID} = req.params
    const {content, parent_id, series_id} = req.body;
    if (!userID || !content || !parent_id || !series_id ) {
        return res.status(400).json({'message': 'Missing data to process POST of reply'})
    }

    const connection = connectDB();
    const query = `INSERT INTO comments (user_id, content, series_id, parent_id) VALUES (?, ?, ?, ?)`
    connection.query(query, [userID, content, series_id, parent_id], (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error at POST to new reply to a comment during database operation`})
        }
        res.status(200).json(results)
    })
}

exports.replyPodcastComment = async (req, res) => {
    const {userID} = req.params
    const {content, parent_id, podcast_id} = req.body;
    if (!userID || !content || !parent_id || !podcast_id) {
        return res.status(400).json({'message': 'Missing data to process POST of reply'})
    }

    const connection = connectDB();
    const query = `INSERT INTO podcast_comments (user_id, content, podcast_id, parent_id) VALUES (?, ?, ?, ?)`
    connection.query(query, [userID, content, podcast_id, parent_id], (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error at POST to new reply to a podcast comment during database operation`})
        }
        res.status(200).json(results)
    })
}

exports.replyBTSComment = async (req, res) => {
    const {userID} = req.params
    const {content, parent_id, series_id} = req.body;
    if (!userID || !content || !parent_id || !series_id) {
        return res.status(400).json({'message': 'Missing data to process POST of reply'})
    }

    const connection = connectDB();
    const query = `INSERT INTO bts_comments (user_id, content, series_id, parent_id) VALUES (?, ?, ?, ?)`
    connection.query(query, [userID, content, series_id, parent_id], (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error at POST to new reply to a podcast comment during database operation`})
        }
        res.status(200).json(results)
    })
}

//FOR NOW: not processing comment deletions yet because I hope to use an ORM like PRISMA to utilize its cascade function
//Moving a comment to soft deletion is easy but triggering all of its predecessor comments (like deep replies) to be flagged as false will take recursion
//might be computationally heavy so for now, won't do comment deletes manually

//alternative is hard deletion of content but best practice may be to use soft deletes? dunno
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