const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.getPodcastSummary = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        try {
            const data = await prisma.podcasts.findMany()
            res.status(200).json(data)
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
                prisma.podcasts.findMany(),
                prisma.feedback.findMany({
                    where: {
                        user_id: decoded.user_id,
                        table_name: 'Podcasts'
                    }
                })
            ])
            const reviewedPodcastIds = new Set(feedbackData.map(feedback => feedback.item_id));
            const processedData = podcastData.map((podcast) => ({
                ...podcast,
                reviewed: reviewedPodcastIds.has(podcast.podcast_id)               
            }))
            res.status(200).json(processedData)
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({"message": "Invalid or expired token"});
        }
    }
}

exports.getSpecificPodcast = async (req, res) => {
    const { podcastID } = req.params
    const id = Number(podcastID)

    try {
        const data = await prisma.podcasts.findFirst({
            where: {
                podcast_id: id
            }
        })
        res.status(200).json(data)
    }

    catch(err) {
        console.error(err + `Problem querying DB to detailed information of podcast at id ${podcastID}`);
        return res.status(500).json({"message" : "Internal server error"});
     }
}