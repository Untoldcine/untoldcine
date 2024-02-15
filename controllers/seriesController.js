const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.getSeriesSummary = async (req, res) => {
    const token = req.cookies.token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
    } catch (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({"message": "Invalid or expired token"});
    }

    try {
        const data = await prisma.series.findMany({
            select: {
                series_id: true,
                series_name: true,
                series_thumbnail: true,
                series_status: true,
                genres: {                       //references linked series_genres id and then goes deeper for the genre_name
                    select: {
                        genre: {
                            select: {
                                genre_name: true
                            }
                        }
                    }
                },
                _count : {                       //length of series
                    select: {
                        videos: true
                    }
                }
            }
        })
        const processedData = data.map(series => ({
            series_id: series.series_id,
            series_name: series.series_name,
            series_thumbnail: series.series_thumbnail,
            series_status: series.series_status,
            genres: series.genres.map(g => g.genre.genre_name),
            series_length: series._count.videos
        }));
        res.status(200).json(processedData)
    }
    catch(err) {
        console.error(err + 'Problem querying DB to retrieve summary of all series');
        return res.status(500).json({"message" : "Internal server error"});
     }
}

//This can be refactored for sure. Once we cache the initial data from 'getSummary', we don't need to query as many things once we retrieve the specific series data
//If the difference in space is negligible, then we can just select * from series in the initial getSummary and as a result, only need to query videos for this function

exports.getSpecificSeries = async (req, res) => {
    const { seriesID } = req.params
    const id = Number(seriesID)

    try {
        const data = await prisma.series.findFirst({
            where: {
                series_id: id
            }
        })
        res.status(200).json(data)
    }

    catch(err) {
        console.error(err + `Problem querying DB to detailed information of series at id ${seriesID}`);
        return res.status(500).json({"message" : "Internal server error"});
     }


    // const connection = connectDB();
    // //retrieve all data first and then split into series and related videos
    // const query = 'SELECT series.*, videos.ID as videoID, videos.name, videos.episode, videos.description as videos_description FROM series JOIN videos ON series.ID = videos.series_id WHERE series.ID = ?';
    // connection.query(query, seriesID, (queryError, results) => {
    //     connection.end()
    //     if (queryError){
    //         console.error('Error ' + queryError);   
    //         res.status(500).json({'message' : 'Error retrieving Detailed Series data during database operation'})
    //     }
    //     if (results.length > 0) {
    //         const seriesInfo = {
    //             ID: results[0].ID,
    //             series_name: results[0].series_name,
    //             series_type: results[0].series_type,
    //             rating: results[0].rating,
    //             genres: results[0].genres,
    //             seasons: results[0].seasons,
    //             episodes: results[0].episodes,
    //             length: results[0].length,
    //             description: results[0].description,
    //             status: results[0].status,
    //             created: results[0].date_created
    //         }
    //         const videos = results.map(row => ({
    //             ID: row.videoID,
    //             name: row.name,
    //             episode: row.episode,
    //             description: row.videos_description
    //         }));
    //         return res.status(200).json({ seriesInfo, videos });
    //     }
    //     else {
    //         return res.status(404).json({"message" : "Error returning detailed Series and Video data during database operation"})
    //     }
        
    // })
}


exports.getMovieSummary = async (_req, res) => {
    try {
        const data = await prisma.movies.findMany({
            select: {
                movie_id: true,
                movie_name: true,
                movie_thumbnail: true,
                movie_status: true,
                genres: {                       
                    select: {
                        genre: {
                            select: {
                                genre_name: true
                            }
                        }
                    }
                },
                movie_length: true
            }
        })
        const processedData = data.map(movie => ({
            ...movie,
            genres: movie.genres.map(g => g.genre.genre_name),
        }));
        res.status(200).json(processedData)
    }
    catch(err) {
        console.error(err + 'Problem querying DB to retrieve summary of all movies');
        return res.status(500).json({"message" : "Internal server error"});
     }
}

exports.getSpecificMovies = async (req, res) => {
    const { movieID } = req.params
    const id = Number(movieID)

    try {
        const data = await prisma.movies.findFirst({
            where: {
                movie_id: id
            }
        })
        res.status(200).json(data)
    }

    catch(err) {
        console.error(err + `Problem querying DB to detailed information of movie at id ${movieID}`);
        return res.status(500).json({"message" : "Internal server error"});
     }
}