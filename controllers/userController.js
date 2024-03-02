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
    let ratingColumn

    switch(table) {
        case 'series':
            insertionTable = 'Series_Comments'
            insertionID = 'series_comments_id'
            ratingColumn = choice === 'up' ? 'series_comments_upvotes' : 'series_comments_downvotes'
            break;
        case 'movie':
            insertionTable = 'Movie_Comments'
            insertionID = 'movie_comments_id'
            ratingColumn = choice === 'up' ? 'movie_comments_upvotes' : 'movie_comments_downvotes'
            break;
        case 'podcast':
            insertionTable = 'Podcast_Comments'
            insertionID = 'podcast_comments_id'
            ratingColumn = choice === 'up' ? 'podcast_comments_upvotes' : 'podcast_comments_downvotes'
            break;
    }
    try {
        const feedbackExists = await findFeedback(decoded.user_id, comment_id, insertionTable);

        // If feedback exists, check if the rating choice has changed
        if (feedbackExists) {
            if (feedbackExists.feedback_rating !== choice) {
                // Update the feedback entry and the content rating
                await updateFeedbackEntry(feedbackExists, choice);
                await updateContentRating(insertionTable, insertionID, comment_id, ratingColumn);
            }
            // If the choice hasn't changed, do nothing to avoid duplicate voting
        } else {
            // If feedback doesn't exist, add new feedback and update the content rating
            const insertNew = await newFeedback(decoded.user_id, insertionTable, comment_id, choice);
            if (insertNew) {
                await updateContentRating(insertionTable, insertionID, comment_id, ratingColumn);
            }
        }
        res.status(200).json({ 'Message': 'Rating submitted successfully' });
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

//these 4 async functions are all for submitRating
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

async function updateFeedbackEntry(feedbackObj, choice) {
    const {feedback_id, feedback_rating} = feedbackObj

    let newRating
    if (choice === 'up' && feedback_rating !== 'up') {
        newRating = 'up'
    }
    else if (choice === 'down' && feedback_rating !== 'down') {
        newRating = 'down'
    }
    else {
        newRating = feedback_rating
    }
    return prisma.Feedback.update({
        where: {
            feedback_id: feedback_id,
        },
        data: {
            feedback_rating: newRating
        },
    });
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

async function updateContentRating(insertionTable, insertionID, content_id, ratingColumn) {
    return prisma[insertionTable].update({
        where:{
            [insertionID]: content_id
        },
        data: {
            [ratingColumn]: {
                increment: 1
            }
        }
    })
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

exports.adminLogIn = async(req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json({"message" : "Missing email or password"})
    }
    if (email !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({"message" : "Incorrect credentials"})
    }
    return res.status(200).json({"message" : "Welcome Malcolm"})
}

exports.adminGetAll = async(req, res) => {
    const [seriesData, videoData, movieData, podcastData, btsSeriesData, btsMoviesData, countries, genres] = await Promise.all([
        prisma.series.findMany({
            where: {
                deleted: false
            },
            include: {
                series_country: {
                    select: {
                        country_id: true,
                        country: { 
                            select: {
                                country_id: true, 
                                country_name: true 
                            }
                        }
                    }
                }
            }
        }),
        prisma.videos.findMany({
            where: {
                deleted: false
            },
            include: {
                series: {
                    select: {
                        series_name: true
                    }
                }
            }
        }),
        prisma.movies.findMany({
            where: {
                deleted: false
            },
        }),
        prisma.podcasts.findMany({
            where: {
                deleted: false
            },
        }),
        prisma.bTS_Series.findMany({
            where: {
                deleted: false
            },
            include: {
                series: {
                    select: {
                        series_name: true
                    }
                }
            }
        }),
        prisma.bTS_Movies.findMany({
            where: {
                deleted: false
            },
            include: {
                movies: {
                    select: {
                        movie_name: true
                    }
                }
            }
        }),
        prisma.countries.findMany(),
        prisma.genres.findMany()
    ])
    res.status(200).json({series:seriesData, video: videoData, movie: movieData, podcasts: podcastData, bts_series: btsSeriesData, bts_movies: btsMoviesData, countries: countries, genres: genres})
}

exports.adminUpdate = async (req, res) => {
    //may need to capitalize the table params due to prisma schema shit
    const {table} = req.params
    // console.log(table);
    // console.log(req.body);

    if (table === 'series') {
        const updated = updateSeries(req.body)
        res.status(200).json(updated)
    }
    if (table === 'video') {
        const updated = updateVideos(req.body)
        res.status(200).json(updated)
    }
    if (table === 'movie') {
        const updated = updateMovies(req.body)
        res.status(200).json(updated)
    }
    if (table === 'podcast') {
        const updated = updatePodcast(req.body)
        res.status(200).json(updated)
    }
    if (table === 'bts_series') {
        const updated = updateBTSSeries(req.body)
        res.status(200).json(updated)
    }
    if (table === 'bts_movies') {
        const updated = updateBTSMovies(req.body)
        res.status(200).json(updated)
    }
 
}

async function updateSeries(obj) {
    const updateField = await prisma.series.update({
        where: {
            series_id: obj.series_id
        },
        data: {
            series_name: obj.series_name,
            series_status: obj.series_status,
            series_upvotes : parseInt(obj.series_upvotes) || 0,
            series_downvotes : parseInt(obj.series_downvotes) || 0,
            series_main : obj.series_main || null,
            series_directors : obj.series_director || null,
            series_producers : obj.series_producer || null,
            series_starring: obj.series_starring || null,
            series_thumbnail : obj.series_thumbnail || null,
            date_created : convertToISOString(obj.date_created),
            completed: obj.completed === 'true'
        }
    })
    // console.log(updateField);
    return updateField

}

async function updateVideos(obj) {
    const updateField = await prisma.videos.update({
        where: {
            video_id: obj.video_id
        },
        data: {
            video_name: obj.video_name,
            video_main : obj.video_main || null,
            video_length: parseInt(obj.video_length) || 0,
            video_season: parseInt(obj.video_season) || 1,
            video_episode: parseInt(obj.video_episode) || 1,
            video_thumbnail : obj.video_thumbnail || null,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField

}

async function updateMovies(obj) {
    const updateField = await prisma.movies.update({
        where: {
            movie_id: obj.movie_id
        },
        data: {
            movie_name: obj.movie_name,
            movie_status: obj.movie_status,
            movie_main : obj.movie_main || null,
            movie_length: parseInt(obj.movie_length) || 0,
            movie_directors : obj.movie_directors || null,
            movie_producers : obj.movie_producers || null,
            movie_starring: obj.movie_starring || null,
            movie_thumbnail : obj.movie_thumbnail || null,
            movie_upvotes : parseInt(obj.movie_upvotes) || 0,
            movie_downvotes : parseInt(obj.movie_downvotes) || 0,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField
}

async function updatePodcast(obj) {
    const updateField = await prisma.podcasts.update({
        where: {
            podcast_id: obj.podcast_id
        },
        data: {
            podcast_name: obj.podcast_name,
            podcast_status: obj.podcast_status,
            podcast_type: obj.podcast_type,
            podcast_main : obj.podcast_main || null,
            podcast_episode: parseInt(obj.podcast_episode) || 1,
            podcast_directors : obj.podcast_directors || null,
            podcast_producers : obj.podcast_producers || null,
            podcast_starring: obj.podcast_starring || null,
            podcast_thumbnail : obj.podcast_thumbnail || null,
            podcast_upvotes : parseInt(obj.podcast_upvotes) || 0,
            podcast_downvotes : parseInt(obj.podcast_downvotes) || 0,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField
}

async function updateBTSSeries(obj) {
    const updateField = await prisma.bTS_Series.update({
        where: {
            bts_series_id: obj.bts_series_id
        },
        data: {
            bts_series_name: obj.bts_series_name,
            bts_series_main : obj.bts_series_main || null,
            bts_series_length: parseInt(obj.bts_series_length) || 0,
            bts_series_thumbnail: obj.bts_series_thumbnail || null,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField
}
async function updateBTSMovies(obj) {
    const updateField = await prisma.bTS_Movies.update({
        where: {
            bts_movies_id: obj.bts_movies_id
        },
        data: {
            bts_movies_name: obj.bts_movies_name,
            bts_movies_main : obj.bts_movies_main || null,
            bts_movies_length: parseInt(obj.bts_movies_length) || 0,
            bts_movies_thumbnail: obj.bts_movies_thumbnail || null,
            date_created : convertToISOString(obj.date_created),
        }
    })
    // console.log(updateField);
    return updateField
}

function convertToISOString(inputDate) {
    const date = new Date(inputDate);
    const isoString = date.toISOString();

    return isoString;
}

exports.adminDelete = async (req, res) => {
    const {table, id} = req.params

    let insertionTable
    let insertionID 
    let deleteTableEntry

    switch(table) {
        case 'series':
            insertionTable = 'Series'
            insertionID = 'series_id'
            deleteTableEntry = 'Series'
            break;
        case 'movie':
            insertionTable = 'Movies'
            insertionID = 'movie_id'
            deleteTableEntry = 'Movie'
            break;
        case 'podcast':
            insertionTable = 'Podcasts'
            insertionID = 'podcast_id'
            deleteTableEntry = 'Podcast'
            break;
        case 'bts_series':
            insertionTable = 'BTS_Series'
            insertionID = 'bts_series_id'
            deleteTableEntry = 'BTS_Series'
            break;
        case 'bts_movies':
            insertionTable = 'BTS_Movies'
            insertionID = 'bts_movies_id'
            deleteTableEntry = 'BTS_Movie'
            break;
    }
    const flagForDeletion = await prisma[insertionTable].update({
        where: {
            [insertionID]: parseInt(id)
        },
        data: {
            deleted: true,
            deleted_at: new Date()
        }
    }) 
    const newDeleteEntry = await prisma.deleted_Content.create({
        data: {
            content_type: deleteTableEntry,
            content_id: parseInt(id)
        }
    })
    if (flagForDeletion && newDeleteEntry) {
        res.status(200).json({"message": "Deletion successful"})
    }
}