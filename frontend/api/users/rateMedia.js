const { PrismaClient} = require('@prisma/client')
const jwt = require("jsonwebtoken");
require('dotenv').config();
const prisma = new PrismaClient();

// /api/users/rateMedia - body contains table_name, content_id, should also include the choice

module.exports = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({'Message' : 'Not logged in, cannot submit rating'})
    }
    const {table_name, content_id} = req.body;
    const { choice } = req.params //change this
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let insertionTable
    let insertionID
    let ratingColumnUp
    let ratingColumnDown

    switch(table_name) {
        case 'series':
            insertionTable = 'Series'
            insertionID = 'series_id'
            ratingColumnUp = 'series_upvotes'
            ratingColumnDown = 'series_downvotes'
            break;
        case 'movies':
            insertionTable = 'Movies'
            insertionID = 'movie_id'
            ratingColumnUp = 'movie_upvotes'
            ratingColumnDown = 'movie_downvotes'
            break;
        case 'podcasts':
            insertionTable = 'Podcasts'
            insertionID = 'podcast_id'
            ratingColumnUp = 'podcast_upvotes'
            ratingColumnDown = 'podcast_downvotes'
            break;
    }
    
    try {
        const feedbackExists = await findFeedback(decoded.user_id, content_id, insertionTable);

        if (feedbackExists && feedbackExists.feedback_rating === choice) {
            res.status(200).json({ 'Message': 'No change in rating' });
            return
        } 
        if (feedbackExists && feedbackExists.feedback_rating !== choice) {
                // Update the feedback entry and the content rating
                await deleteFeedbackEntry(feedbackExists);
                await updateOldContentRating(insertionTable, insertionID, content_id, ratingColumnUp, ratingColumnDown, choice, feedbackExists.feedback_rating);
                res.status(200).json({"message": "Feedback updated accordingly"});
                return
        } else {
            // If feedback doesn't exist, add new feedback and update the content rating
            const insertNew = await newFeedback(decoded.user_id, insertionTable, content_id, choice);
            if (insertNew) {
                await updateNewContentRating(insertionTable, insertionID, comment_id, ratingColumnUp, ratingColumnDown, choice);
                res.status(200).json({"message": "New Feedback and rating added"})
                return 

            }
        }
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({"message": "Invalid or expired token"});
    }
}

async function findFeedback(user_id, comment_id, insertionTable) {
    const existingFeedback = await prisma.Feedback.findFirst({
        where: {
            user_id: user_id,
            table_name: insertionTable,
            item_id: comment_id
        }
    })
    return existingFeedback
}

//since the choice is different, delete your existing entry if you voted differently and therefore removing history of your choice
async function deleteFeedbackEntry(feedbackObj) {
    const {feedback_id} = feedbackObj
    await prisma.Feedback.delete({
        where: {
            feedback_id
        }
    })
}

async function newFeedback(user_id, insertionTable, content_id, choice) {
    const insertFeedback = await prisma.Feedback.create({
        data: {
            user_id: user_id,
            table_name: insertionTable,
            item_id: content_id,
            feedback_rating: choice
        }
    })
    return insertFeedback;
}

async function updateOldContentRating(insertionTable, insertionID, content_id, ratingColumnUp, ratingColumnDown, choice, previous) {
    if (choice === 'up' && previous === 'down') {
        return prisma[insertionTable].update({
            where:{
                [insertionID]: content_id
            },
            data: {
                [ratingColumnDown]: {
                    decrement: 1
                }
            }
        })
    }
    if (choice === 'down' && previous.feedback_rating === 'up') {
        return prisma[insertionTable].update({
            where:{
                [insertionID]: content_id
            },
            data: {
                [ratingColumnUp]: {
                    decrement: 1
                }
            }
        })
    }
}
async function updateNewContentRating(insertionTable, insertionID, content_id, ratingColumnUp, ratingColumnDown, choice) {
    if (choice === 'up') {
        return prisma[insertionTable].update({
            where:{
                [insertionID]: content_id
            },
            data: {
                [ratingColumnUp]: {
                    increment: 1
                }
            }
        })
    }
    if (choice === 'down') {
        return prisma[insertionTable].update({
            where:{
                [insertionID]: content_id
            },
            data: {
                [ratingColumnDown]: {
                    increment: 1
                }
            }
        })
    }
}