const connectDB = require('./connectDB')
const { PrismaClient, ContentTypes} = require('@prisma/client')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const prisma = new PrismaClient();

exports.createNewUser = async(req, res) => {
    const {nickname, email, password } = req.body
    if (!nickname || !email || !password) {
        return res.status(400).json({"message" : "Missing email, username, or password"})
    }
    try {
        const exists = await prisma.user.findUnique({
            where: {
                user_email: email
            }
        })
        if (exists) {
            return res.status(401).json({"message" : `User already exists at email: ${email}`})
        }
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                user_nickname: nickname,
                user_email: email,
                user_password: hash,
                user_level: 0
            }
        })
        res.status(200).json({"message":"OK!"})
    }
    catch(err) {
        console.error('Problem querying DB to create new user');
        return res.status(500).json({"message" : "Internal server error"});
     }
    
}

exports.logIn = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({"message" : "Missing email or password"})
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                user_email: email
                }
    })
        if (!user) {
            return res.status(401).json({"message" : "No user found at those credentials"})
    }   
    //if email exists, then compare hashed value to input password
        const isValid = await bcrypt.compare(password, user.user_password);
        if (!isValid) {
            return res.status(401).json({"message" : "Password does not match!"})
        }
        
        const token = jwt.sign(user, process.env.JWT_SECRET);

        //cookie properties for more secure transmission
        res.cookie('token', token, {
            httpOnly: true, 
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            sameSite: 'lax', 
            maxAge: 24 * 60 * 60 * 1000 // expires in a day
        });
   
        return res.status(200).json({
            status: 200,
            message: 'Login Success'
        })

     }
     catch(err) {
        console.error('Problem querying DB to log in');
        return res.status(500).json({"message" : "Internal server error"});
     } 
}

exports.submitCommentRating = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({'Message' : 'Not logged in, cannot submit rating'})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const {choice} = req.params
    const {comment_id, table} = req.body;
    if (!comment_id || !table) {
        return res.status(400).json({'Message': 'Missing Data to fulfill user submitted rating of content'})
    }

    let insertionTable
    let insertionID
    let ratingColumnUp
    let ratingColumnDown

    switch(table) {
        case 'series':
            insertionTable = 'Series_Comments'
            insertionID = 'series_comments_id'
            ratingColumnUp = 'series_comments_upvotes'
            ratingColumnDown = 'series_comments_downvotes'
            break;
        case 'movie':
            insertionTable = 'Movie_Comments'
            insertionID = 'movie_comments_id'
            ratingColumnUp = 'movie_comments_upvotes'
            ratingColumnDown = 'movie_comments_downvotes'
            break;
        case 'podcast':
            insertionTable = 'Podcast_Comments'
            insertionID = 'podcast_comments_id'
            ratingColumnUp = 'podcast_comments_upvotes'
            ratingColumnDown = 'podcast_comments_downvotes'
            break;
    }
    try {
        const feedbackExists = await findFeedback(decoded.user_id, comment_id, insertionTable);

        if (feedbackExists && feedbackExists.feedback_rating === choice) {
            res.status(200).json({ 'Message': 'No change in rating' });
            return
        } 
        if (feedbackExists && feedbackExists.feedback_rating !== choice) {
                // Update the feedback entry and the content rating
                await deleteFeedbackEntry(feedbackExists);
                await updateOldContentRating(insertionTable, insertionID, comment_id, ratingColumnUp, ratingColumnDown, choice, feedbackExists.feedback_rating);
                res.status(200).json({"message": "Feedback updated accordingly"});
                return
        } else {
            // If feedback doesn't exist, add new feedback and update the content rating
            const insertNew = await newFeedback(decoded.user_id, insertionTable, comment_id, choice);
            if (insertNew) {
                await updateNewContentRating(insertionTable, insertionID, comment_id, ratingColumnUp, ratingColumnDown, choice);
                res.status(200).json({"message": "New Feedback and rating added"})
                return 

            }
        }
    } catch (err) {
        console.error(err + ': Unable to process rating submission');
        return res.status(500).json({ 'Message': 'Unable to check if user submitted rating already exists' });
    }
}

exports.submitMediaRating = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({'Message' : 'Not logged in, cannot submit rating'})
    }
    const {table_name, content_id} = req.body;
    const { choice } = req.params

    let insertionTable
    let insertionID
    let ratingColumn

    switch(table_name) {
        case 'series':
            insertionTable = 'Series'
            insertionID = 'series_id'
            ratingColumn = choice === 'up' ? 'series_upvotes' : 'series_downvotes'
            break;
        case 'movies':
            insertionTable = 'Movies'
            insertionID = 'movie_id'
            ratingColumn = choice === 'up' ? 'movie_upvotes' : 'movie_downvotes'
            break;
        case 'podcasts':
            insertionTable = 'Podcasts'
            insertionID = 'podcast_id'
            ratingColumn = choice === 'up' ? 'podcast_upvotes' : 'podcast_downvotes'
            break;
    }
    try {
        //Decode token to access user details
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const feedbackExists = await findFeedback(decoded.user_id, content_id, insertionTable)
        if (feedbackExists) {
           return res.status(400).json({'Message': 'Rating has already been submitted from this user'})
        } else {
            const insertNew = await newFeedback(decoded.user_id, insertionTable, content_id, choice);
            if (insertNew) {
                await updateContentRating(insertionTable, insertionID, content_id, ratingColumn);
            }
        }
        res.status(200).json({ 'Message': 'Rating submitted successfully' });

    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({"message": "Invalid or expired token"});
    }
}

//these async functions are all for submitRating
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

exports.removeUser = async (req, res) => {
    const { userID } = req.params;
    const connection = connectDB();
    
    //Flag the user for deletion, adjust client appearance and permissions based on this
    const updateUserQuery = 'UPDATE users SET deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ?';

    connection.query(updateUserQuery, userID, (updateError, _updateResults) => {
        if (updateError) {
            console.error('Error: ' + updateError);
            connection.end();
            return res.status(500).json({'message': 'Error deleting user during database operation'});
        }

        //Add the user to deletion table for soft delete, then purge the table routinely (done in another function)
        //BUG: Currently can have duplications of deleted entries on the table, but can fix later
        const newDeleteItemQuery = "INSERT INTO deleted_content (Content_Type, Content_ID) VALUES ('user', ?)";
        
        connection.query(newDeleteItemQuery, userID, (deleteError, _deleteResults) => {
            connection.end(); 

            if (deleteError) {
                console.error('Error: ' + deleteError);
                return res.status(500).json({'message': 'Error adding user to delete table during database operation'});
            }

            res.status(200).json({"message": "Successfully flagged user for deletion and added to delete table"});
        });
    });
};

