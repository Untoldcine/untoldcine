const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

//This only retrieves BTS Series if needed, its depreciated
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
//This only retrieves BTS Movies if needed, its depreciated
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

//main function for getting all BTS content
exports.getSummaryBTSAll = async (_req, res) => {
    try {
        const pre = []
        const prod = []
        const post = []
        
        const series = await getSeries()
        const movies = await getMovies()
        const allMedia = [...series, ...movies]
        allMedia.sort((a, b) => new Date(b.date_created) - new Date(a.date_created))    //this should sort the media so it doesn't stack all series before movies? I think, need more content first to tell
       
        allMedia.forEach((media) => {
            let status = media.movie_status || media.series_status;
            switch (status) {
                case 'pre':
                    pre.push(media);
                    break;
                case 'prod':
                    prod.push(media);
                    break;
                case 'post':
                    post.push(media);
                    break;
                default:
                    console.warn(`Unknown status: ${media.status}`);
            }
        });
        res.status(200).json({ pre, prod, post });
    }
    catch(err) {
        console.error(err + 'Problem querying DB to retrieve summary of all BTS Content Summaries');
        return res.status(500).json({"message" : "Internal server error"});
     }
}

async function getSeries () {
        const uniqueSeriesIDs = await prisma.BTS_Series.findMany({
            select: {
                bts_series_id: true,
                parent_series_id: true,
                date_created: true
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
                date_created: bts.date_created,
                bts_series_id: bts.bts_series_id
            }
        }))
        return seriesData;
}

async function getMovies () {
        const uniqueMovieIDs = await prisma.BTS_Movies.findMany({
            select: {
                bts_movies_id: true,
                parent_movie_id: true,
                date_created: true
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
                date_created: bts.date_created,
                bts_movies_id: bts.bts_movies_id
            }
        }))
        return moviesData;
}

exports.getSummaryBTSAllArray= async (_req, res) => {
    try {
        const series = await getSeries()
        const movies = await getMovies()
        const allMedia = [...series, ...movies]
        allMedia.sort((a, b) => new Date(b.date_created) - new Date(a.date_created))  ;
        res.status(200).json(allMedia);
    }
    catch(err) {
        console.error(err + 'Problem querying DB to retrieve summary of all BTS Content Summaries');
        return res.status(500).json({"message" : "Internal server error"});
     }
}

async function getSeries () {
        const uniqueSeriesIDs = await prisma.BTS_Series.findMany({
            select: {
                bts_series_id: true,
                parent_series_id: true,
                date_created: true
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
                date_created: bts.date_created,
                bts_series_id: bts.bts_series_id
            }
        }))
        return seriesData;
}

async function getMovies () {
        const uniqueMovieIDs = await prisma.BTS_Movies.findMany({
            select: {
                bts_movies_id: true,
                parent_movie_id: true,
                date_created: true
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
                date_created: bts.date_created,
                bts_movies_id: bts.bts_movies_id
            }
        }))
        return moviesData;
}

exports.getSpecificSeriesBTS = async (req, res) => {
    const { series_id } = req.params
    const id = Number(series_id)

    try {
        const data = await prisma.BTS_Series.findMany({
            where: {
                parent_series_id: id
            }
        })
        res.status(200).json(data)
    }

    catch(err) {
        console.error(err + `Problem querying DB to detailed information of BTS Series at id ${series_id}`);
        return res.status(500).json({"message" : "Internal server error"});
     }
}

exports.getSpecificMoviesBTS = async (req, res) => {
    const { movies_id } = req.params
    const id = Number(movies_id)

    try {
        const data = await prisma.BTS_Movies.findMany({
            where: {
                parent_movie_id: id
            }
        })
        res.status(200).json(data)
    }

    catch(err) {
        console.error(err + `Problem querying DB to detailed information of BTS Movies at id ${movies_id}`);
        return res.status(500).json({"message" : "Internal server error"});
     }
}