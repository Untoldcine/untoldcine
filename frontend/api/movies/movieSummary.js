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
            const processedData = data.map(movie => {
                const urlString = getURLNameFromDB(movie.movie_name);
                const contentThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/movies/thumbnails/${urlString}.webp`,
                    signingParams
                );
            
                return {
                    ...movie,
                    genres: movie.genres.map(g => g.genre.genre_name),
                    country_name: movie.movie_country[0].country.country_name,
                    movie_thumbnail: contentThumbnail
                };
            });
            
            res.status(200).json(processedData);
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
                        table_name: 'Movies'
                    }
                })
            ])
            
            const reviewedMovieIds = new Set(feedbackData.map(feedback => feedback.item_id));

            const processedData = movieData.map((movie) => {
                const urlString = getURLNameFromDB(movieData.movie_name)
                const contentThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/movies/thumbnails/${urlString}.jpg`,
                    signingParams
                )
            return {
                ...movie,
                genres: movie.genres.map(g => g.genre.genre_name),
                reviewed: reviewedMovieIds.has(movie.movie_id) ,
                country_name: movie.movie_country[0].country.country_name,
                movie_thumbnail: contentThumbnail

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
