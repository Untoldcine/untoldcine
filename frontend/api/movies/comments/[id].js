const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require('dotenv').config();

// /api/movies/comments/#movie_id
module.exports = async (req, res) => {
    const token = req.cookies.token
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({'message': 'Missing movie to retrieve comments'});
    }

    if (!token) {
        try {
            const comments = await prisma.movie_Comments.findMany({
                where: {
                    parent_movie_id: parseInt(id),
                    deleted: false,
                },
                include: {
                    user: {
                        select: {
                            user_id: true,
                            user_nickname: true
                        }
                    }
                }
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
            res.status(500).json({'message': `Error retrieving summary of comments for movie ID ${id} during database operation`});
        }
    }
    else  {
        //if there is a user through the retrieved token, alter data below
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [commentData, feedbackData] = await Promise.all([
                prisma.movie_Comments.findMany({
                    where: {
                        parent_movie_id: parseInt(id),
                        deleted: false
                    },
                    include: {
                        user: {
                            select: {
                                user_id: true,
                                user_nickname: true
                            }
                        }
                    }
                }),
                prisma.feedback.findMany({
                    where: {
                        user_id: decoded.user_id,
                        table_name: 'Movie_Comments'
                    }
                })
            ])

            //map that holds what the user has interacted with and what their rating was: either up or down
            const feedbackMap = {}
            feedbackData.forEach(feedback => {
                feedbackMap[feedback.item_id] = feedback.feedback_rating
            })

            const processedComments = commentData.map((comment) => {
                const ownComment = comment.user_id === decoded.user_id      //is this their own comment?
                const reviewed = feedbackMap.hasOwnProperty(comment.movie_comments_id);            //have they reviewed? 
                const reviewChoice = reviewed ? feedbackMap[comment.movie_comments_id] : null;     //what was their choice?

                return {
                    ...comment,
                    ownComment,
                    reviewed,                   //having both reviewed/reviewedChocie is redundant I believe but whatever
                    reviewChoice
                }
            })

            const commentMap = {};
            const topLevelComments = [];
            
            processedComments.forEach(comment => {
                commentMap[comment.movie_comments_id] = { ...comment, replies: [] };
    
                if (comment.parent_comment_id === null) {
                    topLevelComments.push(commentMap[comment.movie_comments_id]);
                }
            });
    
            processedComments.forEach(comment => {
                if (comment.parent_comment_id !== null) {
                    if (commentMap[comment.parent_comment_id]) {
                        commentMap[comment.parent_comment_id].replies.push(commentMap[comment.movie_comments_id]);
                    }
                }
            });

            
            res.status(200).json(topLevelComments);
        } catch (error) {
            console.error('Error', error);
            res.status(500).json({'message': `Error retrieving summary of comments for movie ID ${id} during database operation`});
        }
    }
}