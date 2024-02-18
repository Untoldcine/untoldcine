const { PrismaClient, ContentTypes} = require('@prisma/client')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const prisma = new PrismaClient();


exports.addToWatchlist = async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({'Message' : 'Not logged in, cannot add to watchlist'})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const {content, content_id} = req.body;
    if (!content || !content_id) {
        return res.status(400).json({'Message': 'Missing Data to add content to watchlist'})
    }

    let insertionTable
    switch(content) {
        case 'video': 
            insertionTable = 'Video'
            break;
        case 'movie':
            insertionTable = 'Movie'
            break;
        case 'podcast':
            insertionTable = 'Podcast'
            break;
        case 'bts_series':
            insertionTable = 'BTS_Series'
            break;
        case 'bts_movie':
            insertionTable = 'BTS_Movie'
            break;
    }
    try {
        const exists = await prisma.Watchlist.findFirst({
            where: {
                content_type: insertionTable,
                user_id: decoded.user_id,
                content_id: content_id
            }
        })
        if (!exists) {
            await prisma.Watchlist.create({
                data: {
                    user_id: decoded.user_id,
                    content_type: insertionTable,
                    content_id: content_id
                }
            })
            return res.status(200).json({"Message": "OK!"})
        }
    }
    catch (err) {
        console.error(err + ': Unable to process adding to watchlist during database operaiton');
        return res.status(500).json({ 'Message': 'Unable to add to watchlist' });
    }
}

exports.getWatchlist = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({'Message' : 'Not logged in, cannot add to watchlist'})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    try {
        const data = await prisma.Watchlist.findMany({
            where: {
                user_id: decoded.user_id
            }
        })
        const chronologicalData = data.sort((a, b) => new Date(a.date_added) - new Date(b.date_added)); //will sort by earliest added to watchlist to latest
        //takes data, if category (e.g. video, movie, etc) doesnt exist, create array. Otherwise, add to array
        const categorizedData = data.reduce((acc, item) => {
            if (!acc[item.content_type]) {
                acc[item.content_type] = [];
            }
            acc[item.content_type].push(item);
            return acc;
        }, {});
        res.status(200).json({dateOrder: chronologicalData, typeOrder: categorizedData})
    }
    catch (err) {
        console.error(err + ': Unable to retrieve watchlist during database operaiton');
        return res.status(500).json({ 'Message': 'Unable to get your watchlist' });
    }
}