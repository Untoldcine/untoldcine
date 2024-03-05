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
            const data = await prisma.movies.findMany()
            const processedData = data.map(movie => {
                const urlString = getURLNameFromDB(movie.movie_name);
                const contentThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/movies/thumbnails/id${movie.movie_id}${urlString}.webp`,
                    signingParams
                );
            
                return {
                    ...movie,
                    movie_thumbnail: contentThumbnail
                };
            });
            
            res.status(200).json(processedData);
        }            
        catch(err) {
            console.error(err + 'Problem querying DB to retrieve summary of all movies');
            return res.status(500).json({"message" : "Internal server error"});
         }
}

const getURLNameFromDB = (name) => {
    return name.toLowerCase().replace(/\s+/g, "_")
}
