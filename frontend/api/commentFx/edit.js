const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
require('dotenv').config();

// /api/commentFx/edit
// This API should only be exposed if the comment has a 'self' flag meaning it is the user's own comment.
module.exports = async (req, res) => {
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