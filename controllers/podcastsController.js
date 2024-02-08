const connectDB = require('./connectDB')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

exports.getPodcastSummary = async (_req, res) => {
    try {
        const data = await prisma.podcasts.findMany({
            select: {
                podcast_id: true,
                podcast_name: true,
                podcast_thumbnail: true,
                podcast_type: true
            }
        })
        res.status(200).json(data)
    }
    catch(err) {
        console.error(err + 'Problem querying DB to retrieve summary of all podcasts');
        return res.status(500).json({"message" : "Internal server error"});
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