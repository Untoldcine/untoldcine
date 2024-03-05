const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
require('dotenv').config();
const cfsign = require('aws-cloudfront-sign');

const signingParams = {
    keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY,
    expireTime: new Date(Date.now() + 1000 * 60 * 60 * 24)
}
const distributionURL = 'https://d3t2pr7vhgu8da.cloudfront.net'

module.exports = async (_req, res) => {
        try {
            const data = await prisma.podcasts.findMany()
            const processedData = data.map(podcast => {
                const urlString = getURLNameFromDB(podcast.podcast_name);
                const contentThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/thumbnails/${urlString}/id${podcast.podcast_id}${urlString}.webp`,
                    signingParams
                );
            
                return {
                    ...podcast,
                    podcast_thumbnail: contentThumbnail
                };
            });
            
            res.status(200).json(processedData);
        }            
        catch(err) {
            console.error(err + 'Problem querying DB to retrieve summary of all podcasts');
            return res.status(500).json({"message" : "Internal server error"});
         }
}

const getURLNameFromDB = (name) => {
    return name.toLowerCase().replace(/\s+/g, "_")
}
