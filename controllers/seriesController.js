const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.getSeriesSummary = async (req, res) => {
    const token = req.cookies.token
    //if there is no token, just return all the content as is. If there is, go to ELSE
    if (!token) {
        try {
            const data = await prisma.series.findMany({
                include: {
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
                    },
                    series_country: {
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
            const processedData = data.map(series => ({
                ...series,
                genres: series.genres.map(g => g.genre.genre_name),
                series_length: series._count.videos,
                country_name: series.series_country[0].country.country_name
            }));
            res.status(200).json(processedData)
        }
        catch(err) {
            console.error(err + 'Problem querying DB to retrieve summary of all series');
            return res.status(500).json({"message" : "Internal server error"});
         }
    }
    //checks if the logged in user has already reviewed content (either upvote/downvote), return that piece of information
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [seriesData, feedbackData] = await Promise.all([
                prisma.series.findMany({
                    include: {
                        genres: {                       
                            select: {
                                genre: {
                                    select: {
                                        genre_name: true
                                    }
                                }
                            }
                        },
                        _count : {                       
                            select: {
                                videos: true
                            }
                        },
                        series_country: {
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
                        table_name: 'Series',
                    }
                })
            ]) 
            const reviewedSeriesIds = new Set(feedbackData.map(feedback => feedback.item_id));

            const processedData = seriesData.map(series => ({
                    ...series,
                    genres: series.genres.map(g => g.genre.genre_name),
                    series_length: series._count.videos, 
                    country_name: series.series_country[0].country.country_name,
                    reviewed: reviewedSeriesIds.has(series.series_id)  
                }));
            res.status(200).json(processedData)
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({"message": "Invalid or expired token"});
        }
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

}

exports.getMovieSummary = async (req, res) => {
    const token = req.cookies.token
    if (!token) {
        try {
            const data = await prisma.movies.findMany({
                include: {
                    genres: {                       
                        select: {
                            genre: {
                                select: {
                                    genre_name: true
                                }
                            }
                        }
                    },
                    movie_country: {
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
            const processedData = data.map(movie => ({
                ...movie,
                genres: movie.genres.map(g => g.genre.genre_name),
                country_name: movie.movie_country[0].country.country_name
            }));
            res.status(200).json(processedData)
        }
        catch(err) {
            console.error(err + 'Problem querying DB to retrieve summary of all movies');
            return res.status(500).json({"message" : "Internal server error"});
         }
    }
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [movieData, feedbackData] = await Promise.all([
                prisma.movies.findMany({
                    include: {
                        genres: {                       
                            select: {
                                genre: {
                                    select: {
                                        genre_name: true
                                    }
                                }
                            }
                        },
                        movie_country: {
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
                        table_name: 'Movies',
                    }
                })
            ]) 
            const reviewedMovieIds = new Set(feedbackData.map(feedback => feedback.item_id));

            const processedData = movieData.map(movie => ({
                ...movie,
                genres: movie.genres.map(g => g.genre.genre_name),
                reviewed: reviewedMovieIds.has(movie.movie_id),
                country_name: movie.movie_country[0].country.country_name
            }));
            res.status(200).json(processedData)
        } catch (err) {
            console.error('Token verification error:', err);
            return res.status(401).json({"message": "Invalid or expired token"});
        }
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
