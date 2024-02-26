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
    const token = req.cookies.token
    if (!token) {
        try {
            const data = await prisma.podcasts.findMany({
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
            const processedData = data.map(podcast => {
                const urlString = getURLNameFromDB(podcast.podcast_name);
                const contentThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/thumbnails/${urlString}.jpg`,
                    signingParams
                );
            
                return {
                    ...podcast,
                    country_name: podcast.podcast_country[0].country.country_name,
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
            
            const reviewedPodcastIds = new Set(feedbackData.map(feedback => feedback.item_id));

            const processedData = podcastData.map((podcast) => {
                const urlString = getURLNameFromDB(podcastData.podcast_name)
                const contentThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/podcasts/thumbnails/${urlString}.jpg`,
                    signingParams
                )
            return {
                ...podcast,
                reviewed: reviewedPodcastIds.has(podcast.podcast_id) ,
                country_name: podcast.podcast_country[0].country.country_name,
                podcast_thumbnail: contentThumbnail

        }})
            res.status(200).json(processedData)
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({"message": "Invalid or expired token"});
        }
    }
}

const getURLNameFromDB = (name) => {
    //replace all spaces
    return name.toLowerCase().replace(/\s+/g, "_")
}
