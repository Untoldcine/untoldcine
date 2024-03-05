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
    const token = req.cookies.token

    if (!token) {   //not signed in = not tracking user feedback status for series   
        try {
            const [seriesData, videoData] = await Promise.all([
                prisma.series.findFirst({
                    where: {
                        series_id: parseInt(id)
                    },
                    include: {
                        genres: {                       
                            select: {
                                genre: {
                                    select: {
                                        genre_name: true
                                    }
                                }
                            }
                        },
                        _count : {                      
                            select: {
                                videos: true
                            }
                        },
                        series_country: {
                            select: {
                                country: {
                                    select: {
                                        country_name: true
                                    }
                                }
                            }
                        }
                    }
                }),
                prisma.videos.findMany({
                    where: {
                        parent_series_id: parseInt(id)
                    }
                })
            ])
            //get series hero from CDN
            const urlStringSeries = getURLNameFromDB(seriesData.series_name)
            const seriesHero =  cfsign.getSignedUrl(`${distributionURL}/series/heros/id${seriesData.series_id}${urlStringSeries}.webp`,
            signingParams)
    
            const processedSeriesData = {
                ...seriesData,
                series_hero: seriesHero,
                genres: seriesData.genres.map(g => g.genre.genre_name),
                series_length: seriesData._count.videos,
                country_name: seriesData.series_country[0].country.country_name,
            }
    
            //can potentially be empty series awaiting addition of videos
            if (videoData.length > 0) {
                const processedVideoData = videoData.map((video) => {
                    const urlString = getURLNameFromDB(video.video_name)
                    const thumbnail = cfsign.getSignedUrl(
                        `${distributionURL}/videos/thumbnails/id${video.video_id}${urlString}.webp`,
                        signingParams
                    )
                    const videoSrc = cfsign.getSignedUrl(
                        `${distributionURL}/videos/content/id${video.video_id}${urlString}.mp4`,
        
                    )
                    return {
                        ...video,
                        video_thumbnail: thumbnail,
                        video_src: videoSrc
                    }
                })
                return res.status(200).json({series: processedSeriesData, videos: processedVideoData})
            }
            else {
                return res.status(200).json({series: processedSeriesData})
    
            }
        }
    
        catch(err) {
            console.error(err + `Problem querying DB get detailed series information at series ID: ${id}`);
            return res.status(500).json({"message" : "Internal server error"});
         }
    }
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [seriesData, videoData, feedbackData] = await Promise.all([
                prisma.series.findFirst({
                    where: {
                        series_id: parseInt(id)
                    },
                    include: {
                        genres: {                       
                            select: {
                                genre: {
                                    select: {
                                        genre_name: true
                                    }
                                }
                            }
                        },
                        _count : {                      
                            select: {
                                videos: true
                            }
                        },
                        series_country: {
                            select: {
                                country: {
                                    select: {
                                        country_name: true
                                    }
                                }
                            }
                        }
                    }
                }),
                prisma.videos.findMany({
                    where: {
                        parent_series_id: parseInt(id)
                    }
                }),
                prisma.feedback.findMany({
                    where: {
                        user_id: decoded.user_id,
                        table_name: 'Series'
                    }
                })
            ])
            //this also includes whether the user has submitted feedback for the series
            const urlStringSeries = getURLNameFromDB(seriesData.series_name)
            const seriesHero =  cfsign.getSignedUrl(`${distributionURL}/series/heros/id${seriesData.series_id}${urlStringSeries}.webp`,
            signingParams)
    
            const processedSeriesData = {
                ...seriesData,
                series_hero: seriesHero,
                genres: seriesData.genres.map(g => g.genre.genre_name),
                series_length: seriesData._count.videos,
                country_name: seriesData.series_country[0].country.country_name,
                reviewed: feedbackData.length > 0 ? true: false,
                review_choice: feedbackData.length > 0 ? feedbackData[0].feedback_rating : null
            }
    
            if (videoData.length > 0) {
                const processedVideoData = videoData.map((video) => {
                    const urlString = getURLNameFromDB(video.video_name)
                    const thumbnail = cfsign.getSignedUrl(
                        `${distributionURL}/videos/thumbnails/id${video.video_id}${urlString}.webp`,
                        signingParams
                    )
                    const videoSrc = cfsign.getSignedUrl(
                        `${distributionURL}/videos/content/id${video.video_id}${urlString}.mp4`,
        
                    )
                    return {
                        ...video,
                        video_thumbnail: thumbnail,
                        video_src: videoSrc
                    }
                })
                return res.status(200).json({series: processedSeriesData, videos: processedVideoData})
            }
            else {
                return res.status(200).json({series: processedSeriesData})
    
            }
        }
    
        catch(err) {
            console.error(err + `Problem querying DB get detailed series information at series ID: ${id}`);
            return res.status(500).json({"message" : "Internal server error"});
         }
    }
    
}

const getURLNameFromDB = (name) => {
    //replace all spaces
    return name.toLowerCase().replace(/\s+/g, "_")
}
