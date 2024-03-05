const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({'Message' : 'Not logged in, cannot create a new comment'})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {comment, table_name, content_id} = req.body;
    if (!comment || !content_id || !table_name) {
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
                user_id: decoded.user_id
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

