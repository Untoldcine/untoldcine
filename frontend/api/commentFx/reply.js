const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require('dotenv').config();


// /api/commentFx/reply

module.exports = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({'Message' : 'Not logged in, cannot create a new comment'})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const {comment, parent_comment_id, table, parent_content_id} = req.body;
    if (!comment || !parent_comment_id || !table || !parent_content_id) {
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
                user_id: decoded.user_id,
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