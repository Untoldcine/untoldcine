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

module.exports = async (req, res) => {
    const { id } = req.query
    const token = req.cookies.token

    if (!token) {
        try {
            const podcastData = await prisma.podcasts.findMany({
                include: {
                    podcast_country: {
                        select: {
                            country: {
                                select: {
                                    country_name: true
                                }
                            }
                        }
                    }
                }
            })
            // const chosenPodcast = podcastData.find(podcast => podcast.podcast_id === parseInt(id));
            const processedPodcasts = podcastData.map((podcast) => {
                const urlString = getURLNameFromDB(podcast.podcast_name)
                const podcastSrc = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/content/${urlString}/id${podcast.podcast_id}${urlString}.mp4`, 
                    signingParams
                );
                const podcastHero = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/heros/${urlString}/id${podcast.podcast_id}${urlString}.webp`, 
                    signingParams
                );
                const podcastThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/thumbnails/${urlString}/id${podcast.podcast_id}${urlString}.webp`, 
                    signingParams
                );
                return {
                    ...podcast,
                    podcast_url: podcastSrc,
                    podcast_hero: podcastHero,
                    podcast_thumbnail: podcastThumbnail,
                    country_name: podcast.podcast_country[0].country.country_name,
                }
            })
            res.status(200).json(processedPodcasts)
        }
    
        catch(err) {
            console.error(err + `Problem querying DB to detailed information of podcast at id ${id}`);
            return res.status(500).json({"message" : "Internal server error"});
         }
    }
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [podcastData, feedbackData] = await Promise.all([
                prisma.podcasts.findMany({
                    include: {
                        podcast_country: {
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
                prisma.feedback.findMany({
                    where: {
                        user_id: decoded.user_id,
                        table_name: 'Podcasts'
                    }
                })
            ])
            // const chosenPodcast = podcastData.find(podcast => podcast.podcast_id === parseInt(id));
            const processedPodcasts = podcastData.map((podcast) => {
                const urlString = getURLNameFromDB(podcast.podcast_name)
                const podcastSrc = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/content/${urlString}/id${podcast.podcast_id}${urlString}.mp4`, 
                    signingParams
                );
                const podcastHero = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/heros/${urlString}/id${podcast.podcast_id}${urlString}.webp`, 
                    signingParams
                );
                const podcastThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/thumbnails/${urlString}/id${podcast.podcast_id}${urlString}.webp`, 
                    signingParams
                );
                return {
                    ...podcast,
                    podcast_url: podcastSrc,
                    podcast_hero: podcastHero,
                    podcast_thumbnail: podcastThumbnail,
                    country_name: podcast.podcast_country[0].country.country_name,
                    reviewed: feedbackData.length > 0 ? true: false,
                    review_choice: feedbackData.length > 0 ? feedbackData[0].feedback_rating : null
                }
            })
            res.status(200).json(processedPodcasts)
        }
    
        catch(err) {
            console.error(err + `Problem querying DB to detailed information of podcast at id ${id}`);
            return res.status(500).json({"message" : "Internal server error"});
         }
    }
}
    

const getURLNameFromDB = (name) => {
    return name.toLowerCase().replace(/\s+/g, "_")
}
