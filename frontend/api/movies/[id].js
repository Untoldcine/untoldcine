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
    const { id } = req.query
    const token = req.cookies.token
    if (!token) {
        try {
            const data = await prisma.movies.findUnique({
                where: {
                    movie_id: parseInt(id)
                },
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
            const urlString = getURLNameFromDB(data.movie_name);
                const movieSrc = cfsign.getSignedUrl(
                    `${distributionURL}/movies/content/id${data.movie_id}${urlString}.mp4`, 
                    signingParams
                );
                const movieHero = cfsign.getSignedUrl(
                    `${distributionURL}/movies/heros/id${data.movie_id}${urlString}.webp`, 
                    signingParams
                );
                const movieThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/movies/thumbnails/id${data.movie_id}${urlString}.webp`, 
                    signingParams
                );
            const processedData = {
                ...data,
                genres: data.genres.map(g => g.genre.genre_name),
                country_name: data.movie_country[0].country.country_name,
                movie_thumbnail: movieThumbnail,
                movie_url: movieSrc,
                movie_hero: movieHero
            }
            
            res.status(200).json(processedData);
        }            
        catch(err) {
            console.error(err + 'Problem querying DB to retrieve specific movie');
            return res.status(500).json({"message" : "Internal server error"});
         }
    }
    else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const [movieData, feedbackData] = await Promise.all([
                prisma.movies.findUnique({
                    where: {
                        movie_id: parseInt(id)
                    },
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
            const urlString = getURLNameFromDB(movieData.movie_name);
                const movieSrc = cfsign.getSignedUrl(
                    `${distributionURL}/movies/content/id${movieData.movie_id}${urlString}.mp4`, 
                    signingParams
                );
                const movieHero = cfsign.getSignedUrl(
                    `${distributionURL}/movies/heros/id${movieData.movie_id}${urlString}.webp`, 
                    signingParams
                );
                const movieThumbnail = cfsign.getSignedUrl(
                    `${distributionURL}/movies/thumbnails/id${movieData.movie_id}${urlString}.webp`, 
                    signingParams
                );
            const processedData = {
                ...movieData,
                genres:movieData.genres.map(g => g.genre.genre_name),
                country_name:movieData.movie_country[0].country.country_name,
                movie_thumbnail: movieThumbnail,
                movie_url: movieSrc,
                movie_hero: movieHero,
                reviewed: feedbackData.length > 0 ? true: false,
                review_choice: feedbackData.length > 0 ? feedbackData[0].feedback_rating : null
            }
            
            res.status(200).json(processedData);
        } catch (err) {
            console.error('Error:', err);
            return res.status(401).json({"message": "Error during DB operation to get specific movie details"});
        }
    }
}

const getURLNameFromDB = (name) => {
    return name.toLowerCase().replace(/\s+/g, "_")
}
