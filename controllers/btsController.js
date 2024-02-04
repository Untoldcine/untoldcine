const connectDB = require('./connectDB')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

exports.getSummaryBTSSeries = async (_req, res) => {
    //get all series that have at least 1 'bts' episode associated with it.
    try {
        const uniqueSeriesIDs = await prisma.BTS_Series.findMany({
            select: {
                bts_series_id: true,
                parent_series_id: true
            },
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
            return {
                ...seriesDetail,
                bts_series_id: bts.bts_series_id
            }
        }))
        return res.status(200).json(seriesData)
    }
    catch(err) {
        console.error(err + 'Problem querying DB to retrieve summary of all BTS Series');
        return res.status(500).json({"message" : "Internal server error"});
     }
}

exports.getSummaryBTSMovies = async (_req, res) => {
    try {
        const uniqueMovieIDs = await prisma.BTS_Movies.findMany({
            select: {
                bts_movies_id: true,
                parent_movie_id: true
            },
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
            return {
                ...moviesDetail,
                bts_movies_id: bts.bts_movies_id
            }
        }))
        return res.status(200).json(moviesData)
    }
    catch(err) {
        console.error(err + 'Problem querying DB to retrieve summary of all BTS Movies');
        return res.status(500).json({"message" : "Internal server error"});
     }
}

exports.getSpecificBTS = async (req, res) => {
    const {seriesID} = req.params;
    const connection = connectDB();
    const query = `SELECT bts.id, bts.name, bts.episode, bts.description, bts.date_created, series.description AS series_description from bts JOIN series ON bts.series_id = series.id WHERE series_id = ${seriesID}`
    connection.query(query, (queryError, results) => {
        connection.end()
        if (queryError){
            console.error('Error ' + queryError);   
            res.status(500).json({'message' : 'Error retrieving specific BTS data during database operation'})
        }
        res.status(200).json({results})
    })
}