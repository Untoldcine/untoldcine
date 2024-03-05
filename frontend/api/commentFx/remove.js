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

    const {comment_id, table } = req.body
    if (!comment_id || !table) {
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
                await prisma[insertionTable].update({
                    where: {
                        [insertionID] : parseInt(comment_id),
                        user_id: decoded.user_id
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