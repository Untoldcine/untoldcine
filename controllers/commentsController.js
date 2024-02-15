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
                user: {
                    select: {
                        user_id: true,
                        user_nickname: true
                    }
                },
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
                user: {
                    select: {
                        user_id: true,
                        user_nickname: true
                    }
                }, 
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
                user: {
                    select: {
                        user_id: true,
                        user_nickname: true
                    }
                }, 
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
    const {comment, table_name, content_id} = req.body;
    if (!userID || !comment || !content_id || !table_name) {
        return res.status(400).json({'message': 'Missing data to process new POST of comment'})
    }
    let dataTable
    let insertionText

    switch(table_name) {
        case 'series':
            dataTable = 'Series_Comments'
            insertionID = 'parent_series_id'
            insertionText = 'series_comments_content'
            break;
        case 'movie':
            dataTable = 'Movie_Comments'
            insertionID = 'parent_movie_id'
            insertionText = 'movie_comments_content'
            break;
        case 'podcast':
            dataTable = 'Podcast_Comments'
            insertionID = 'parent_podcast_id'
            insertionText = 'podcast_comments_content'
            break;
    }

    try {
        const newComment = await prisma[dataTable].create({
            data: {
                [insertionID]: parseInt(content_id),
                [insertionText]: comment,
                user_id: parseInt(userID)
            }
        })
        if (newComment) {
            res.status(200).json({'message': 'Success!'})
        }
    } 
    catch (error) {
        console.error('Error', error);
        res.status(500).json({'message': `Error posting new comment during database operation`});
    }
}

exports.editComment = async (req, res) => {
    const { comment_id, table, editedComment } = req.body;
    if (!comment_id|| !editedComment || !table) {
        return res.status(400).json({'message': 'Missing data to process POST of comment edit'})
    }
    let insertionTable
    let insertionID
    let insertionContent
    switch(table) {
        case 'series':
            insertionTable = 'Series_Comments'
            insertionID = 'series_comments_id'
            insertionContent = 'series_comments_content'
            break;
        case 'movie':
            insertionTable = 'Movie_Comments'
            insertionID = 'movie_comments_id'
            insertionContent = 'movie_comments_content'
            break;
        case 'podcast':
            insertionTable = 'Podcast_Comments'
            insertionID = 'podcast_comments_id'
            insertionContent = 'podcast_comments_content'
            break;
    }
    try {
        const edited = await prisma[insertionTable].update({
            where: {
                [insertionID] : parseInt(comment_id)
            },
            data: {
                [insertionContent]:editedComment,
                edited: true
            }
        })
        if (edited) {
            return res.status(200).json({'message': 'OK!'})
        }
    }
    catch (error) {
        console.error('Error', error);
        res.status(500).json({'message': `Error editing comment during database operation`});
    }
};

exports.replyComment = async (req, res) => {
    const {user_id, comment, parent_comment_id, table, parent_content_id} = req.body;
    if (!user_id || !comment || !parent_comment_id || !table || !parent_content_id) {
        return res.status(400).json({'message': 'Missing data to process POST of reply'})
    }
    let insertionTable
    let insertionParentID 
    let insertionContent 

    switch(table) {
        case 'series':
            insertionTable = 'Series_Comments'
            insertionParentID = 'parent_series_id'
            insertionContent = 'series_comments_content'
            break;
        case 'movie':
            insertionTable = 'Movie_Comments'
            insertionParentID = 'parent_movie_id'
            insertionContent = 'movie_comments_content'
            break;
        case 'podcast':
            insertionTable = 'Podcast_Comments'
            insertionParentID = 'parent_podcast_id'
            insertionContent = 'podcast_comments_content'
            break;
    }

    try {
        const reply = await prisma[insertionTable].create({
            data: {
                user_id,
                [insertionParentID]: parent_content_id,
                parent_comment_id,
                [insertionContent]: comment
            }
        })
        if (reply) {
            return res.status(200).json({'message': 'OK!'})
        }
    }
    catch (error) {
        console.error('Error', error);
        res.status(500).json({'message': `Error creating reply comment during database operation`});
    }
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
    const {comment_id, table } = req.body
    if (!userID || !comment_id || !table) {
        return res.status(400).json({'message': 'Missing data to process delete of comment'})
    }
    let insertionTable
    let insertionID
    switch(table) {
        case 'series':
            insertionTable = 'Series_Comments'
            insertionID = 'series_comments_id'
            break;
        case 'movie':
            insertionTable = 'Movie_Comments'
            insertionID = 'movie_comments_id'
            break;
        case 'podcast':
            insertionTable = 'Podcast_Comments'
            insertionID = 'podcast_comments_id'
            break;
    }
    //insert deleted comment into soft-deletion table
    try {
        const deleted = await prisma.Deleted_Content.create({
            data: {
                content_type: insertionTable,
                content_id: parseInt(comment_id)
            }
        })
        if (deleted) {
            try {
                const toggleDelete = await prisma[insertionTable].update({
                    where: {
                        [insertionID] : parseInt(comment_id),
                        user_id: parseInt(userID)
                    },
                    data: {
                        deleted: true,
                        deleted_at: new Date()
                    }
                })
            }
            catch(error) {
                console.error('Error', error);
                res.status(500).json({'message': `Error toggling comment deletion flags during database operation`});
            }
        }
    }
    catch (error) {
        console.error('Error', error);
        res.status(500).json({'message': `Error adding comment to soft-deletion table during database operation`});
    }
}