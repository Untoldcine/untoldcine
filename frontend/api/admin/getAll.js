const { PrismaClient} = require('@prisma/client')
require('dotenv').config();
const cfsign = require('aws-cloudfront-sign');

const prisma = new PrismaClient();

// /api/admin/getAll

module.exports = async(_req, res) => {
    const [seriesData, videoData, movieData, podcastData, btsSeriesData, btsMoviesData, countries, genres] = await Promise.all([
        prisma.series.findMany({
            where: {
                deleted: false
            },
            include: {
                series_country: {
                    select: {
                        country_id: true,
                        country: { 
                            select: {
                                country_id: true, 
                                country_name: true 
                            }
                        }
                    }
                }
            }
        }),
        prisma.videos.findMany({
            where: {
                deleted: false
            },
            include: {
                series: {
                    select: {
                        series_name: true
                    }
                }
            }
        }),
        prisma.movies.findMany({
            where: {
                deleted: false
            },
            include: {
                movie_country: {
                    select: {
                        country_id: true,
                        country: { 
                            select: {
                                country_id: true, 
                                country_name: true 
                            }
                        }
                    }
                }
            }
        }),
        prisma.podcasts.findMany({
            where: {
                deleted: false
            },
        }),
        prisma.bTS_Series.findMany({
            where: {
                deleted: false
            },
            include: {
                series: {
                    select: {
                        series_name: true
                    }
                }
            }
        }),
        prisma.bTS_Movies.findMany({
            where: {
                deleted: false
            },
            include: {
                movies: {
                    select: {
                        movie_name: true
                    }
                }
            }
        }),
        prisma.countries.findMany(),
        prisma.genres.findMany()
    ])
    const processedSeries = await getSeriesAssets(seriesData)
    const processedVideos = await getVideoAssets(videoData)
    const processedMovies = await getMovieAssets(movieData)
    const processedPodcasts = await getPodcastAssets(podcastData)
    const processedBTSSeries = await getBTSSeriesAssets(btsSeriesData)
    const processedBTSMovies = await getBTSMoviesAssets(btsMoviesData)

    res.status(200).json({series:processedSeries, video: processedVideos, movie: processedMovies, podcast: processedPodcasts, bts_series: processedBTSSeries, bts_movies: processedBTSMovies, countries: countries, genres: genres})
}

//for getting CDN content
const distributionURL = 'https://d3t2pr7vhgu8da.cloudfront.net'
const signingParams = {
    keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY,
    expireTime: new Date(Date.now() + 1000 * 60 * 60 * 24)
}

async function getSeriesAssets(arrayOfSeries) {
    const arr = arrayOfSeries.map((series) => {
        const urlString = getURLNamePath(series.series_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/series/thumbnails/id${series.series_id}${urlString}.webp`, 
            signingParams
        );
        const signedHero = cfsign.getSignedUrl(
            `${distributionURL}/series/heros/id${series.series_id}${urlString}.webp`, 
            signingParams 
        )
        return {
            ...series,
            series_country: {country_name: series.series_country[0].country.country_name, country_id: series.series_country[0].country_id},
            series_thumbnail: signedThumbnail,
            series_hero: signedHero
        }
    })
    return arr
}
async function getVideoAssets(arrayofVideos) {
    const arr = arrayofVideos.map((video) => {
        const urlString = getURLNamePath(video.video_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/videos/thumbnails/id${video.video_id}${urlString}.webp`, 
            signingParams
        );
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/videos/content/id${video.video_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...video,
            video_thumbnail: signedThumbnail,
            video_url: signedContent
        }
    })
    return arr
}
async function getMovieAssets(arrayOfMovies) {
    const arr = arrayOfMovies.map((movie) => {
        const urlString = getURLNamePath(movie.movie_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/movies/thumbnails/id${movie.movie_id}${urlString}.webp`, 
            signingParams
        );
        const signedHero = cfsign.getSignedUrl(
            `${distributionURL}/movies/heros/id${movie.movie_id}${urlString}.webp`, 
            signingParams 
        )
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/movies/content/id${movie.movie_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...movie,
            movie_country: {country_name: movie.movie_country[0].country.country_name, country_id: movie.movie_country[0].country_id},
            movie_thumbnail: signedThumbnail,
            movie_hero: signedHero,
            movie_url: signedContent
        }
    })
    return arr
}
async function getPodcastAssets(arrayOfPodcasts) {
    const arr = arrayOfPodcasts.map((podcast) => {
        const urlString = getURLNamePath(podcast.podcast_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/podcasts/thumbnails/${urlString}/id${podcast.podcast_id}${urlString}.webp`, 
            signingParams
        );
        const signedHero = cfsign.getSignedUrl(
            `${distributionURL}/podcasts/heros/${urlString}/id${podcast.podcast_id}${urlString}.webp`, 
            signingParams 
        )
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/podcasts/content/${urlString}/id${podcast.podcast_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...podcast,
            podcast_thumbnail: signedThumbnail,
            podcast_hero: signedHero,
            podcast_url: signedContent
        }
    })
    return arr
}
async function getBTSSeriesAssets(array) {
    const arr = array.map((bts_series) => {
        const urlString = getURLNamePath(bts_series.bts_series_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/bts_series/thumbnails/${urlString}/id${bts_series.bts_series_id}${urlString}.webp`, 
            signingParams
        );
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/bts_series/content/${urlString}/id${bts_series.bts_series_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...bts_series,
            bts_series_thumbnail: signedThumbnail,
            bts_series_url: signedContent
        }
    })
    return arr
}
async function getBTSMoviesAssets(array) {
    const arr = array.map((bts_movie) => {
        const urlString = getURLNamePath(bts_movie.bts_movies_name)
        const signedThumbnail = cfsign.getSignedUrl(
            `${distributionURL}/bts_movies/thumbnails/${urlString}/id${bts_movie.bts_movies_id}${urlString}.webp`, 
            signingParams
        );
        const signedContent = cfsign.getSignedUrl(
            `${distributionURL}/bts_movies/content/${urlString}/id${bts_movie.bts_movies_id}${urlString}.mp4`, 
            signingParams 
        )
        return {
            ...bts_movie,
            bts_movies_thumbnail: signedThumbnail,
            bts_movies_url: signedContent
        }
    })
    return arr
}