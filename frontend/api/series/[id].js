const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require('dotenv').config();
const cfsign = require('aws-cloudfront-sign');

const signingParams = {
    keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY,
    expireTime: new Date(Date.now() + 1000 * 60 * 60 * 24)
}
const distributionURL = 'https://d3t2pr7vhgu8da.cloudfront.net'

module.exports = async (req, res) => {
    const { id } = req.query
    try {
        const [seriesData, videoData] = await Promise.all([
            prisma.series.findFirst({
                where: {
                    series_id: parseInt(id)
                }
            }),
            prisma.videos.findMany({
                where: {
                    parent_series_id: parseInt(id)
                }
            })
        ])
        //TO DO: NEED TO GET SIGNED URL FOR FIRST VIDEO OF THE SERIES
        //TO DO: NEED TO GET THUMBNAIL SIGNED URLS FOR THE REST OF THE SERIES
        
        // const urlString = getURLNameFromDB(series.series_name);
        // const contentThumbnail = cfsign.getSignedUrl(
        //     `${distributionURL}/series/thumbnails/${urlString}.webp`,
        //     signingParams
        // );
        // const firstVideo = 
        // res.status(200).json({series: seriesData, videos: videoData, firstVideo})
    }

    catch(err) {
        console.error(err + `Problem querying DB get detailed series information at series ID: ${id}`);
        return res.status(500).json({"message" : "Internal server error"});
     }
}

const getURLNameFromDB = (name) => {
    //replace all spaces
    return name.toLowerCase().replace(/\s+/g, "_")
}
