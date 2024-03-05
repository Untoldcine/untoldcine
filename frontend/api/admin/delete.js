const { PrismaClient} = require('@prisma/client')
require('dotenv').config();

const prisma = new PrismaClient();

// /api/admin/delete - body will need to have a {table, id}

module.exports = async (req, res) => {
    const {table, id} = req.body

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