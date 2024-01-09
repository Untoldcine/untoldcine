const connectDB = require('./connectDB')

exports.getSummary = async (_req, res) => {
    const connection = connectDB();
    const query = 'SELECT ID, series_type, series_name, genres, episodes, length, rating FROM series'

    connection.query(query, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : 'Error retrieving summary of Series Data during database operation'})
        }
        res.status(200).json({results})
    })
}


exports.getSummaryBTS = async (req, res) => {
    const connection = connectDB();
    const query = 'SELECT series_name, ID, status FROM series'
    connection.query(query, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : 'Error retrieving summary of BTS data during database operation'})
        }
        const pre = []
        const prod = []
        const post = []
        results.forEach((series) => {
            if (series.status === 'pre') {
                pre.push(series)
            }
            if (series.status === 'prod') {
                prod.push(series)
            }if (series.status === 'post') {
                post.push(series)
            }
        })
        res.status(200).json({"pre": pre, "prod":prod, "post":post})
    })
}

//This can be refactored for sure. Once we cache the initial data from 'getSummary', we don't need to query as many things once we retrieve the specific series data
//If the difference in space is negligible, then we can just select * from series in the initial getSummary and as a result, only need to query videos for this function

exports.getSpecificSeries = async (req, res) => {
    const {seriesID} = req.params
    const connection = connectDB();
    //retrieve all data first and then split into series and related videos
    const query = 'SELECT series.*, videos.ID as videoID, videos.name, videos.episode, videos.description as videos_description FROM series JOIN videos ON series.ID = videos.series_id WHERE series.ID = ?';
    connection.query(query, seriesID, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : 'Error retrieving Detailed Series data during database operation'})
        }
        if (results.length > 0) {
            const seriesInfo = {
                ID: results[0].ID,
                series_name: results[0].series_name,
                series_type: results[0].series_type,
                rating: results[0].rating,
                genres: results[0].genres,
                seasons: results[0].seasons,
                episodes: results[0].episodes,
                length: results[0].length,
                description: results[0].description,
                status: results[0].status,
                created: results[0].date_created
            }
            const videos = results.map(row => ({
                ID: row.videoID,
                name: row.name,
                episode: row.episode,
                description: row.videos_description
            }));
            return res.status(200).json({ seriesInfo, videos });
        }
        else {
            return res.status(404).json({"message" : "Error returning detailed Series and Video data during database operation"})
        }
        
    })


    
}

//should update somewhere that this user submitted this rating for algorithm
//And as a result, track that the user has already submitted their rating for this content
exports.submitRating = async (req, res) => {
    const {userID, contentID, choice} = req.params;
    const connection = connectDB();
    let query;
    if (choice === 'like') {
        query = 'UPDATE series SET rating = JSON_SET(rating, \'$.Upvotes\', JSON_VALUE(rating, \'$.Upvotes\') + 1) WHERE id = ?';
    } else if (choice === 'dislike') {
        query = 'UPDATE series SET rating = JSON_SET(rating, \'$.Downvotes\', JSON_VALUE(rating, \'$.Downvotes\') + 1) WHERE id = ?';
    }
    connection.query(query, contentID, (queryError, _results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : 'Error updating rating during database operation'})
        }
        res.sendStatus(200)
    })
}