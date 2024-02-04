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
    const {podcastID} = req.params;
    const connection = connectDB();
    const query = 'SELECT ID, name, media_type, episode, genre, rating FROM podcasts WHERE id = ?'
    connection.query(query, podcastID, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : `Error retrieving deeper Podcast Data at ID ${podcastID} during database operation`})
        }
        res.status(200).json({results})
    })
    // const query = 'SELECT podcasts.ID, podcasts.name, podcasts.media_type, podcasts.episode, podcasts.genre, podcasts.rating, series.series_name FROM podcasts JOIN series ON podcasts.related_media WHERE series.ID = ?'

}