const connectDB = require('./connectDB')

exports.getSummary = async(_req, res) => {
    const connection = connectDB();
    const query = 'SELECT ID, name, media_type, episode FROM podcasts'
    connection.query(query, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            return res.status(500).json({'message' : 'Error retrieving summary of Series Data during database operation'})
        }
        res.status(200).json({results})
    })
}

exports.getRelatedContent = async(req, res) => {
    const {podcastID} = req.params;
    const connection = connectDB();
    // const query = 'SELECT podcasts.ID, podcasts.name, series.id FROM podcasts JOIN series ON podcasts.series_id WHERE '
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