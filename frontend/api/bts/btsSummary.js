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

// /api/bts/btsSummary

// may need to rework this. 

module.exports = async (_req, res) => {
    try {
        const pre = []
        const prod = []
        const post = []
        
        const series = await getSeries()
        const movies = await getMovies()
        const allMedia = [...series, ...movies]
        allMedia.sort((a, b) => new Date(b.date_created) - new Date(a.date_created))  
       
        allMedia.forEach((media) => {
            let status = media.movie_status || media.series_status;
            switch (status) {
                case 'pre':
                    pre.push(media);
                    break;
                case 'prod':
                    prod.push(media);
                    break;
                case 'post':
                    post.push(media);
                    break;
                default:
                    console.error(`Unknown status: ${media.status}`);
            }
        });
        res.status(200).json({ pre, prod, post });
    }
    catch(err) {
        console.error(err + 'Problem querying DB to retrieve summary of all BTS Content Summaries');
        return res.status(500).json({"message" : "Internal server error"});
     }
}

async function getSeries () {
        const uniqueSeriesIDs = await prisma.bTS_Series.findMany({
            distinct: ['parent_series_id'] //only allows unique values
        })
        const seriesData = await Promise.all(uniqueSeriesIDs.map(async (bts) => {
            const seriesDetail = await prisma.series.findUnique({
                where: {
                    series_id: bts.parent_series_id
                },
                select: {
                    series_id: true,
                    series_name: true,
                    series_status: true,
                    series_thumbnail: true
                }
            })
            const urlString = getURLNameFromDB(bts.bts_series_name);
            const btsThumbnail = cfsign.getSignedUrl(
                `${distributionURL}/bts_series/thumbnails/id${bts.bts_series_name}${urlString}.webp`,
                signingParams
            );
            const btsUrl= cfsign.getSignedUrl(
                `${distributionURL}/bts_series/content/id${bts.bts_series_name}${urlString}.mp4`,
                signingParams
            );
            return {
                ...seriesDetail,
                date_created: bts.date_created,
                bts_series_id: bts.bts_series_id,
                bts_series_thumbnail: btsThumbnail,
                bts_series_url: btsUrl
            }
        }))
        return seriesData;
}

async function getMovies () {
        const uniqueMovieIDs = await prisma.bTS_Movies.findMany({
            distinct: ['parent_movie_id']
        })
        const moviesData = await Promise.all(uniqueMovieIDs.map(async (bts) => {
        const moviesDetail = await prisma.movies.findUnique({
                where: {
                    movie_id: bts.parent_movie_id
                },
                select: {
                    movie_id: true,
                    movie_name: true,
                    movie_status: true,
                    movie_thumbnail: true
                }
            })
            const urlString = getURLNameFromDB(bts.bts_movies_name);
            const btsThumbnail = cfsign.getSignedUrl(
                `${distributionURL}/bts_movies/thumbnails/id${bts.bts_movies_name}${urlString}.webp`,
                signingParams
            );
            const btsUrl= cfsign.getSignedUrl(
                `${distributionURL}/bts_movies/content/id${bts.bts_series_name}${urlString}.mp4`,
                signingParams
            );
            return {
                ...moviesDetail,
                date_created: bts.date_created,
                bts_movies_id: bts.bts_movies_id,
                bts_movies_thumbnail: btsThumbnail,
                bts_movies_url: btsUrl

            }
        }))
        return moviesData;
}